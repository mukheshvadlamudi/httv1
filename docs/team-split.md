# How to Tech - 3 Person Remote Team Split

## Shared Repository Structure

```text
how-to-tech/
  apps/
    web/                  # Next.js frontend
    api/                  # FastAPI backend
  docs/
    skills.md
    team-split.md
    api-contracts.md
  content/
    guides/               # JSON/Markdown guide drafts
  ai/
    prompts/
    rag/
    evals/
  database/
    migrations/
    seed/
  docker-compose.yml
  README.md
```

## Shared MVP Features

1. Landing page
2. Guide library
3. Guide detail page
4. Basic guide search
5. Ask How to Tech AI answer box
6. Admin or seed-based guide publishing
7. Feedback on guides and AI answers

---

## Person 3 - AI, Content, And RAG Owner (Your Role)

### Main Responsibilities

- Own guide content format and database seed alignment.
- Own first 10-20 beginner guides.
- Own system prompts for plain-language, simpler explanation, and safety refusals.
- Own retrieval logic (embeddings, search, and context formatting).
- Own evaluation set (25 baseline questions and expected matches).

### Tech Stack You Use

- Python
- pgvector / SQLModel / SQLAlchemy
- Open-source embedding models
- OpenAI / local Ollama / vLLM / Hugging Face model abstractions

### Definition of Done for Sprint 1

- First 10 beginner guides written in content JSON format.
- System prompts for plain language and RAG safety guardrails versioned in `ai/prompts/`.
- Prototype embedding & RAG search logic in python under `ai/rag/`.
- 25 eval questions written in `ai/evals/`.
