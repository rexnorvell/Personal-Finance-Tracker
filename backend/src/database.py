import json
import mysql.connector
import os
from pathlib import Path


def load_data(file_name: str) -> dict[str, tuple[float, bool]]:
    path = Path("data/" + file_name)
    with open(path, "r") as file:
        return json.load(file)


def initialize(connection: mysql.connector) -> None:
    cursor = connection.cursor()

    # Create the accounts table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        starting_balance DECIMAL(10,2) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE
    )
    """)
    connection.commit()
    print("Created \"accounts\" table")

    # Fill the accounts table with accounts and their starting balances
    bank_accounts: dict[str, tuple[float, bool]] = load_data("bank_accounts.json")
    for name, (starting_balance, is_active) in bank_accounts.items():
        cursor.execute("""
        INSERT INTO accounts 
            (name, starting_balance, is_active)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE starting_balance = VALUES(starting_balance), is_active = VALUES(is_active)
        """, (name, starting_balance, is_active)
        )
    connection.commit()
    print("Populated \"accounts\" table")

    # Create the transactions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        account_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        budget_category_id INT NOT NULL,
        date DATE NOT NULL DEFAULT (CURRENT_DATE),
        notes VARCHAR(255),
        
        CONSTRAINT fk_budget_category
            FOREIGN KEY (budget_category_id)
            REFERENCES budget_categories(id),
        CONSTRAINT fk_account
            FOREIGN KEY (account_id)
            REFERENCES accounts(id)
    )
    """)
    connection.commit()
    print("Created \"transactions\" table")

    # Create the users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
    )
    """)
    connection.commit()
    print("Created \"users\" table")

    # Fill the users table with users
    users: dict[str, str] = load_data("users.json")
    for username, password_hash in users.items():
        cursor.execute("""
        INSERT INTO users 
            (username, password_hash)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)
        """, (username, password_hash)
        )
    connection.commit()
    print("Populated \"users\" table")

    # Create the budgets table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS budgets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE
    )
    """)
    connection.commit()
    print("Created \"budgets\" table")

    # Create the budget_categories table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS budget_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        budget_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        sort_order INT NOT NULL,
        
        CONSTRAINT fk_budget
            FOREIGN KEY (budget_id)
            REFERENCES budgets(id)
            ON DELETE CASCADE,

        UNIQUE (budget_id, name)
    )
    """)
    connection.commit()
    print("Created \"budget_categories\" table")

    # Fill the budgets table with budgets
    budgets: dict[str, dict[str, float]] = load_data("budgets.json")
    for budget_name, category_details in budgets.items():
        cursor.execute("""
        INSERT INTO budgets 
            (name)
            VALUES (%s)
            ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);
        """, (budget_name,)
        )
        budget_id: int = cursor.lastrowid
        for sort_order, (category_name, amount) in enumerate(category_details.items(), start=1):
            cursor.execute("""
            INSERT INTO budget_categories
                (budget_id, name, amount, sort_order)
                VALUES (%s, %s, %s, %s)
                           
                ON DUPLICATE KEY UPDATE amount = VALUES(amount), sort_order = VALUES(sort_order)
            """, (budget_id, category_name, amount, sort_order)
            )
    connection.commit()
    print("Populated \"budgets\" and \"budget_categories\" tables")



def connect() -> mysql.connector:
    try:
        return mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("APP_DATABASE")
        )
    except Exception as e:
        print(f"Error: {e}")
        return None