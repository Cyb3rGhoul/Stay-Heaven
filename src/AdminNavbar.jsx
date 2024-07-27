import React from "react";
import { NavLink } from "react-router-dom";
import logo from "./assets/logo.png";
import Navbar from "./Navbar";

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
            },
            {
              path: "/admin/requests",
              label: "Requests",
            },
            {
              path: "/admin/hotels",
              label: "Hotels",
            },
            {
              path: "/admin/users",
              label: "Users",
            },
          ].map((item, index) => (
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 bg-blue-400/25 hover:bg-blue-700/60 transition-all duration-500 px-4 py-2 rounded-lg ${
                  isActive ? "bg-blue-700/60" : ""
                }`
              }
            >
              <img
                className="size-16 rounded-full"
                src="https://minimal-kit-react.vercel.app/assets/images/avatars/avatar_25.jpg"
                alt=""
              />
              <h2 className="text-xl">{item.label}</h2>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
