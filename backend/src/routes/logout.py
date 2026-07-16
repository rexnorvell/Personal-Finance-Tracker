from fastapi import APIRouter, Cookie, HTTPException, Response
from src.database import connect

router = APIRouter()


@router.post("/logout")
def logout(response: Response, session: str | None = Cookie(default=None)):
    if session is None:
        return {"message": "Already logged out."}

    connection = connect()
    if connection is None:
        raise HTTPException(
            status_code=500,
            detail="Database connection failed."
        )

    try:
        cursor = connection.cursor()
        cursor.execute(
            "DELETE FROM sessions WHERE id = %s",
            (session,)
        )
        connection.commit()
    finally:
        connection.close()

    response.delete_cookie(
        key="session",
        httponly=True,
        secure=False,
        samesite="lax",
    )

    return {"message": "Logout successful."}