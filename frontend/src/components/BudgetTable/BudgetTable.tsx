import { useState, useEffect } from "react";
import Table from "../Table/Table";
import { getBudgets } from "../../services/api";
import { formatDollarAmount } from "../../utils/format";

type Budgets = Record<string, Record<string, number>>;

type BudgetCategoryRow = {
  name: string;
  amount: number;
};

const BudgetTable = () => {
  const [budgets, setBudgets] = useState<Budgets>({});

  useEffect(() => {
    loadBudgets();
  }, []);

  async function loadBudgets() {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (err) {
      console.error(err);
    }
  }

  const columns = [
    {
      header: "Category",
      render: (row: BudgetCategoryRow) => row.name,
    },
    {
      header: "Amount",
      render: (row: BudgetCategoryRow) => formatDollarAmount(row.amount),
    },
  ];

  return (
    <>
      {Object.entries(budgets).map(([budgetName, categories]) => {
        const rows = Object.entries(categories).map(([name, amount]) => ({
          name,
          amount,
        }));

        return (
          <div key={budgetName}>
            <Table data={rows} columns={columns} title={budgetName} />
          </div>
        );
      })}
    </>
  );
};

export default BudgetTable;
