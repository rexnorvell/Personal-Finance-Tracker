import Button from "../Button/Button";
import Alert from "../Alert/Alert";
import "./TransactionForm.css";
import { useState, useEffect } from "react";
import type { AccountType } from "../../types/accountType";
import type { AlertType } from "../../types/alertType";
import type { BudgetCategoryType } from "../../types/budgetCategoryType";

interface Props {
  onSuccess: () => void;
}

const API_URL = "http://localhost:8000";

const TransactionForm = ({ onSuccess }: Props) => {
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [account, setAccount] = useState<AccountType | null>(null);
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [category, setCategory] = useState<BudgetCategoryType | null>(null);
  const [categories, setCategories] = useState<BudgetCategoryType[]>([]);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [alert, setAlert] = useState<AlertType | null>(null);

  useEffect(() => {
    async function loadAccounts() {
      try {
        const response = await fetch(`${API_URL}/api/accounts`);

        if (!response.ok) {
          throw new Error("Failed to load accounts.");
        }

        const data: AccountType[] = await response.json();
        setAccounts(data);
      } catch (error) {
        setAlert({
          message: "Unable to load accounts.",
          type: "error",
        });
      }
    }

    async function loadBudgetCategories() {
      try {
        const response = await fetch(`${API_URL}/api/budgetCategories`);

        if (!response.ok) {
          throw new Error("Failed to load budget categories.");
        }

        const data: BudgetCategoryType[] = await response.json();
        setCategories(data);
      } catch (error) {
        setAlert({
          message: "Unable to load budget categories.",
          type: "error",
        });
      }
    }

    loadAccounts();
    loadBudgetCategories();
  }, []);

  async function handleSubmit() {
    if (!account) {
      setAlert({
        message: "Please select an account.",
        type: "warning",
      });
      return;
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAlert({
        message: "Please enter a valid amount.",
        type: "warning",
      });
      return;
    }

    if (!category) {
      setAlert({
        message: "Please select a category.",
        type: "warning",
      });
      return;
    }

    if (!date) {
      setAlert({
        message: "Please select a date.",
        type: "warning",
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_id: account.id,
          amount,
          budget_category_id: category.id,
          date,
          notes,
        }),
      });

      if (response.ok) {
        setAlert({
          message: "Transaction successfully added!",
          type: "success",
        });
        onSuccess?.();
      } else {
        const err = await response.json();
        setAlert({
          message: `Transaction submission failed: ${err.detail}`,
          type: "warning",
        });
      }
    } catch (error) {
      setAlert({ message: "Network error", type: "error" });
    }
  }

  return (
    <>
      <form className="TransactionForm">
        <div className="TransactionFormRow">
          <div>Add Transaction</div>
        </div>
        <div className="TransactionFormRow">
          <label>Account:</label>
          <select
            value={account?.id ?? ""}
            onChange={(e) => {
              const selectedAccount = accounts.find(
                (a) => a.id === Number(e.target.value),
              );

              setAccount(selectedAccount ?? null);
            }}
          >
            <option value="">Select an account</option>

            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
        <div className="TransactionFormRow">
          <label>Amount:</label>
          <input
            type="number"
            step="0.01"
            id="amount"
            min="0"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="TransactionFormRow">
          <label>Category:</label>
          <select
            value={category?.id ?? ""}
            onChange={(e) => {
              const selectedCategory = categories.find(
                (c) => c.id === Number(e.target.value),
              );

              setCategory(selectedCategory ?? null);
            }}
          >
            <option value="">Select a category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>
        <div className="TransactionFormRow">
          <label>Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="TransactionFormRow">
          <label>Notes:</label>
          <input
            type="text"
            id="notes"
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="TransactionFormRow">
          <Button text="Submit" onClick={handleSubmit}></Button>
        </div>
      </form>
      {alert && <Alert text={alert.message} type={alert.type} />}
    </>
  );
};

export default TransactionForm;
