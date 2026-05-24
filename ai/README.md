# How to Tech - AI, Prompts, & RAG Module

This directory contains the plain-language AI RAG (Retrieval-Augmented Generation) prototype, system prompts, evaluation suite, and knowledge-grounded guides.

## Directory Structure

```text
ai/
  prompts/
    system_prompt.txt   # Core rules for senior & beginner friendly plain-language responses
    simpler_prompt.txt  # Simple mode rules (further simplified phrasing)
  rag/
    rag_prototype.py    # Main search retriever, context formatter, and API orchestrator
  evals/
    eval_questions.json # 25 baseline questions and their expected guide matches
  .env                  # API Key configurations (ignored in git)
  requirements.txt      # Python dependencies
```

## Setup Instructions

1. **Initialize Virtual Environment**:
   ```bash
   python3 -m venv ai/.venv
   source ai/.venv/bin/activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r ai/requirements.txt
   ```

3. **Configure API Keys**:
   Create a file at `ai/.env` and add either a Gemini API Key or an OpenAI API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   # OR
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   *Note: The system automatically prioritizes the free-tier Gemini API if both keys are present.*

## How to Run

### 1. Run a RAG Query
Search for a topic or ask a question to see which guide is retrieved, how the context is formatted, and the model response:
```bash
python ai/rag/rag_prototype.py --query "How do I secure my account using two step verification?"
```

### 2. Run the 25-Question Evaluation Suite
Audits search retrieval accuracy against the 25 benchmark questions:
```bash
python ai/rag/rag_prototype.py --eval
```
*Current prototype retrieval system achieves **100% accuracy** on all 25 benchmark queries.*
