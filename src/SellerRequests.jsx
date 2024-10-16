import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser as setUserRedux } from "./app/reducers/userSlice";
import tick from "./assets/tick.png";
import cross from "./assets/cross.png";
import { Link } from "react-router-dom";
import axios from "./utils/axios";
import socket from "./utils/socket";

const SellerRequests = () => {
    const [user, setUser] = useState(
        useSelector((state) => {
            return state.user.userData;
        })
    );
    const dispatch = useDispatch();
    const [orders, setOrders] = useState(
        user.receivedOrders.filter(
            (order) => order.approvalStatus == "in-progress"
        )
    );

    const getDate = (date) => {
        const specificDate = new Date(date);
        return specificDate.toLocaleDateString("en-GB");
    };

    const approveOrder = async (id, approvalStatus) => {
        try {
            await axios.post(
                "/user/approve-order",
                { id, approvalStatus },
                {
                    withCredentials: true,
                }
            );
            setOrders((prev) => prev.filter((order) => order._id != id));

            setUser((prev) => {
                const updatedUser = {
                    ...prev,
                    receivedOrders: prev.receivedOrders.map((order) =>
                        order._id === id
                            ? { ...order, approvalStatus: approvalStatus }
                            : order
                    ),
                };
    
                dispatch(setUserRedux(updatedUser));
    
                return updatedUser;
            });
            
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {}, []);
    return (
        <div className="mt-10 px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-emerald-500">
                                <tr>
                                    {[
                                        "S.No.",
                                        "Order Id",
                                        "Hotel Name",
                                        "Check-in",
                                        "Check-out",
                                        "Rooms",
                                        "Amount",
                                        "Approve/Reject",
                                    ].map((header) => (
                                        <th
                                            key={header}
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {orders.map((order, index) => (
                                    <tr key={order._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order._id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.hotel.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {getDate(order.checkin)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {getDate(order.checkout)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.rooms}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ₹{" "}
                                           {typeof order.amount === 'number' ? (order.amount - 0.05 * order.amount).toLocaleString('en-IN') : "N/A"}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <div className="flex justify-center gap-2">
                                                <img
                                                    src={tick}
                                                    alt="approve"
                                                    className="w-6 h-6 cursor-pointer"
                                                    onClick={() =>
                                                        approveOrder(
                                                            order._id,
                                                            "confirmed"
                                                        )
                                                    }
                                                />
                                                <img
                                                    src={cross}
                                                    alt="reject"
                                                    className="w-6 h-6 cursor-pointer"
                                                    onClick={() =>
                                                        approveOrder(
                                                            order._id,
                                                            "cancelled"
                                                        )
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

export default SellerRequests;
