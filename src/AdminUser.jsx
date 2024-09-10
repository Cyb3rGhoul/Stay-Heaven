import React, { useEffect, useState } from "react";
import axios from "./utils/axios";

const AdminUser = () => {
    const [users, setUsers] = useState([]);

    const makeAdmin = async (id) => {
        try {
            const response = await axios.post(
                "/admin/make-admin",
                { id },
                {
                    withCredentials: true,
                }
            );
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isAdmin: true } : user
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const removeAdmin = async (id) => {
        try {
            await axios.post(
                "/admin/remove-admin",
                { id },
                {
                    withCredentials: true,
                }
            );
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isAdmin: false } : user
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const makeCreator = async (id) => {
        try {
            const response = await axios.post(
                "/admin/make-creator",
                { id },
                {
                    withCredentials: true,
                }
            );
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isCreator: true } : user
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const removeCreator = async (id) => {
        try {
            await axios.post(
                "/admin/remove-creator",
                { id },
                {
                    withCredentials: true,
                }
            );
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isCreator: false } : user
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const makeBan = async (id) => {
        try {
            const response = await axios.post(
                "/admin/ban-user",
                { id },
                {
                    withCredentials: true,
                }
            );
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isban: true } : user
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const removeBan = async (id) => {
        try {
            await axios.post(
                "/admin/unban-user",
                { id },
                {
                    withCredentials: true,
                }
            );
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isban: false } : user
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const getUsers = async () => {
        try {
            const response = await axios.post(
                "/admin/all-users",
                {},
                {
                    withCredentials: true,
                }
            );
            setUsers(response.data.data.users);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);
    return (
        <div>
            <div className="ml-2 py-4">
                <select
                    className="border-2 border-black rounded-md"
                    name="filter"
                    id="filter"
                >
                    <option value="select">select</option>
                    <option value="username">username</option>
                    <option value="email">email</option>
                    <option value="previousBookings">previous bookings</option>
                    <option value="myCreatedPlaces">my created places</option>
                    <option value="admin">admin</option>
                    <option value="seller">seller</option>
                    <option value="receivedOrders">received orders</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr className="font-bold text-lg">
                            <th>S.No.</th>
                            <th className="text-center">Username</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Full Name</th>
                            <th className="text-center">Phone Number</th>
                            <th className="text-center">Past Bookings</th>
                            <th className="text-center">Admin</th>
                            <th className="text-center">Seller</th>
                            <th className="text-center">Created Hotels</th>
                            <th className="text-center">Orders</th>
                            <th className="text-center">Ban</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => {
                            return (
                                <tr>
                                    <th className="text-center">{index + 1}</th>
                                    <td>
                                        <div className="flex items-center gap-3 text-center">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img
                                                        src={user.avatar}
                                                        alt="Avatar Tailwind CSS Component"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">
                                                    {user.username}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        {user.email}
                                    </td>
                                    <td className="text-center">
                                        {user.fullName}
                                    </td>
                                    <td className="text-center">
                                        +91 {user.phoneNumber}
                                    </td>
                                    <td className="text-center">
                                        <select
                                            className="select bg-zinc-200 select-ghost select-sm"
                                            value=""
                                        >
                                            <option value="" disabled selected>
                                                order id
                                            </option>
                                            {user.previousBookings.map(
                                                (order) => (
                                                    <option>{order}</option>
                                                )
                                            )}
                                        </select>
                                    </td>
                                    <td className="text-center  mt-2  ">
                                        <select
                                            className="select bg-zinc-200 select-ghost select-sm"
                                            value={user.isAdmin ? "yes" : "no"}
                                            onChange={(e) => {
                                                if (e.target.value === "yes") {
                                                    makeAdmin(user._id);
                                                } else {
                                                    removeAdmin(user._id);
                                                }
                                            }}
                                        >
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </td>
                                    <td className="">
                                        <select
                                            className="select bg-zinc-200 select-ghost select-sm"
                                            value={
                                                user.isCreator ? "yes" : "no"
                                            }
                                            onChange={(e) => {
                                                if (e.target.value === "yes") {
                                                    makeCreator(user._id);
                                                } else {
                                                    removeCreator(user._id);
                                                }
                                            }}
                                        >
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        <select
                                            disabled={!user.isCreator}
                                            className="select bg-zinc-200 select-ghost select-sm"
                                            value=""
                                        >
                                            <option value="" disabled selected>
                                                Hotel id
                                            </option>
                                            {user.myCreatedPlaces.map(
                                                (hotel) => (
                                                    <option>{hotel}</option>
                                                )
                                            )}
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            disabled={!user.isCreator}
                                            className="select bg-zinc-200 select-ghost select-sm"
                                            value=""
                                        >
                                            <option value="" disabled selected>
                                                Received Order id
                                            </option>
                                            {user.receivedOrders.map(
                                                (order) => (
                                                    <option>{order}</option>
                                                )
                                            )}
                                        </select>
                                    </td>
                                    <td className="">
                                        <select
                                            className="select bg-zinc-200 select-ghost select-sm"
                                            value={
                                                user.isban ? "yes" : "no"
                                            }
                                            onChange={(e) => {
                                                if (e.target.value === "yes") {
                                                    makeBan(user._id);
                                                } else {
                                                    removeBan(user._id);
                                                }
                                            }}
                                        >
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUser;
