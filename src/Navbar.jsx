import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "./assets/logo.png";
import profileImage from "./assets/profile.png"; // Replace with the actual path to the profile image

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
          <div className="flex gap-1">
            <li className="">
              <Link to="/signup" onClick={toggleMenu}>
              <button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 max-[500px]:mt-2 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
<span class="relative px-5 py-2.5 max-[500px]:px-2 max-[500px]:py-1.5  transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
Sign Up
</span>
</button>
                
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={toggleMenu}>
              <button class="relative inline-flex max-[500px]:mt-2 items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
<span class="relative px-5 py-2.5 max-[500px]:px-2 max-[500px]:py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
Login
</span>
</button>
              </Link>
            </li>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
