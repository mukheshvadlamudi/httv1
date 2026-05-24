import os
import json
import glob
import argparse

def load_env():
    """Loads environment variables from the local .env file if it exists."""
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.env"))
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ[key.strip()] = val.strip().strip("'\"")

def load_guides():
    """Loads all JSON guides from the content/guides folder."""
    guides_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../content/guides"))
    guides = []
    for file_path in glob.glob(os.path.join(guides_dir, "*.json")):
        with open(file_path, "r", encoding="utf-8") as f:
            guides.append(json.load(f))
    return guides

def load_evals():
    """Loads the 15 evaluation question pairs."""
    eval_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../evals/eval_questions.json"))
    if os.path.exists(eval_path):
        with open(eval_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def get_system_prompt():
    """Loads the system prompt template."""
    prompt_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../prompts/system_prompt.txt"))
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read()

def retrieve_guide(query, guides):
    """
    Retrieves the best matching guide for a given query.
    Implements a term-frequency overlap scoring mechanism:
    Scores guides based on matching words in title, tags, description, glossary, and steps.
    """
    query_words = [w.strip("?,.!-()\"'") for w in query.lower().split() if len(w) > 2]
    best_match = None
    best_score = 0
    
    for guide in guides:
        score = 0
        title_lower = guide["title"].lower()
        desc_lower = guide["description"].lower()
        tags_lower = [t.lower() for t in guide["tags"]]
        steps_lower = [s["title"].lower() + " " + s["body"].lower() for s in guide["steps"]]
        glossary_terms = [g["term"].lower() for g in guide.get("glossary", [])]
        glossary_defs = [g["definition"].lower() for g in guide.get("glossary", [])]
        
        # Check if full glossary term is contained in the query
        for term in glossary_terms:
            if term in query.lower():
                score += 15

        for word in query_words:
            # Title matches carry the highest weight
            if word in title_lower:
                score += 5
            # Glossary term match carries very high weight for vocabulary/definition queries
            if any(word in term for term in glossary_terms):
                score += 6
            # Tag matches carry high weight
            if any(word in tag for tag in tags_lower):
                score += 3
            # Description matches carry medium weight
            if word in desc_lower:
                score += 2
            # Glossary definition matches carry minor weight
            if any(word in d for d in glossary_defs):
                score += 1
            # Step text matches carry low weight
            if any(word in step for step in steps_lower):
                score += 1
                
        if score > best_score:
            best_score = score
            best_match = guide
            
    return best_match, best_score

def run_evaluations():
    """Runs search on all eval questions and computes system retrieval accuracy."""
    guides = load_guides()
    evals = load_evals()
    
    if not guides or not evals:
        print("[-] Error: Missing guides or evaluation questions.")
        return
        
    print("\n=======================================================")
    print("           HOW TO TECH RAG RETRIEVAL AUDIT             ")
    print("=======================================================\n")
    
    passed_count = 0
    total_count = len(evals)
    
    print(f"{'ID':<4} | {'User Question':<55} | {'Expected Guide':<30} | {'Status':<10}")
    print("-" * 110)
    
    for item in evals:
        question = item["question"]
        expected_slug = item["expected_guide_slug"]
        
        matched_guide, score = retrieve_guide(question, guides)
        matched_slug = matched_guide["slug"] if matched_guide else "None"
        
        # Verify match status
        status = "FAIL ❌"
        if matched_slug == expected_slug:
            status = "PASS Checkmark"
            passed_count += 1
            
        # Display cropped question for clean grid presentation
        cropped_question = question if len(question) <= 52 else question[:49] + "..."
        print(f"{item['id']:<4} | {cropped_question:<55} | {expected_slug:<30} | {status:<10}")
        
    accuracy = (passed_count / total_count) * 100
    print("-" * 110)
    print(f"\n[+] Total Evaluation Run: {total_count}")
    print(f"[+] Total Successes: {passed_count}")
    print(f"[+] Retrieval System Accuracy: {accuracy:.2f}%")
    print("=======================================================\n")

def call_llm(system_prompt, context, query):
    """Calls OpenAI or Gemini API if key is present; otherwise alerts the user."""
    openai_key = os.environ.get("OPENAI_API_KEY")
    gemini_key = os.environ.get("GEMINI_API_KEY")
    
    # Prioritize Gemini if set, as it offers a free tier
    if gemini_key:
        try:
            import requests
            print("\n[+] Querying Gemini API (gemini-flash-latest)...")
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={gemini_key}"
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": f"System Rules:\n{system_prompt}\n\nContext:\n{context}\n\nUser Question: {query}"}
                        ]
                    }
                ]
            }
            response = requests.post(url, headers=headers, json=payload)
            if response.status_code == 200:
                result = response.json()
                return result["candidates"][0]["content"]["parts"][0]["text"]
            else:
                print(f"\n[-] Gemini API Error {response.status_code}: {response.text}")
                return None
        except Exception as e:
            print(f"\n[-] Error calling Gemini API: {str(e)}")
            return None

    if openai_key and not openai_key.startswith("your_openai_api_key"):
        try:
            from openai import OpenAI
            client = OpenAI(api_key=openai_key)
            
            print("\n[+] Querying OpenAI API (gpt-4o-mini)...")
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Context/Approved Guide content:\n{context}\n\nUser Question: {query}"}
                ],
                temperature=0.2
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"\n[-] Error calling OpenAI API: {str(e)}")
            return None

    print("\n[!] Info: No active Gemini or OpenAI keys found.")
    print("To run a live LLM call, add a key to your ai/.env file:")
    print("  GEMINI_API_KEY=your_key_here")
    print("  or")
    print("  OPENAI_API_KEY=your_key_here")
    return None

def query_rag(query):
    """Retrieves context and prepares the system prompt payload for the LLM."""
    guides = load_guides()
    matched_guide, score = retrieve_guide(query, guides)
    
    print("\n==========================================")
    print("         RAG RETRIEVAL ENGINE             ")
    print("==========================================\n")
    print(f"[Query]: \"{query}\"\n")
    
    if matched_guide and score > 0:
        print(f"[Found Guide]: {matched_guide['title']} (Score: {score})")
        print(f"[Description]: {matched_guide['description']}")
        
        # Format retrieval context
        steps_text = "\n".join([f"Step {s['order']}: {s['title']}\n  {s['body']}" for s in matched_guide["steps"]])
        glossary_text = "\n".join([f"- {g['term']}: {g['definition']}" for g in matched_guide["glossary"]])
        
        context = f"CONTEXT INFORMATION:\n"
        context += f"Guide Title: {matched_guide['title']}\n"
        context += f"Steps:\n{steps_text}\n\n"
        context += f"Glossary terms:\n{glossary_text}"
    else:
        print("[!] No highly matched guide found. System will fallback to default helper guidelines.")
        context = "No specific guide available for this topic."

    system_prompt = get_system_prompt()
    
    print("\n[Generated Context Sent to LLM]:")
    print("-" * 60)
    print(context)
    print("-" * 60)
    
    print("\n[System Prompt Rules]:")
    print("-" * 60)
    print(system_prompt.strip())
    print("-" * 60)
    
    # Try calling the live LLM
    answer = call_llm(system_prompt, context, query)
    if answer:
        print("\n==========================================")
        print("         LIVE AI COACH RESPONSE           ")
        print("==========================================\n")
        print(answer)
        print("\n==========================================\n")
    else:
        print("\n[RAG Ready]: Ready to send context payload and user question to the model API.")
        print("==========================================\n")

if __name__ == "__main__":
    load_env()
    parser = argparse.ArgumentParser(description="How to Tech AI RAG Engine")
    parser.add_argument("--eval", action="store_true", help="Run the 15-question evaluation suite")
    parser.add_argument("--query", type=str, help="Submit a custom query to see retrieved context")
    args = parser.parse_args()
    
    if args.eval:
        run_evaluations()
    elif args.query:
        query_rag(args.query)
    else:
        # Default to a mock query demonstration
        query_rag("How can I reset my password?")
