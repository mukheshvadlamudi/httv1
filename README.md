# How to Tech

**How to Tech** is a plain-language technology learning product designed by **Futurelab Studios**. It helps beginners and developer-track users learn technology in a clear, structured way.

---

## 🚀 Shared Repository Structure

```text
how-to-tech/
  apps/
    web/                  # Next.js frontend
    api/                  # FastAPI backend (by Backend Owner)
  docs/
    skills.md
    team-split.md
    api-contracts.md      # API endpoint documentation
  content/
    guides/               # Markdown or JSON guide drafts (by AI Owner)
  ai/
    prompts/
    rag/
    evals/
  database/
    migrations/
    seed/
  docker-compose.yml      # Local database stack (pgvector)
  convert_vault.py        # Python parser to import Knowledge Vault Excel
  README.md
```

---

## 🛠️ Tech Stack & Requirements

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, lucide-react, TanStack Query
- **Backend**: FastAPI, SQLAlchemy, Alembic, PostgreSQL with pgvector (in Docker)
- **AI Layer**: Ollama, vLLM, Hugging Face, or OpenAI APIs (with key capability)
- **Environment**: Node.js `v20+`, Python `3.10+`, Docker Desktop

---

## 💻 Local Setup & Development

### 1. Extract the Knowledge Vault
The **Developer & Tech Hub** track is populated dynamically from `Futurelab Knowledge Vault.xlsx`. Run the parser script to generate the resource database for the Next.js app:
```bash
# Install the required parsing packages
pip install openpyxl

# Parse and convert the spreadsheet
python convert_vault.py
```

### 2. Run the Next.js Frontend
```bash
# Navigate to web app
cd apps/web

# Install dependencies
npm install

# Run the dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Spin Up the Database
```bash
# Starts Postgres (pgvector) and pgAdmin (on port 8080)
docker compose up -d
```

---

## 🤝 Team Workflow Rules
1. **Branch Naming**:
   - `ui/feature-name`
   - `backend/feature-name`
   - `ai/feature-name`
2. **Pull Requests**: Never push to `main` directly. Ensure response structures align perfectly with `docs/api-contracts.md`.
