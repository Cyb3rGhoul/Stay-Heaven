import React, {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser as setUserRedux } from "./app/reducers/userSlice";
import tick from "./assets/tick.png";
import cross from "./assets/cross.png";
import { Link } from "react-router-dom";
import axios from "./utils/axios";
import useHandleErr from "./utils/useHandleErr";
import toast from "react-hot-toast";
import socket from "./utils/socket"


const SellerRequests = () => {
    const [user, setUser] = useState(
        useSelector((state) => {
            return state.user.userData;
        })
    );
    const handleError = useHandleErr();
    const dispatch = useDispatch();
    const [orders, setOrders] = useState(() => {
        const order = user.receivedOrders?.filter(
            (order) => order.approvalStatus == "in-progress"
        );
        return order;
    });

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
            setOrders((prev) => prev?.filter((order) => order._id != id));
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
            handleError(error);
        }
    };

    useEffect(() => {
      socket.on("order_is_created", (data) => {
        setOrders((prev) => [...prev, data.order])
    })

    socket.on("order_is_accepted_or_rejected", (data) => {
        setOrders((prev) => prev.filter((order) => order.id !== data._id))
    })

    return () => {
        socket.off("order_is_created")
        socket.off("order_is_accepted_or_rejected")
    }
    }, [])
    

    return (
        <div className="mt-10 px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto max-md:ml-[-0.7rem]">
                <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 max-md:rounded-lg md:rounded-lg ">
                        <table className="min-w-full divide-y divide-emerald-200">
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
                                            className="px-4 py-5 text-left text-xs font-medium text-white uppercase tracking-wider  "
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-emerald-100">
                                {orders.map((order, index) => (
                                    <tr
                                        key={order._id}
                                        className="hover:bg-emerald-50 transition-colors duration-300"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <span className="font-mono">
                                                {order._id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-800">
                                            {order.hotel.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {getDate(order.checkin)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {getDate(order.checkout)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {order.rooms}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-700">
                                            ₹{" "}
                                            {typeof order.amount === "number"
                                                ? (
                                                      order.amount -
                                                      0.05 * order.amount
                                                  ).toLocaleString("en-IN")
                                                : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <div className="flex justify-center gap-3">
                                                <img
                                                    src={tick}
                                                    alt="approve"
                                                    className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform duration-300"
                                                    onClick={() => {
                                                        approveOrder(
                                                            order._id,
                                                            "confirmed"
                                                        );
                                                        toast.success(
                                                            "Order Approved Successfully"
                                                        );
                                                    }}
                                                />
                                                <img
                                                    src={cross}
                                                    alt="reject"
                                                    className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform duration-300"
                                                    onClick={() => {
                                                        approveOrder(
                                                            order._id,
                                                            "cancelled"
                                                        );
                                                        toast.error(
                                                            "Order Rejected Successfully"
                                                        );
                                                    }}
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
