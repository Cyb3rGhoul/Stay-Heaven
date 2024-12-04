import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "./assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "./utils/axios";
import { setUser, toggleLogin } from "./app/reducers/userSlice";
import socket from "./utils/socket";
import useHandleErr from "./utils/useHandleErr";
import { IoMdSearch } from "react-icons/io";

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
    const handleError = useHandleErr();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
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

        socket.on("seller_made", (data) => {
            dispatch(setUser(data.seller));
            setIsSeller(data.seller.isCreator);
        });

        socket.on("remove_creator", (data) => {
            dispatch(setUser(data.seller));
            setIsSeller(data.seller.isCreator);
        });

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            socket.off("seller_made");
            socket.off("remove_creator");
        };
    }, []);
    const logouthandler = async () => {
        try {
            await axios.post(
                "/user/logout",
                {},
                {
                    withCredentials: true,
                }
            );
            dispatch(toggleLogin(false));
            dispatch(setUser({}));
        } catch (error) {
            handleError(error);
        } finally {
            window.location.href = "/";
        }
    };

    return (
        <nav
            className={`navbar ${
                fixed ? "fixed top-0 left-0 w-full z-10" : ""
            } ${isSticky ? "" : "sticky"}`}
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
                    <Link to={"/search"} className=" searchi pb-2">
                        <IoMdSearch className="text-2xl" />
                    </Link>
                {isLoggedIn ? (
                    <li
                        className="navbar__username mr-2 mb-2"
                        onClick={toggleDropdown}
                    >
                        <div className="flex gap-4">
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="navbar__profile-image"
                            />
                        </div>
                        {dropdownOpen && (
                            <div className="navbar__dropdown">
                                <button
                                    className="navbar__close"
                                    onClick={toggleMenu}
                                >
                                    ✖
                                </button>
                                <Link to="/profile">
                                    <div>Profile</div>
                                </Link>
                                <Link to="/previousBookings">
                                    <div>Previous Bookings</div>
                                </Link>
                                <Link to="/issueform">
                                    <div>Issue Form</div>
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
                                {!isSeller && !isBan && (
                                    <Link to="/sellerForm">
                                        <div>Become a Seller</div>
                                    </Link>
                                )}
                                <div
                                    onClick={logouthandler}
                                    style={{
                                        cursor: "pointer",
                                        textAlign: "left",
                                        marginLeft: "12px",
                                        paddingBottom: "8px",
                                    }}
                                >
                                    Logout
                                </div>
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
