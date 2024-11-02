import React, { useEffect } from "react";
import SellerNavbar from "./SellerNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import socket from "./utils/socket";

const Seller = () => {
    const navigate = useNavigate();
    useEffect(() => {

        socket.on("remove_creator", (data) => {
            navigate("/");
        });

        return () => {
            socket.off("remove_creator");
        };
    }, []);
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
