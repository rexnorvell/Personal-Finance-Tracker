import "./Alert.css";

interface Props {
  text: string;
  type: "warning" | "error" | "success";
}

const Alert = ({ text, type }: Props) => {
  return <div className={`Alert Alert--${type}`}>{text}</div>;
};

export default Alert;
