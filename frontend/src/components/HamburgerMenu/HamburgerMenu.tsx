import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../Button/Button";
import hamburgerIcon from "../../assets/images/hamburger.svg";
import "./HamburgerMenu.css";

const HamburgerMenu = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: "Account", path: "/account" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Budgets", path: "/budgets" },
    { label: "Transactions", path: "/transactions" },
  ];

  return (
    <div className="HamburgerMenu">
      <Button
        className="HamburgerButton"
        onClick={() => setExpanded((prev) => !prev)}
        aria-label="Open navigation menu"
        aria-expanded={expanded}
      >
        <img src={hamburgerIcon} alt="" />
      </Button>
      {expanded && (
        <div className="Menu">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className="MenuItem"
              onClick={() => {
                navigate(item.path);
                setExpanded(false);
              }}
              style={{ cursor: "pointer" }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
