import HeaderBar from "../components/HeaderBar/HeaderBar";
import TextBlock from "../components/TextBlock/TextBlock";
import Button from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="App">
      <HeaderBar
        title="Personal Finance Tracker"
        subtitle="Home"
        hamburgerMenuVisibility={false}
      />
      <div className="PageContent">
        <TextBlock
          text="Welcome to the Personal Finance Tracker!"
          textSize="Title"
        />
        <TextBlock
          text="The Personal Finance Tracker (PFT) is a tool allowing users to track their financial information like account balances, transactions, and budgets."
          textSize="Subtitle"
        />
        <div className="ButtonContainer">
          <Button
            onClick={() => {
              navigate("/login");
            }}
          >
            Log In
          </Button>
          <Button onClick={() => {}}>Sign Up</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
