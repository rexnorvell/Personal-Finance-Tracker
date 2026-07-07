import { useState, useEffect } from "react";
import Table from "../Table/Table";
import { getTransactions } from "../../services/api";
import { formatDate, formatDollarAmount } from "../../utils/format";
import type { TransactionType } from "../../types/TransactionType";

interface Props {
  refreshKey?: number;
}

const TransactionsTable = ({ refreshKey }: Props) => {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, [refreshKey]);

  async function loadTransactions() {
    setLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    {
      header: "ID",
      render: (transaction: TransactionType) => transaction.id,
    },
    {
      header: "Account",
      render: (transaction: TransactionType) => transaction.account,
    },
    {
      header: "Amount",
      render: (transaction: TransactionType) =>
        formatDollarAmount(transaction.amount),
    },
    {
      header: "Category",
      render: (transaction: TransactionType) => transaction.budget_category,
    },
    {
      header: "Date",
      render: (transaction: TransactionType) => formatDate(transaction.date),
    },
    {
      header: "Notes",
      render: (transaction: TransactionType) => transaction.notes,
    },
  ];

  return (
    <>
      <Table
        data={loading ? [] : transactions}
        columns={columns}
        title="Transactions"
      />
    </>
  );
};

export default TransactionsTable;
