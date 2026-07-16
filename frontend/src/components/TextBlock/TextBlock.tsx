import "./TextBlock.css";

interface Props {
  text: string;
  textSize: "Title" | "Subtitle" | "Body";
}

const TextBlock = ({ text, textSize }: Props) => {
  return <div className={`TextBlock ${textSize}`}>{text}</div>;
};

export default TextBlock;
