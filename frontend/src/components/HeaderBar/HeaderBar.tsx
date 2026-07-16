import "./HeaderBar.css";
import HamburgerMenu from "../HamburgerMenu/HamburgerMenu";

interface Props {
  title: string;
  subtitle: string;
  hamburgerMenuVisibility?: boolean;
}

const HeaderBar = ({
  title,
  subtitle,
  hamburgerMenuVisibility = true,
}: Props) => {
  return (
    <div className="HeaderBar">
      <div className="LeftHeaderBar">
        <div className="Title">{title}</div>
        <div className="Subtitle">{subtitle}</div>
      </div>
      <div className="RightHeaderBar">
        {hamburgerMenuVisibility && <HamburgerMenu />}
      </div>
    </div>
  );
};

export default HeaderBar;
