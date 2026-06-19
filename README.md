# Sentinel — Ghost Employee Detector

An AI-powered organizational knowledge continuity platform. Sentinel builds a live
Organizational Knowledge Graph out of employees, projects, documents, and teams, scores every
employee's Knowledge Risk, simulates the impact of a resignation before it happens, and
generates AI-drafted handover documentation to preserve what would otherwise walk out the door.

## Quick Start (Recommended)

### With Docker (one command)
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
docker-compose up --build
```
Frontend: http://localhost:3000 | Backend: http://localhost:8000

### Without Docker

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env   # add your GEMINI_API_KEY
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
# Optional: set NEXT_PUBLIC_API_URL=http://localhost:8000 in frontend/.env.local
npm run dev
```

Open http://localhost:3000.

> **Note:** The frontend runs fully on sample data without the backend. For real AI-powered
> assistant, handover, and simulation responses, start the backend with a `GEMINI_API_KEY`.

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes (for AI) | Get from [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `DATABASE_URL` | No | Defaults to SQLite. Use PostgreSQL URL for production. |
| `NEO4J_URI` | No | For knowledge graph sync. Leave blank to skip. |
| `NEXT_PUBLIC_API_URL` | No | Frontend → backend URL. Defaults to `http://localhost:8000`. |

## What's implemented

- **Frontend** (`frontend/`) — Complete Next.js app: landing page, full dashboard, interactive knowledge graph (React Flow), Resignation Impact Simulator, AI Knowledge Assistant, AI Handover Generator. Now connected to the real backend — falls back to sample data gracefully if the backend is offline.
- **Backend** (`backend/`) — FastAPI with SQLite/PostgreSQL, risk scoring engine, resignation simulator, AI assistant (Gemini), and AI handover generator (Gemini with template fallback).
- **AI Engine** (`ai-engine/`) — LangChain + ChromaDB RAG pipeline scaffolding, ready to wire in.
- **Knowledge Graph** (`knowledge-graph/`) — Neo4j models and Cypher queries, ready to connect.
- **Deployment** (`deployment/`) — Vercel (frontend) + Render (backend) configs.

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, React Flow
- **Backend:** FastAPI (Python)
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **AI/LLM:** Gemini 1.5 Flash
- **RAG & Search:** LangChain + ChromaDB
- **Knowledge Graph:** Neo4j
- **Deployment:** Vercel + Render / Docker

## API Docs

With the backend running, visit: http://localhost:8000/docs
