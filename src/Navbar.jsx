import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "./assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "./utils/axios";
import { setUser, toggleLogin } from "./app/reducers/userSlice";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(useSelector((state) => state.isLoggedIn));
  const [profileImage, setprofileImage] = useState(useSelector((state) => state.userData.avatar));
  const [isAdmin, setIsAdmin] = useState(useSelector((state) => state.userData.isAdmin));
  const [isCreator, setIsCreator] = useState(useSelector((state) => state.userData.isCreator));
  const [isBan, setIsBan] = useState(useSelector((state) => state.userData.isban));
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
  const getLoginStatus = async () => {
    const user = await axios.get("/user/current-user", {
        withCredentials: true,
    });
    if(user) {
      dispatch(toggleLogin(true))
      dispatch(setUser(user.data.data));
      setIsLoggedIn(true)
      setprofileImage(user.data.data.avatar)
      setIsAdmin(user.data.data.isAdmin)
      setIsCreator(user.data.data.isCreator)
      setIsBan(user.data.data.isban)
    } else {
      dispatch(toggleLogin(false))
      dispatch(setUser({}));
    }
};

useEffect(() => {
    getLoginStatus();
}, []);
  const logouthandler =async () => {
    await axios.post("/user/logout", {}, {
      withCredentials: true, // Important: This sends cookies with the request
    })
    dispatch(toggleLogin(false))
    dispatch(setUser({}))
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
                <Link to="/profile"><div className="">Profile</div></Link>
                <Link to="/previousBookings"><div className="">Previous Bookings</div></Link>
                {isAdmin && !isBan && <Link to="/admin/dashboard"><div className="">Admin Dashboard</div></Link>}
                {!isBan && <div>Seller Dashboard</div>}
                <div onClick={logouthandler}>Logout</div>
              </div>
            )}
          </li>
        ) : (
          <div className="flex gap-1">
            <li>
              <Link to="/signup" onClick={toggleMenu}>
                <button className="button-animation relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-l font-medium text-gray-900 rounded-lg group dark:text-gray-900">
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
                <button className="button-animation relative inline-flex max-[500px]:mt-2 items-center justify-center mr-12 mb-2 me-2 overflow-hidden text-l font-medium text-gray-900 rounded-lg group dark:text-gray-900">
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
