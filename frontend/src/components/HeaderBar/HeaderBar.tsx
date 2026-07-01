import "./HeaderBar.css";
import HamburgerMenu from "../HamburgerMenu/HamburgerMenu";

interface Props {
  title: string;
  subtitle: string;
}

const HeaderBar = ({ title, subtitle }: Props) => {
  return (
    <div className="HeaderBar">
      <div className="LeftHeaderBar">
        <div className="Title">{title}</div>
        <div className="Subtitle">{subtitle}</div>
      </div>
      <div className="RightHeaderBar">
        <HamburgerMenu />
      </div>
    </div>
  );
};

export default HeaderBar;
