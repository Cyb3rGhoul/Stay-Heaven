import React, { useEffect, useState } from "react";
import tick from "./assets/tick.png";
import cross from "./assets/cross.png";
import axios from "./utils/axios";
import { Link } from "react-router-dom";
import socket from "./utils/socket";
import { useSelector } from "react-redux";
import useHandleErr from "./utils/useHandleErr";
import toast from "react-hot-toast";
import Preloader from "./Preloader";
import TruncatedCell from './TruncatedCell';

const BecomeSellerRequests = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const handleError = useHandleErr()
    const getUsers = async () => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
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
            toast.success("Seller Approved Successfully");
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
            toast.success("Seller Rejected Successfully");
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
        });

        return () => {
            socket.off("seller_made");
            socket.off("rejected_seller");
            socket.off("seller_request_made");
        };
    }, []);
    return (
        isLoading ? <Preloader /> : <div className="mt-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-6 text-emerald-900 max-md:text-2xl max-sm:text-xl max-md:text-center">Seller Requests</h1>
            <div className="overflow-x-auto  max-md:ml-[-.6rem]">
                <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg max-md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-emerald-500">
                                <tr className="max-md:py-2">
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-white uppercase tracking-wider sm:pl-6">
                                        S.No.
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-white uppercase tracking-wider sm:pl-6">
                                        Username
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-white uppercase tracking-wider sm:pl-6">
                                        Email
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-white uppercase tracking-wider sm:pl-6">
                                        Full Name
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-white uppercase tracking-wider sm:pl-6">
                                        Phone Number
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-white uppercase tracking-wider sm:pl-6">
                                        Address
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-white uppercase tracking-wider sm:pl-6">
                                        Aadhaar Card
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-white uppercase tracking-wider sm:pl-6">
                                        Pan Card
                                    </th>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-white uppercase tracking-wider sm:pl-6">
                                        Seller
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {users?.map((user, index) => (
                                    <tr key={index} className="hover:bg-amber-50 transition-colors duration-200">
                                        <td className="py-4 px-4 text-center text-xs font-medium text-gray-700">
                                            {index + 1}
                                        </td>
                                        <td className="flex items-center gap-3 py-8 px-4 text-center">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img src={user.avatar} alt="Avatar" className="rounded-full" />
                                                </div>
                                            </div>
                                            <TruncatedCell text={user.username} maxLength={15} />
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <TruncatedCell text={user.email} maxLength={20} />
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <TruncatedCell text={user.fullName} maxLength={20} />
                                        </td>
                                        <td className="py-4 px-4 text-center text-gray-700">
                                            <TruncatedCell text={user.phoneNumber} maxLength={8} />
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <TruncatedCell text={user.address || "N/A"} maxLength={30} />
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <Link target="_blank" to={`${user.aadhaar}`}>
                                                <button className="px-3 py-1 bg-brown-100 text-brown-700 rounded-md hover:bg-brown-200 transition-all duration-200 ease-in-out">
                                                    Document
                                                </button>
                                            </Link>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <Link target="_blank" to={`${user.pan}`}>
                                                <button className="px-3 py-1 bg-brown-100 text-brown-700 rounded-md hover:bg-brown-200 transition-all duration-200 ease-in-out">
                                                    Document
                                                </button>
                                            </Link>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <img
                                                    src={tick}
                                                    alt="approve"
                                                    className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform"
                                                    onClick={() => approveSeller(user._id)}
                                                />
                                                <img
                                                    src={cross}
                                                    alt="reject"
                                                    className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform"
                                                    onClick={() => rejectSeller(user._id)}
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
