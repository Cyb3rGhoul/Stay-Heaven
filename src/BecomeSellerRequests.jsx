import React, { useEffect, useState } from "react";
import tick from "./assets/tick.png";
import cross from "./assets/cross.png";
import axios from "./utils/axios";
import { Link } from "react-router-dom";
import socket from "./utils/socket";
import { useSelector } from "react-redux";
import useHandleErr from "./utils/useHandleErr";

const BecomeSellerRequests = () => {
    const [users, setUsers] = useState([]);
    const handleError = useHandleErr()
    const getUsers = async () => {
        try {
            const response = await axios.post(
                "/admin/all-users",
                {},
                {
                    withCredentials: true,
                }
            );
            setUsers(
                response.data.data.users.filter(
                    (user) => user.sellerRequestMade && !user.isCreator
                )
            );
        } catch (error) {
            handleError(error);
        }
    };

    const approveSeller = async (id) => {
        try {
            await axios.post(
                "/admin/make-creator",
                { id },
                { withCredentials: true }
            );
            setUsers((prev) => prev.filter((user) => user._id !== id));
        } catch (error) {
            handleError(error);
        }
    };

    const rejectSeller = async (id) => {
        try {
            await axios.post(
                "/admin/reject-seller",
                { id },
                { withCredentials: true }
            );
            setUsers((prev) => prev.filter((user) => user._id !== id));
        } catch (error) {
            handleError(error);
        }
    };
    useEffect(() => {
        getUsers();

        socket.on("seller_made", (data) => {
            setUsers((prev) =>
                prev.filter((user) => user._id !== data.seller._id)
            );
        });

        socket.on("rejected_seller", (data) => {
            setUsers((prev) =>
                prev.filter((user) => user._id !== data.seller._id)
            );
        });

        socket.on("seller_request_made", (data) => {
            setUsers((prev) => [...prev, data.seller]);
            console.log(users);
        });

        return () => {
            socket.off("seller_made");
            socket.off("rejected_seller");
            socket.off("seller_request_made");
        };
    }, []);
    return (
        <div className="mt-10 px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                    >
                                        S.No.
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Username
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Email
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Full Name
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Phone Number
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Address
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Aadhaar Card
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Pan Card
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Seller
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <th className="text-center">
                                            {index + 1}
                                        </th>
                                        <td className="flex items-center gap-3 text-center">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img
                                                        src={user.avatar}
                                                        alt="Avatar"
                                                    />
                                                </div>
                                            </div>
                                            <div className="font-bold">
                                                {user.username}
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
                                        <td className="text-center mt-2">
                                            {user.address
                                                ? user.address
                                                : "N/A"}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <Link
                                                target="_blank"
                                                to={`${user.aadhaar}`}
                                            >
                                                <button className="px-3 py-1 bg-zinc-200 rounded-md hover:bg-zinc-300 transition-colors">
                                                    Document
                                                </button>
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <Link
                                                target="_blank"
                                                to={`${user.pan}`}
                                            >
                                                <button className="px-3 py-1 bg-zinc-200 rounded-md hover:bg-zinc-300 transition-colors">
                                                    Document
                                                </button>
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <div className="flex justify-center gap-2">
                                                <img
                                                    src={tick}
                                                    alt="approve"
                                                    className="w-6 h-6 cursor-pointer"
                                                    onClick={() =>
                                                        approveSeller(user._id)
                                                    }
                                                />
                                                <img
                                                    src={cross}
                                                    alt="reject"
                                                    className="w-6 h-6 cursor-pointer"
                                                    onClick={() =>
                                                        rejectSeller(user._id)
                                                    }
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BecomeSellerRequests;
