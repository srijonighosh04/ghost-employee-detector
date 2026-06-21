# NexusIQ — Knowledge Continuity & Risk Radar

NexusIQ helps organizations map knowledge, score knowledge risk, simulate resignations, and generate AI-assisted handover briefs so critical context doesn't walk out the door.

## Quick links
1. Backend: https://nexusiq-backend.onrender.com
2. Backend API base: https://nexusiq-backend.onrender/api/v1/

## Quick start (local)

1) Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy ..\.env.example .env
set GEMINI_API_KEY=your_key_here
venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

2) Frontend

```bash
cd frontend
npm ci
npm run dev
# open http://localhost:3000
```

## Notes
- The frontend includes sample data and will work without a running backend for exploration. To enable AI features, set `GEMINI_API_KEY` in the backend environment.
- Use `DATABASE_URL` to point to Postgres in production; defaults to local SQLite for development.

## Repository structure
- `frontend/` — Next.js 14 app (TypeScript, Tailwind)
- `backend/` — FastAPI app, models, services, and tests
- `ai-engine/` — RAG + pipeline scaffolding
- `knowledge-graph/` — Neo4j models and Cypher queries
- `deployment/` — Vercel + Render config

## Running tests

Backend (pytest):

```powershell
cd backend
venv\Scripts\python.exe -m pytest -q
```

Frontend build (production):

```bash
cd frontend
npm run build
```

## Contributing

1. Create a feature branch: `git checkout -b feat/your-change`
2. Make changes, run tests and build locally.
3. Push and open a PR against `main`.

## Built by: 
1. Frontend and deployment - Aniruddh Viswarajan
2. Backend and AI Engine - Srijoni Ghosh

## Vision

NexusIQ aims to transform organizational knowledge from an invisible operational risk into a measurable, searchable, and protected strategic asset.

By combining Knowledge Graphs, Agentic AI, and Retrieval-Augmented Generation, NexusIQ helps organizations ensure that critical knowledge remains accessible long after employees move on.

# Built for The Arch: RAG & Agentic AI Hackathon 2026.
