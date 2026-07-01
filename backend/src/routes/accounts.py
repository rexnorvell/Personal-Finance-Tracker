from fastapi import APIRouter, HTTPException
from src.database import connect


router = APIRouter()

@router.get("/accounts")
def get_accounts():
    connection = connect()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT *
        FROM accounts
        WHERE is_active = TRUE
    """)
    accounts = cursor.fetchall()
    for account in accounts:
        account["starting_balance"] = float(account["starting_balance"])
    connection.close()
    return accounts