import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "./assets/logo.png";
import profileImage from "./assets/profile.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "./utils/axios";
import { toggleLogin } from "./app/reducers/userSlice";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(useSelector((state) => state.isLoggedIn));
  const [fixed, setfixed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const logouthandler = () => {
    axios.post("/user/logout", {}, {
      withCredentials: true, // Important: This sends cookies with the request
    })
    dispatch(toggleLogin(false))
    navigate("/")
  }

  return (
    <nav className={`navbar light ${fixed ? "fixed top-0 left-0 w-full z-10" : ""}`}>
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
                <div onClick={logouthandler}>Logout</div>
              </div>
            )}
          </li>
        ) : (
          <div className="flex gap-1">
            <li>
              <Link to="/signup" onClick={toggleMenu}>
                <button className="button-animation relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-gray-900 dark:hover:text-white focus:ring-4 max-[500px]:mt-2 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
                  <span className="span-mother relative px-5 py-2.5 max-[500px]:px-2 max-[500px]:py-1.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                    <span>S</span>
                    <span>i</span>
                    <span>g</span>
                    <span>n</span>
                    <span> </span>
                    <span>U</span>
                    <span>p</span>
                  </span>
                  <span className="span-mother2">
                    <span>S</span>
                    <span>i</span>
                    <span>g</span>
                    <span>n</span>
                    <span> </span>
                    <span>U</span>
                    <span>p</span>
                  </span>
                </button>
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={toggleMenu}>
                <button className="button-animation relative inline-flex max-[500px]:mt-2 items-center justify-center p-0.5 mr-12 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-gray-900 dark:hover:text-white focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
                  <span className="span-mother relative px-5 py-2.5 max-[500px]:px-2 max-[500px]:py-1.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                    <span>L</span>
                    <span>o</span>
                    <span>g</span>
                    <span>i</span>
                    <span>n</span>
                  </span>
                  <span className="span-mother2">
                    <span>L</span>
                    <span>o</span>
                    <span>g</span>
                    <span>i</span>
                    <span>n</span>
                  </span>
                </button>
              </Link>
            </li>

            <li>
              <label id="theme-toggle-button">
                <input type="checkbox" id="toggle" />
                <svg viewBox="0 0 69.667 44" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(3.5 3.5)" data-name="Component 15 – 1" id="Component_15_1">
                    <g filter="url(#container)" transform="matrix(1, 0, 0, 1, -3.5, -3.5)">
                      <rect fill="#83cbd8" transform="translate(3.5 3.5)" rx="17.5" height="35" width="60.667" data-name="container" id="container"></rect>
                    </g>
                    <g transform="translate(2.333 2.333)" id="button">
                      <g data-name="sun" id="sun">
                        <g filter="url(#sun-outer)" transform="matrix(1, 0, 0, 1, -5.83, -5.83)">
                          <circle fill="#f8e664" transform="translate(5.83 5.83)" r="15.167" cy="15.167" cx="15.167" data-name="sun-outer" id="sun-outer-2"></circle>
                        </g>
                        <g filter="url(#sun)" transform="matrix(1, 0, 0, 1, -5.83, -5.83)">
                          <path fill="rgba(246,254,247,0.29)" transform="translate(9.33 9.33)" d="M11.667,0A11.667,11.667,0,1,1,0,11.667,11.667,11.667,0,0,1,11.667,0Z" data-name="sun" id="sun-3"></path>
                        </g>
                        <circle fill="#fcf4b9" transform="translate(8.167 8.167)" r="7" cy="7" cx="7" id="sun-inner"></circle>
                      </g>
                      <g data-name="moon" id="moon">
                        <g filter="url(#moon)" transform="matrix(1, 0, 0, 1, -31.5, -5.83)">
                          <circle fill="#cce6ee" transform="translate(31.5 5.83)" r="15.167" cy="15.167" cx="15.167" data-name="moon" id="moon-3"></circle>
                        </g>
                        <g fill="#a6cad0" transform="translate(-24.415 -1.009)" id="patches">
                          <circle transform="translate(43.009 4.496)" r="2" cy="2" cx="2"></circle>
                          <circle transform="translate(39.366 17.952)" r="2" cy="2" cx="2" data-name="Ellipse 130"></circle>
                          <circle transform="translate(54.667 20.602)" r="3.5" cy="3.5" cx="3.5" data-name="Ellipse 131"></circle>
                          <circle transform="translate(50.232 32.099)" r="2.5" cy="2.5" cx="2.5" data-name="Ellipse 132"></circle>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </label>
            </li>
          </div>
        )}
      </ul>
      <div className="navbar__toggle" onClick={toggleMenu}>
        <div className={`hamburger ${menuOpen ? "open" : ""}`}></div>
      </div>
    </nav>
  );
};

export default Navbar;
