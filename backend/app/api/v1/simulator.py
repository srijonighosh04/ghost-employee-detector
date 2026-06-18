from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import SimulationResultOut
from app.services.simulator import run_resignation_simulation

router = APIRouter()

@router.get("/{employee_id}", response_model=SimulationResultOut)
def run_simulation(employee_id: str, db: Session = Depends(get_db)):
    result = run_resignation_simulation(db, employee_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    return result
