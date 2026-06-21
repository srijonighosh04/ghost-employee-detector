from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.core.seeds import seed_db
from app.api.v1 import api_router
from app.services.neo4j_sync import sync_db_to_neo4j

# Create tables in SQLite/PostgreSQL
Base.metadata.create_all(bind=engine)

# Seed database with mock data on startup
db = SessionLocal()
try:
    seed_db(db)
    # Attempt graph sync on start (will skip if NEO4J_URI not configured)
    sync_db_to_neo4j(db)
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for NexusIQ organizational risk continuity planner.",
    version="1.0.0",
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration to allow local Next.js frontend calls
# For production, set ALLOWED_ORIGINS env var to comma-separated list of frontend URLs
import os as _os
_origins_str = _os.environ.get("ALLOWED_ORIGINS", "*")
_origins = [o.strip() for o in _origins_str.split(",")] if _origins_str != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "database": settings.DATABASE_URL.split("://")[0]
    }
