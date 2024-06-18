import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "./assets/logo.png";
import profileImage from "./assets/profile.png"; // Replace with the actual path to the profile image

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const username = "username";

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar light">
      <div className="navbar__logo">
        <Link to="/">
          <img src={logo} alt="StayHeaven Logo" />
        </Link>
      </div>
      <ul className={`navbar__links ${menuOpen ? "active" : ""}`}>
        
        {isLoggedIn ? (
          <li className="navbar__username" onClick={toggleDropdown}>
            <div className="flex gap-4">
              <img
                src={profileImage}
                alt="Profile"
                className="navbar__profile-image"
              />
            </div>
            {dropdownOpen && (
              <div className="navbar__dropdown">
              <button className="navbar__close" onClick={toggleMenu}>
          ✖
        </button>
                <div className="mt-6">Profile</div>
                <div>Previous Bookings</div>
                <div>Dashboard</div>
                <div>Logout</div>
              </div>
            )}
          </li>
        ) : (
          <div className="flex gap-4">
            <li>
              <Link to="/signup" onClick={toggleMenu}>
                Sign Up
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={toggleMenu}>
                Login
              </Link>
            </li>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
