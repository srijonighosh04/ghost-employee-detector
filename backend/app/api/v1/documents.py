from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import DocumentRecord
from app.schemas import DocumentOut

router = APIRouter()

@router.get("/", response_model=List[DocumentOut])
def get_documents(db: Session = Depends(get_db)):
    return db.query(DocumentRecord).all()

@router.get("/{document_id}", response_model=DocumentOut)
def get_document(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(DocumentRecord).filter(DocumentRecord.id == document_id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID {document_id} not found"
        )
    return doc
