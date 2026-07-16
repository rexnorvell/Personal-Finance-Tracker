import HeaderBar from "../components/HeaderBar/HeaderBar";
import LoginForm from "../components/LoginForm/LoginForm";
import "../styles/App.css";

const Login = () => {
  return (
    <div className="App">
      <HeaderBar
        title="Personal Finance Tracker"
        subtitle="Login"
        hamburgerMenuVisibility={false}
      />
      <div className="PageContent">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
