import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "./assets/logo.png";
import profileImage from "./assets/profile.png"; // Replace with the actual path to the profile image

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to true for demonstration
  const username = "username"; // Replace with the actual username

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar light">
      <div className="navbar__logo">
        <Link to="/">
          <img src={logo} alt="StayHeaven Logo" />
        </Link>
      </div>
      <button className="navbar__toggle" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`navbar__links ${menuOpen ? "active" : ""}`}>
        <button className="navbar__close" onClick={toggleMenu}>
          ✖
        </button>
        {isLoggedIn ? (
          <>
            <li className="navbar__username">
              <Link to="/profile" onClick={toggleMenu}>
                <img
                  src={profileImage}
                  alt="Profile"
                  className="navbar__profile-image"
                />
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signup" onClick={toggleMenu}>
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
