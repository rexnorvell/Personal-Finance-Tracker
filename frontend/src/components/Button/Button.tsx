import "./Button.css";

interface Props {
  color?: "primary" | "secondary";
  onClick: () => void;
  text: string;
}

const Button = ({ color = "primary", onClick, text }: Props) => {
  return (
    <div className={`Button Button--${color}`} onClick={onClick}>
      {text}
    </div>
  );
};

export default Button;
