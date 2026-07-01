from fastapi import APIRouter, HTTPException
from src.database import connect


router = APIRouter()

@router.get("/budgets")
def get_budgets():
    connection = connect()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT
            b.name AS budget_name,
            bc.name AS category_name,
            bc.amount
        FROM budgets b
        JOIN budget_categories bc
            ON b.id = bc.budget_id
        ORDER BY bc.sort_order;
    """)
    rows = cursor.fetchall()
    budgets = {}
    for row in rows:
        budget_name = row["budget_name"]
        category_name = row["category_name"]
        amount = float(row["amount"])
        if budget_name not in budgets:
            budgets[budget_name] = {}
        budgets[budget_name][category_name] = amount
    connection.close()
    return budgets