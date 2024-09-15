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
            <div className="h-[92vh] p-4 pt-0 fixed top-[8vh] left-0 w-1/5 flex flex-col">
                <div className="flex flex-col justify-evenly h-3/5">
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
                                `flex items-center gap-4 bg-[#9ce49e] hover:bg-[#508D4E] hover:text-white transition-all duration-500 px-4 py-2 rounded-lg ${
                                    isActive ? "bg-[#78d075] text-white" : ""
                                }`
                            }
                        >
                            <div className="p-2 bg-green-700/20 rounded-lg backdrop-blur-sm size-12">
                                <img className="" src={item.icon} alt="" />
                            </div>
                            <h2 className="text-xl">{item.label}</h2>
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SellerNavbar;
