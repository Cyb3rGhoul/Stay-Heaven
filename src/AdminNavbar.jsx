import React from "react";
import { NavLink } from "react-router-dom";
import logo from "./assets/logo.png";
import Navbar from "./Navbar";
import dashboard from "./assets/adminnav/dashboard.png";
import requests from "./assets/adminnav/requests.png";
import hotels from "./assets/adminnav/hotel.png";
import users from "./assets/adminnav/users.png";

const AdminNavbar = () => {
  return (
    <>
      <Navbar />
      <div className="h-[92vh] p-4 pt-0 fixed top-[8vh] left-0 w-1/5 flex flex-col">
        {/* <Link to="/">
          <img className='w-[80%] mx-auto' src={logo} alt="StayHeaven Logo" />
        </Link> */}
        {/* <div className='flex items-center gap-2'>
         <img className='size-16 rounded-full' src="https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_25.jpg" alt="" />
         <h1>Jaydon</h1>
        </div> */}
        <div className="flex flex-col justify-evenly h-3/5">
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
              icon:  users,
            },
            {
              path: "/admin/prev-bookings",
              label: "Previous Bookings",
              icon:  users,
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
              <img
                className=""
                src={item.icon}
                alt=""
              />
              </div>
              <h2 className="text-xl">{item.label}</h2>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
