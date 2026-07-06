import type { ReactNode } from "react";
import "./Button.css";

interface Props {
  color?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  ariaExpanded?: boolean;
}

const Button = ({
  color = "primary",
  type = "button",
  onClick,
  children,
  className = "",
  ariaLabel,
  ariaExpanded,
}: Props) => {
  return (
    <button
      className={`Button Button--${color} ${className}`}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
    >
      {children}
    </button>
  );
};

export default Button;
