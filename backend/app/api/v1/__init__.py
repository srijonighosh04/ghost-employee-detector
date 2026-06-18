from fastapi import APIRouter
from app.api.v1.employees import router as employees_router
from app.api.v1.projects import router as projects_router
from app.api.v1.teams import router as teams_router
from app.api.v1.documents import router as documents_router
from app.api.v1.simulator import router as simulator_router
from app.api.v1.assistant import router as assistant_router
from app.api.v1.handover import router as handover_router

api_router = APIRouter()

api_router.include_router(employees_router, prefix="/employees", tags=["Employees"])
api_router.include_router(projects_router, prefix="/projects", tags=["Projects"])
api_router.include_router(teams_router, prefix="/teams", tags=["Teams"])
api_router.include_router(documents_router, prefix="/documents", tags=["Documents"])
api_router.include_router(simulator_router, prefix="/simulator", tags=["Simulator"])
api_router.include_router(assistant_router, prefix="/assistant", tags=["Assistant"])
api_router.include_router(handover_router, prefix="/handover", tags=["Handover"])
