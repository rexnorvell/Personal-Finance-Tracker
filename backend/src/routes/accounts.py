from fastapi import APIRouter, Depends, HTTPException
from src.dependencies import get_current_user
from src.database import connect


router = APIRouter()

@router.get("/accounts")
def get_accounts(current_user = Depends(get_current_user)):
    connection = connect()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT a.id as id,
            a.name,
            a.starting_balance,
            a.starting_balance + (
                COALESCE(
                    SUM(
                        CASE
                            WHEN bc.type = 'income' THEN t.amount
                            WHEN bc.type = 'expense' THEN -t.amount
                            ELSE 0
                        END
                   ), 0
                )
            ) as current_balance
        FROM accounts a
        LEFT JOIN transactions t
            ON t.account_id = a.id
        LEFT JOIN budget_categories bc
            ON t.budget_category_id = bc.id
        WHERE a.is_active = TRUE
        GROUP BY
            a.id,
            a.name,
            a.starting_balance;
    """)
    accounts = cursor.fetchall()
    for account in accounts:
        account["starting_balance"] = float(account["starting_balance"])
        account["current_balance"] = float(account["current_balance"])
    connection.close()
    return accounts