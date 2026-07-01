import HeaderBar from "../components/HeaderBar/HeaderBar";
import BudgetTable from "../components/BudgetTable/BudgetTable";
import "../styles/App.css";

const Budgets = () => {
  return (
    <div className="App">
      <HeaderBar title="Personal Finance Tracker" subtitle="Budgets" />
      <div className="PageContent">
        <BudgetTable />
      </div>
    </div>
  );
};

export default Budgets;
