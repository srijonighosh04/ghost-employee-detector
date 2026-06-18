from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Employee, Project
from app.schemas import EmployeeOut, EmployeeCreate, EmployeeUpdate
from app.services.risk_scoring import calculate_risk_score, get_risk_level
from app.services.neo4j_sync import sync_db_to_neo4j

router = APIRouter()

@router.get("/", response_model=List[EmployeeOut])
def get_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()

@router.get("/{employee_id}", response_model=EmployeeOut)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    return employee

@router.post("/", response_model=EmployeeOut, status_code=status.HTTP_201_CREATED)
def create_employee(employee_in: EmployeeCreate, db: Session = Depends(get_db)):
    # Check if ID already exists
    existing = db.query(Employee).filter(Employee.id == employee_in.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee with ID {employee_in.id} already exists"
        )
        
    # Get owned projects count
    owned_count = db.query(Project).filter(Project.owner_id == employee_in.id).count()
    
    # Calculate risk score dynamically if not pre-provided or if zero
    risk_score = employee_in.risk_score
    risk_level = employee_in.risk_level
    if risk_score == 0:
        risk_score = calculate_risk_score(
            tenure_years=employee_in.tenure_years,
            doc_coverage=employee_in.documentation_coverage,
            dependents=employee_in.dependents,
            owned_projects_count=owned_count
        )
        risk_level = get_risk_level(risk_score)
        
    employee = Employee(
        id=employee_in.id,
        name=employee_in.name,
        role=employee_in.role,
        team=employee_in.team,
        avatar_color=employee_in.avatar_color,
        initials=employee_in.initials,
        risk_score=risk_score,
        risk_level=risk_level,
        tenure_years=employee_in.tenure_years,
        documentation_coverage=employee_in.documentation_coverage,
        dependents=employee_in.dependents,
        last_active=employee_in.last_active
    )
    
    db.add(employee)
    db.commit()
    db.refresh(employee)
    
    # Trigger graph sync
    sync_db_to_neo4j(db)
    
    return employee

@router.put("/{employee_id}", response_model=EmployeeOut)
def update_employee(employee_id: str, employee_in: EmployeeUpdate, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
        
    update_data = employee_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(employee, field, value)
        
    # Recalculate risk score on changes to critical scoring properties
    owned_count = db.query(Project).filter(Project.owner_id == employee.id).count()
    employee.risk_score = calculate_risk_score(
        tenure_years=employee.tenure_years,
        doc_coverage=employee.documentation_coverage,
        dependents=employee.dependents,
        owned_projects_count=owned_count
    )
    employee.risk_level = get_risk_level(employee.risk_score)
    
    db.commit()
    db.refresh(employee)
    
    # Trigger graph sync
    sync_db_to_neo4j(db)
    
    return employee

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    db.delete(employee)
    db.commit()
    
    # Trigger graph sync
    sync_db_to_neo4j(db)
    
    return None
