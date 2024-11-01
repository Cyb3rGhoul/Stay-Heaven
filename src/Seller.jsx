import React, { useEffect } from "react";
import SellerNavbar from "./SellerNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import socket from "./utils/socket";
import axios from "./utils/axios.jsx";
import { useDispatch } from "react-redux";
import { setUser, toggleLogin } from "./app/reducers/userSlice.jsx";

const Seller = () => {
    const dispatch = useDispatch();
    const getUser = async () => {
        try {
            const user = await axios.get("/user/current-user", {
                withCredentials: true,
            });
            if (user) {
                dispatch(toggleLogin(true));
                dispatch(setUser(user.data.data));
            } else {
                dispatch(toggleLogin(false));
                dispatch(setUser({}));
            }
        } catch (error) {
            console.log("");
        }
    };

    useEffect(() => {
        getUser();
    }, []);
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
