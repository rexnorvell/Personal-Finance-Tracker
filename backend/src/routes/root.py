from fastapi import APIRouter
from src.database import connect


router = APIRouter()

@router.get("/")
def root() -> dict[str, str]:
    return {"message": "Personal Finance Tracker backend running"}