import React, { useEffect } from "react";
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, toggleLogin } from "./app/reducers/userSlice";
import axios from "./utils/axios";

const Admin = () => {
    const dispatch = useDispatch();
    const getUser = async () => {
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
    };

    useEffect(() => {
        getUser();
    }, []);
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
