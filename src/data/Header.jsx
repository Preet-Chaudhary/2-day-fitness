import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/Auth/AuthModal";
import UserProfile from "../components/Auth/UserProfile";
import "./Header.css";
import Logo from "../assets/new logo.png"; // fixed naming convention issue
import Bars from "../assets/bars.png";

const Header = () => {
  const [mobile, setMobile] = useState(window.innerWidth <= 768);
  const [menuOpened, setMenuOpened] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div className="header" id="home">
        <img className="logo" src={Logo} alt="Logo" />
        {menuOpened === false && mobile ? (
          <div
            style={{
              backgroundColor: "var(--appColor)",
              padding: "0.5rem",
              borderRadius: "50%",
            }}
            onClick={() => setMenuOpened(true)}
          >
            <img
              src={Bars}
              alt="Menu"
              style={{ width: "1.5rem", height: "1rem" }}
            />
          </div>
        ) : (
          <ul className="header-menu">
            <li>
              <Link
                onClick={() => setMenuOpened(false)}
                to="home"
                spy={true}
                smooth={true}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setMenuOpened(false)}
                to="programs"
                spy={true}
                smooth={true}
              >
                Programs
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setMenuOpened(false)}
                to="reason"
                spy={true}
                smooth={true}
              >
                Why Us
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setMenuOpened(false)}
                to="planscon"
                spy={true}
                smooth={true}
              >
                Plans
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setMenuOpened(false)}
                to="test"
                spy={true}
                smooth={true}
              >
                Testimonials
              </Link>
            </li>
            <li>
              {isAuthenticated ? (
                <UserProfile />
              ) : (
                <button 
                  onClick={() => {
                    setAuthModalOpen(true);
                    setMenuOpened(false);
                  }}
                >
                  Sign Up / Login
                </button>
              )}
            </li>
          </ul>
        )}
      </div>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Header;
