from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import mysql.connector
import os

from src.database import connect, initialize
from src.routes.accounts import router as accounts_router
from src.routes.transactions import router as transactions_router
from src.routes.root import router as root_router
from src.routes.login import router as login_router
from src.routes.budgets import router as budgets_router
from src.routes.budgetCategories import router as budget_categories_router


load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    connection: mysql.connector = connect()
    if connection is not None:
        initialize(connection)
        connection.close()
    yield


app = FastAPI(lifespan=lifespan)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "../../frontend")
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accounts_router, prefix="/api")
app.include_router(transactions_router, prefix="/api")
app.include_router(root_router, prefix="/api")
app.include_router(login_router, prefix="/api")
app.include_router(budgets_router, prefix="/api")
app.include_router(budget_categories_router, prefix="/api")