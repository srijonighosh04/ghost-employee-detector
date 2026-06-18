from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import HandoverOut
from app.services.handover_generator import generate_handover_document

router = APIRouter()

@router.get("/{employee_id}", response_model=HandoverOut)
def get_handover(employee_id: str, db: Session = Depends(get_db)):
    result = generate_handover_document(db, employee_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    return result

@router.post("/{employee_id}", response_model=HandoverOut)
def generate_handover(employee_id: str, db: Session = Depends(get_db)):
    result = generate_handover_document(db, employee_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    return result
