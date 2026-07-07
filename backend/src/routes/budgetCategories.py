from fastapi import APIRouter, Depends, HTTPException
from src.dependencies import get_current_user
from src.database import connect


router = APIRouter()

@router.get("/budgetCategories")
def get_budget_categories(current_user = Depends(get_current_user)):
    connection = connect()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT
            bc.id,
            b.id AS budget_id,
            b.name AS budget_name,
            bc.name AS category_name,
            bc.amount,
            bc.type,
            bc.sort_order
        FROM budget_categories bc
        JOIN budgets b
            ON b.id = bc.budget_id
        ORDER BY bc.sort_order;
    """)
    budgetCategories = cursor.fetchall()
    connection.close()
    return budgetCategories