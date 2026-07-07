from fastapi import Cookie, HTTPException
from src.database import connect
from datetime import datetime


def get_current_user(session: str | None = Cookie(default=None)):
    if session is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    connection = connect()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    try:
        now = datetime.now()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            DELETE FROM sessions
            WHERE expires_at <= %s
        """, (now,))
        connection.commit()
        cursor.execute("""
            SELECT u.id, u.username
            FROM sessions s
            JOIN users u
                ON s.user_id = u.id
            WHERE s.id = %s
                AND s.expires_at > %s
        """, (session, now))
        user = cursor.fetchone()
        if user is None:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return user
    finally:
        connection.close()