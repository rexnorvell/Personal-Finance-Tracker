import Button from "../Button/Button";
import Alert from "../Alert/Alert";
import type { AlertType } from "../../types/alertType";
import "./LoginForm.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const LoginForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<AlertType | null>(null);

  async function handleSubmit() {
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setAlert({ message: "Login successful!", type: "success" });
        localStorage.setItem("auth", "true");
        navigate("/dashboard");
      } else {
        const err = await response.json();
        setAlert({ message: `Login failed: ${err.detail}`, type: "warning" });
      }
    } catch (error) {
      setAlert({ message: "Network error", type: "error" });
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
