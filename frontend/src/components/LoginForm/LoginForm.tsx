import Button from "../Button/Button";
import Alert from "../Alert/Alert";
import type { AlertType } from "../../types/AlertType";
import { login } from "../../services/api";
import "./LoginForm.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<AlertType | null>(null);

  async function handleSubmit() {
    try {
      await login({ username, password });
      await refreshUser();
      setAlert({ message: "Login successful!", type: "success" });
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setAlert({
          message: error.message,
          type: "warning",
        });
      } else {
        setAlert({ message: "Network error.", type: "error" });
      }
    }
  }

  return (
    <div className="LoginFormContainer">
      <form className="LoginForm">
        <div className="LoginFormRow">
          <div>Log In</div>
        </div>
        <div className="LoginFormRow">
          <input
            type="text"
            id="username"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="LoginFormRow">
          <input
            type="password"
            id="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="LoginFormRow">
          <Button onClick={handleSubmit}>Sign In</Button>
        </div>
      </form>
      {alert && <Alert text={alert.message} type={alert.type} />}
    </div>
  );
};

export default LoginForm;
