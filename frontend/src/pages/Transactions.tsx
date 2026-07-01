import HeaderBar from "../components/HeaderBar/HeaderBar";
import TransactionForm from "../components/TransactionForm/TransactionForm";
import TransactionsTable from "../components/TransactionsTable/TransactionsTable";
import { useState } from "react";
import "../styles/App.css";

const Transactions = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshTransactions = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="App">
      <HeaderBar title="Personal Finance Tracker" subtitle="Transactions" />
      <div className="PageContent">
        <TransactionForm onSuccess={refreshTransactions} />
        <TransactionsTable refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default Transactions;
