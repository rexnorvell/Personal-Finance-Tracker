from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError
from src.database import connect
import secrets
from datetime import datetime, timedelta


router = APIRouter()
ph = PasswordHasher()


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(data: LoginRequest, response: Response):
    connection = connect()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, password_hash
            FROM users
            WHERE username = %s
        """, (data.username,))
        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        try:
            ph.verify(user["password_hash"], data.password)
        except VerifyMismatchError:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        except VerificationError:
            raise HTTPException(status_code=500, detail="Authentication error")

        session_id = secrets.token_urlsafe(32)
        expires_at = datetime.now() + timedelta(hours=8)
        cursor = connection.cursor()
        cursor.execute(
            "DELETE FROM sessions WHERE user_id = %s",
            (user["id"],)
        )
        cursor.execute("""
            INSERT INTO sessions (id, user_id, expires_at)
            VALUES (%s, %s, %s)
        """, (session_id, user["id"], expires_at))
        connection.commit()
    finally:
        connection.close()

    response.set_cookie(
        key="session",
        value=session_id,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 8,
    )

    return {"message": "Login successful"}