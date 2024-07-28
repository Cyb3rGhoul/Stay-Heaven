import React from "react";
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <div className="w-full   h-screen scrollbar scrollbar-thumb-rounded relative">
      <AdminNavbar />
      <main className="w-4/5 absolute left-[20%] top-[8vh] ">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
