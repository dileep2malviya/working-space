import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/Navbar.css";
import Logo from "../ui/Logo";
import CustomButton from "../ui/button";
import { getSessionUser, getUserRole } from "@/features/auth/authSelectors";
import { de } from "zod/v4/locales";

const Navbar = () => {
  const navigate = useNavigate();

  const sessionUser = getSessionUser();
  const role = getUserRole()?.toLowerCase();

  const handleLogin = () => {
    if (sessionUser) {
      if(role === "admin"){
        navigate("/admin/bookings");
      }else{
         navigate("/member/bookings");
      }
    } else {
      navigate("/login");
    }
  }

  const handleRegister = () => {
    sessionStorage.clear()
    navigate("/register")
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Logo />

        {/* <nav className="nav-links">
          <Link to="/spaces">Spaces</Link>
        </nav> */}

        <div className="nav-actions">
          <CustomButton
            type="button"
            onclick={handleLogin}
            className="btn btn-outline"
          >
            Login
          </CustomButton>

          <CustomButton
            type="button"
            onclick={handleRegister}
            className="btn btn-primary"
          >
            Register
          </CustomButton>
        </div>
      </div>
    </header>
  );
};

export default Navbar;