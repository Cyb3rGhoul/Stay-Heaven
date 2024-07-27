import React from "react";
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <div className="w-full h-full">
      <AdminNavbar />
      <main className="bg-red-300 w-4/5 absolute left-[20%] ">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
