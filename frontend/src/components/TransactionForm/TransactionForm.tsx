import Button from "../Button/Button";
import Alert from "../Alert/Alert";
import "./TransactionForm.css";
import { useState, useEffect } from "react";
import type { AccountType } from "../../types/AccountType";
import type { AlertType } from "../../types/AlertType";
import type { BudgetCategoryType } from "../../types/BudgetCategoryType";
import {
  getAccounts,
  getBudgetCategories,
  createTransaction,
} from "../../services/api";

interface Props {
  onSuccess: () => void;
}

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
        const data: AccountType[] = await getAccounts();
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
        const data: BudgetCategoryType[] = await getBudgetCategories();
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
      await createTransaction({
        account_id: account.id,
        amount: parsedAmount,
        budget_category_id: category.id,
        date,
        notes,
      });

      setAlert({
        message: "Transaction successfully added!",
        type: "success",
      });

      onSuccess?.();
    } catch (error) {
      setAlert({
        message:
          error instanceof Error
            ? error.message
            : "Transaction submission failed.",
        type: "warning",
      });
    }
  }

  return (
    <div className="TransactionFormContainer">
      <form className="TransactionForm">
        <div className="TransactionFormRow">
          <div>Add Transaction</div>
        </div>
        <div className="TransactionFormRow">
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
          <input
            type="number"
            step="0.01"
            id="amount"
            min="0"
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="TransactionFormRow">
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
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="TransactionFormRow">
          <input
            type="text"
            id="notes"
            placeholder="Notes"
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="TransactionFormRow">
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </form>
      {alert && <Alert text={alert.message} type={alert.type} />}
    </div>
  );
};

export default TransactionForm;
