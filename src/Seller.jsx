import React from "react";
import SellerNavbar from "./SellerNavbar";
import { Outlet } from "react-router-dom";

const Seller = () => {
    return (
        <div className="w-full h-screen scrollbar scrollbar-thumb-rounded relative">
            <SellerNavbar />
            <main className="w-4/5 absolute left-[20%] top-[8vh]">
                <Outlet />
            </main>
        </div>
    );
};

export default Seller;
