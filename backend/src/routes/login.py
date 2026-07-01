from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from argon2 import PasswordHasher
from src.database import connect


router = APIRouter()
ph = PasswordHasher()


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(data: LoginRequest):
    connection = connect()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT username, password_hash
        FROM users
        WHERE username = %s
    """, (data.username,))
    user = cursor.fetchone()
    connection.close()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    try:
        ph.verify(user["password_hash"], data.password)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful"}