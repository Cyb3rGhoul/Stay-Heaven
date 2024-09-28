import React from "react";
import Navbar from "./Navbar";
import dashboard from "./assets/adminnav/dashboard.png";
import requests from "./assets/adminnav/requests.png";
import hotels from "./assets/adminnav/hotel.png";
import users from "./assets/adminnav/users.png";
import { NavLink } from "react-router-dom";


const SellerNavbar = () => {
    return (
        <>
            <Navbar />
            <div className="mt-4 h-[92vh] p-4 pt-0 fixed top-[8vh] left-0 w-1/5 flex flex-col bg-white shadow-xl"
            style={{
                fontFamily: "Josefin Sans, sans-serif",
                fontOpticalSizing: "auto",
                fontWeight: 800,
                fontStyle: "normal",
            }}>
                <div className="flex flex-col justify-evenly h-3/5 space-y-4">
                    {[
                        {
                            path: "/seller/dashboard",
                            label: "Dashboard",
                            icon: dashboard,
                        },
                        {
                            path: "/seller/requests",
                            label: "Create Hotel",
                            icon: requests,
                        },
                        {
                            path: "/seller/hotels",
                            label: "Hotels",
                            icon: hotels,
                        },
                        {
                            path: "/seller/Bookings",
                            label: "Bookings",
                            icon: users,
                        },
                    ].map((item, index) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 hover:bg-gradient-to-r from-green-400 to-green-600 hover:text-white transition-all duration-500 px-4 py-3 rounded-lg shadow-md ${isActive ? "bg-gradient-to-r from-green-500 to-green-700 text-white" : "bg-gray-100"
                                }`
                            }
                        >
                            <div className="p-3 bg-green-600/20 rounded-lg backdrop-blur-lg shadow-lg">
                                <img className="w-6 h-6" src={item.icon} alt={item.label} />
                            </div>
                            <h2 className="text-lg font-semibold">{item.label}</h2>
                        </NavLink>
                    ))}
                </div>
            </div>

        </>
    );
};

export default SellerNavbar;
