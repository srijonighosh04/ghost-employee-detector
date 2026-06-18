# Backend — FastAPI

Scaffolded, not implemented yet.

Planned structure:
- `app/api/v1` — REST route handlers (employees, projects, risk-scores, simulator, assistant, handover)
- `app/core` — config, security, dependency wiring
- `app/models` — ORM models (PostgreSQL)
- `app/schemas` — Pydantic request/response schemas
- `app/services` — business logic (risk scoring engine, simulator engine, Gemini + LangChain orchestration, Neo4j sync)
- `app/utils` — shared helpers
- `tests` — pytest suite

Suggested entrypoint: `app/main.py` (FastAPI app instance, CORS, router registration).
