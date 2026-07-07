from fastapi import APIRouter, Depends, HTTPException
from src.dependencies import get_current_user
from src.database import connect
from pydantic import BaseModel
from decimal import Decimal
from datetime import date

class CreateTransactionRequest(BaseModel):
    account_id: int
    amount: Decimal
    budget_category_id: int
    date: date
    notes: str | None = None

router = APIRouter()

@router.get("/transactions")
def get_transactions(current_user = Depends(get_current_user)):
    connection = connect()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT
            t.id,
            a.id AS account_id,
            a.name AS account,
            t.amount,
            bc.id AS budget_category_id,
            bc.name AS budget_category,
            t.date,
            t.notes
        FROM transactions t
        JOIN accounts a
            ON t.account_id = a.id
        JOIN budget_categories bc
            ON t.budget_category_id = bc.id
        ORDER BY t.id
    """)
    transactions = cursor.fetchall()
    for transaction in transactions:
        transaction["amount"] = float(transaction["amount"])
    connection.close()
    return transactions

@router.post("/transactions")
def post_transaction(transaction: CreateTransactionRequest, current_user = Depends(get_current_user)):
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
    
    cursor.execute(
        "SELECT id FROM budget_categories WHERE id = %s",
        (transaction.budget_category_id,)
    )
    if cursor.fetchone() is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid budget category."
        )
    
    cursor.execute("""
        INSERT INTO transactions (
            account_id,
            amount,
            budget_category_id,
            date,
            notes
        )
        VALUES (%s, %s, %s, %s, %s)
        """,
        (
            transaction.account_id,
            transaction.amount,
            transaction.budget_category_id,
            transaction.date,
            transaction.notes,
        ),
    )
    connection.commit()
    connection.close()
    return { "message": "Transaction created successfully." }