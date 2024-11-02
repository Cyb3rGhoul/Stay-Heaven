import React, { useEffect, useState } from "react";
import bookings from "./assets/bookings.png";
import total from "./assets/total.png";
import profiticon from "./assets/profit.png";
import users from "./assets/users.png";
import PieActiveArc from "./PieActiveArc";
import axios from "./utils/axios";
import useHandleErr from "./utils/useHandleErr.js";
import { Toaster } from "react-hot-toast";

const AdminDashboard = () => {
    const [data, setData] = useState([
        {
            title: "Bookings",
            value: "714K",
            icon: bookings,
        },
        {
            title: "Total",
            value: "714K",
            icon: total,
        },
        {
            title: "Profit",
            value: "714K",
            icon: profiticon,
        },
        {
            title: "Users",
            value: "714K",
            icon: users,
        },
    ]);

    const [orders, setOrders] = useState();
    const [totalusers, setTotalUsers] = useState();
    const [totalAmount, setTotalAmount] = useState();
    const [profit, setProfit] = useState();
    const [pendingOrders, setPendingOrders] = useState();
    const [successOrders, setSuccessOrders] = useState();
    const [cancelledOrders, setCancelledOrders] = useState();
    const [duration, setDuration] = useState("overall");
    const handleError = useHandleErr();

    const getAdminDashboardData = async (duration) => {
        try {
            const response = await axios.post(
                "/admin/admin-dashboard",
                { duration },
                { withCredentials: true }
            );
            setOrders(response.data.data.orders);
            data[0].value = response.data.data.orders.length;
            data[1].value = response.data.data.orders.reduce(
                (acc, order) => acc + order.amount,
                0
            );
            data[2].value = 0.05 * data[1].value;
            data[3].value = response.data.data.users.length;

            setTotalUsers(response.data.data.users.length);
            setTotalAmount(
                response.data.data.orders.reduce(
                    (acc, order) => acc + order.amount,
                    0
                )
            );
            setProfit(
                response.data.data.orders - 0.05 * response.data.data.orders
            );
            setPendingOrders(
                response.data.data.orders.filter(
                    (order) => order.approvalStatus === "in-progress"
                ).length
            );
            setSuccessOrders(
                response.data.data.orders.filter(
                    (order) => order.approvalStatus === "confirmed"
                ).length
            );
            setCancelledOrders(
                response.data.data.orders.filter(
                    (order) => order.approvalStatus === "cancelled"
                ).length
            );
        } catch (error) {
            handleError(error);
        }
    };

    const formatNumber = (value) => {
        if (value >= 1_000_000_000_000) {
            return (value / 1_000_000_000_000).toFixed(1) + "T";
        } else if (value >= 1_000_000_000) {
            return (value / 1_000_000_000).toFixed(1) + "B";
        } else if (value >= 1_000_000) {
            return (value / 1_000_000).toFixed(1) + "M";
        } else if (value >= 1_000) {
            return (value / 1_000).toFixed(1) + "K";
        } else {
            return value.toString();
        }
    };

    useEffect(() => {
        getAdminDashboardData(duration);
    }, []);

    return (
        <>
            <div
                className="mt-14 w-full h-fit px-4 sm:px-6 md:px-8 lg:px-10"
                style={{
                    fontFamily: "Josefin Sans, sans-serif",
                    fontOpticalSizing: "auto",
                    fontWeight: 800,
                    fontStyle: "normal",
                }}
            >
                {/* Header Section */}
                <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 lg:mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                        Hi, Welcome Back 👋
                    </h1>

                    <select
                        className="border-2 w-full sm:w-48 md:w-56 mt-4 sm:mt-0 border-gray-400 rounded-md px-3 py-2 text-gray-600 hover:border-gray-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                        name="filter"
                        id="filter"
                        onChange={(e) => {
                            setDuration(e.target.value);
                            getAdminDashboardData(e.target.value);
                        }}
                    >
                        <option value="overall">Overall</option>
                        <option value="This Week">This Week</option>
                        <option value="This Month">This Month</option>
                        <option value="This Year">This Year</option>
                    </select>
                </div>

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                    {data.map((item, index) => (
                        <div
                            key={item.title}
                            className="h-[15vh] sm:h-[18vh] md:h-[20vh] relative transition-all duration-500 ease-in-out bg-gradient-to-r from-green-400 to-green-600 cursor-pointer hover:scale-105 hover:from-green-500 hover:to-green-700 rounded-xl p-4 sm:p-5 flex items-center justify-between shadow-xl"
                        >
                            <img
                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                                src={item.icon}
                                alt={item.title}
                            />
                            <div className="flex flex-col text-white items-end">
                                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                                    <span className="font-semibold">
                                        {index === 1 || index === 2 ? "₹" : ""}
                                    </span>
                                    {formatNumber(item.value)}
                                </h2>
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium opacity-80">
                                    {item.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pie Chart Section */}
                <section className="flex items-center justify-center mt-6 sm:mt-8 md:mt-10">
                    <div className="w-full sm:w-4/5 md:w-3/4 lg:w-1/2 my-6 sm:my-8 md:my-10 flex flex-col gap-5 rounded-xl bg-white shadow-lg h-fit pb-6 sm:pb-8 md:pb-10">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center text-gray-800 pt-5">
                            Booking Overview
                        </h2>
                        <div className="px-2 sm:px-4 md:px-6 flex items-center justify-center">
                            <PieActiveArc
                                data={[
                                    {
                                        id: 0,
                                        value: pendingOrders,
                                        label: "Pending Bookings",
                                    },
                                    {
                                        id: 1,
                                        value: successOrders,
                                        label: "Successful Bookings",
                                    },
                                    {
                                        id: 2,
                                        value: cancelledOrders,
                                        label: "Cancelled Bookings",
                                    },
                                ]}
                                labelSize={window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 12 : 14}
                                legendPosition="bottom"
                                legendFontSize={window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 14 : 16}
                            />
                        </div>
                    </div>
                </section>
            </div>

        </>
    );
};

export default AdminDashboard;
