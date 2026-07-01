from fastapi import APIRouter, HTTPException
from src.database import connect
from pydantic import BaseModel
from decimal import Decimal
from datetime import date

class CreateTransactionRequest(BaseModel):
    date: date
    account_id: int
    amount: Decimal
    notes: str | None = None

router = APIRouter()

@router.get("/transactions")
def get_transactions():
    connection = connect()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT
            t.id,
            a.name AS account,
            t.date,
            t.amount,
            t.notes
        FROM transactions t
        JOIN accounts a
            ON t.account_id = a.id
        ORDER BY t.id
    """)
    transactions = cursor.fetchall()
    for transaction in transactions:
        transaction["amount"] = float(transaction["amount"])
    connection.close()
    return transactions

@router.post("/transactions")
def post_transaction(transaction: CreateTransactionRequest):
    connection = connect()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = connection.cursor(dictionary=True)
    cursor.execute(
        "SELECT id FROM accounts WHERE id = %s",
        (transaction.account_id,)
    )
    if cursor.fetchone() is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid account."
        )
    
    cursor.execute("""
        INSERT INTO transactions (
            date,
            account_id,
            amount,
            notes
        )
        VALUES (%s, %s, %s, %s)
        """,
        (
            transaction.date,
            transaction.account_id,
            transaction.amount,
            transaction.notes,
        ),
    )
    connection.commit()
    connection.close()
    print(transaction.date)
    print(type(transaction.date))
    return { "message": "Transaction created successfully." }