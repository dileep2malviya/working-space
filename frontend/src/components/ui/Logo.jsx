import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="logo">
      SPACE<span className=" text-blue-500">HUB</span>
    </Link>
  );
};

export default Logo;