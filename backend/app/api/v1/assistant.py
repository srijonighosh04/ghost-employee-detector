from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import ChatRequest, ChatResponse
from app.services.ai_assistant import answer_user_query

router = APIRouter()

@router.post("/", response_model=ChatResponse)
def ask_assistant(request: ChatRequest, db: Session = Depends(get_db)):
    result = answer_user_query(db, request.message)
    return result

@router.post("/chat", response_model=ChatResponse)
def ask_assistant_chat(request: ChatRequest, db: Session = Depends(get_db)):
    result = answer_user_query(db, request.message)
    return result
