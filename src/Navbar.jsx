import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "./assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "./utils/axios";
import { setUser, toggleLogin } from "./app/reducers/userSlice";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(
        useSelector((state) => state.user.isLoggedIn)
    );
    const [profileImage, setprofileImage] = useState(
        useSelector((state) => state.user.userData.avatar)
    );
    const [isAdmin, setIsAdmin] = useState(
        useSelector((state) => state.user.userData.isAdmin)
    );
    const [isCreator, setIsCreator] = useState(
        useSelector((state) => state.user.userData.isCreator)
    );
    const [isBan, setIsBan] = useState(
        useSelector((state) => state.user.userData.isban)
    );
    const [isSeller, setIsSeller] = useState(
        useSelector((state) => state.user.userData.isCreator)
    );
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
        try {
            const user = await axios.get("/user/current-user", {
                withCredentials: true,
            });
            if (user) {
                dispatch(toggleLogin(true));
                dispatch(setUser(user.data.data));
                setIsLoggedIn(true);
                setprofileImage(user.data.data.avatar);
                setIsAdmin(user.data.data.isAdmin);
                setIsCreator(user.data.data.isCreator);
                setIsBan(user.data.data.isban);
            } else {
                dispatch(toggleLogin(false));
                dispatch(setUser({}));
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setfixed(currentPath === "admin");

        const handleScroll = () => {
            if (window.scrollX > 0) {
                setIsSticky(false);
            } else {
                setIsSticky(true);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const logouthandler = async () => {
        await axios.post(
            "/user/logout",
            {},
            {
                withCredentials: true, // Important: This sends cookies with the request
            }
        );
        dispatch(toggleLogin(false));
        dispatch(setUser({}));
        navigate("/");
    };

    return (
        <nav
            className={`navbar ${fixed ? "fixed top-0 left-0 w-full z-10" : ""} ${isSticky ? "" : "sticky"
                }`}
        >
            <div className="navbar__logo">
                <Link to="/">
                    <img src={logo} alt="StayHeaven Logo" />
                </Link>
            </div>
            <ul
                className={`navbar__links ${menuOpen ? "active" : ""}`}
                style={{
                    marginTop: "0.5rem",
                }}
            >
                {isLoggedIn ? (
                    <li className="navbar__username mr-2 mb-2" onClick={toggleDropdown}>
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
                                <Link to="/profile">
                                    <div>Profile</div>
                                </Link>
                                <Link to="/previousBookings">
                                    <div>Previous Bookings</div>
                                </Link>
                                {isAdmin && !isBan && (
                                    <Link to="/admin/dashboard">
                                        <div>Admin Dashboard</div>
                                    </Link>
                                )}
                                {isSeller && !isBan && (
                                    <Link to={"/seller/dashboard"}>
                                        <div>Seller Dashboard</div>
                                    </Link>
                                )}
                                <div onClick={logouthandler} style={{cursor: "pointer"}}>Logout</div>
                            </div>
                        )}
                    </li>
                ) : (
                    <div className="flex">
                        <li>
                            <Link to="/signup" onClick={toggleMenu}>
                                <button className="sigg button-animation relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-l font-medium text-gray-900 rounded-lg group dark:text-gray-900">
                                    <span className="span-mother relative px-5 py-2.5 max-[500px]:px-2 max-[500px]:py-1.5 transition-all ease-in duration-75 rounded-md group-hover:bg-opacity-0">
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
                                <button className="logg button-animation relative inline-flex max-[500px]:mt-2 items-center justify-center mr-2 mb-2 me-2 overflow-hidden text-l font-medium text-gray-900 rounded-lg group dark:text-gray-900">
                                    <span className="span-mother relative px-5 py-2.5 max-[500px]:px-2 max-[500px]:py-1.5 transition-all ease-in duration-75 rounded-md group-hover:bg-opacity-0">
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
            {/* Only show hamburger when user is NOT logged in */}
        </nav>
    );
};

export default Navbar;
