import React from "react";
import { NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import dashboard from "./assets/adminnav/dashboard.png";
import requests from "./assets/adminnav/requests.png";
import hotels from "./assets/adminnav/hotel.png";
import users from "./assets/adminnav/users.png";

const AdminNavbar = () => {
  return (
    <>
      <Navbar />
      <div className="mt-8 h-[92vh] p-4 pt-0 fixed top-[8vh] left-0 w-1/5 flex flex-col bg-white shadow-xl">
        <div className="flex flex-col justify-evenly h-3/5 space-y-4">
          {[
            {
              path: "/admin/dashboard",
              label: "Dashboard",
              icon: dashboard,
            },
            {
              path: "/admin/requests",
              label: "Requests",
              icon: requests,
            },
            {
              path: "/admin/hotels",
              label: "Hotels",
              icon: hotels,
            },
            {
              path: "/admin/users",
              label: "Users",
              icon: users,
            },
            {
              path: "/admin/Bookings",
              label: "Bookings",
              icon: users,
            },
          ].map((item, index) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 hover:bg-gradient-to-r from-green-400 to-green-600 hover:text-white transition-all duration-500 px-4 py-3 rounded-lg shadow-md ${
                  isActive
                    ? "bg-gradient-to-r from-green-500 to-green-700 text-white"
                    : "bg-gray-100"
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

export default AdminNavbar;
