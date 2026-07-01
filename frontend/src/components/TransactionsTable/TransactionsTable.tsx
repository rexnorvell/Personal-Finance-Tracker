import { useState, useEffect } from "react";
import Table from "../Table/Table";
import { getTransactions } from "../../services/api";
import { formatDate, formatDollarAmount } from "../../utils/format";

interface Props {
  refreshKey?: number;
}

type Transaction = {
  id: number;
  account: string;
  amount: number;
  date: string;
  notes: string;
};

const TransactionsTable = ({ refreshKey }: Props) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
      header: "Transaction ID",
      render: (transaction: Transaction) => transaction.id,
    },
    {
      header: "Account",
      render: (transaction: Transaction) => transaction.account,
    },
    {
      header: "Amount",
      render: (transaction: Transaction) =>
        formatDollarAmount(transaction.amount),
    },
    {
      header: "Date",
      render: (transaction: Transaction) => formatDate(transaction.date),
    },
    {
      header: "Notes",
      render: (transaction: Transaction) => transaction.notes,
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
