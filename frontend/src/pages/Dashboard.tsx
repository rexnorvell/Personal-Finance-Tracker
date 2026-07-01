import HeaderBar from "../components/HeaderBar/HeaderBar";
import AccountsTable from "../components/AccountsTable/AccountsTable";
import TransactionsTable from "../components/TransactionsTable/TransactionsTable";
import "../styles/App.css";

const Dashboard = () => {
  return (
    <div className="App">
      <HeaderBar title="Personal Finance Tracker" subtitle="Dashboard" />
      <div className="PageContent">
        <AccountsTable />
        <TransactionsTable />
      </div>
    </div>
  );
};

export default Dashboard;
