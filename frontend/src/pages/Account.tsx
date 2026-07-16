import HeaderBar from "../components/HeaderBar/HeaderBar";
import Button from "../components/Button/Button";
import { logout } from "../services/api";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const navigate = useNavigate();

  return (
    <div className="App">
      <HeaderBar title="Personal Finance Tracker" subtitle="Account" />
      <div className="PageContent">
        <Button
          onClick={() => {
            navigate("/home");
            logout();
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Account;
