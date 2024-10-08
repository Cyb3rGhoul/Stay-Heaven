import React, { useEffect, useState } from "react";
import bookings from "./assets/bookings.png";
import total from "./assets/total.png";
import profit from "./assets/profit.png";
import users from "./assets/users.png";
import PieActiveArc from "./PieActiveArc";
import ChartsOverview from "./ChartsOverview";
import axios from "./utils/axios";

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
            title: "Users",
            value: "714K",
            icon: users,
        },
    ]);

    const [orders, setOrders] = useState();
    const [totalusers, setTotalUsers] = useState();
    const [totalAmount, setTotalAmount] = useState();
    const [pendingOrders, setPendingOrders] = useState();
    const [successOrders, setSuccessOrders] = useState();
    const [cancelledOrders, setCancelledOrders] = useState();
    const [duration, setDuration] = useState("overall");

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
            data[2].value = response.data.data.users.length;

            setTotalUsers(response.data.data.users.length);
            setTotalAmount(
                response.data.data.orders.reduce(
                    (acc, order) => acc + order.amount,
                    0
                )
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
            console.log(response.data.data);
        } catch (error) {
            console.log(error);
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
        <div className="mt-10 w-full h-fit px-5" style={{
            fontFamily: "Josefin Sans, sans-serif",
            fontOpticalSizing: "auto",
            fontWeight: 800,
            fontStyle: "normal",
        }}>
            <h1 className="text-4xl mb-10 font-bold text-gray-800">
                Hi, Welcome Back 👋
            </h1>
            <select
                className="border-2 absolute top-10 right-6 border-gray-400 rounded-md px-3 py-2 text-gray-600 hover:border-gray-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                name="filter"
                id="filter"
                onChange={(e) => {
                    setDuration(e.target.value);
                    console.log(e.target.value);
                    getAdminDashboardData(e.target.value);
                }}
            >
                <option value="overall">Overall</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="This Year">This Year</option>
            </select>

            <div className="flex gap-6 mt-8">
                {data.map((item, index) => (
                    <div
                        key={item.title}
                        className="h-[20vh] w-1/3 relative transition-all duration-500 ease-in-out bg-gradient-to-r from-green-400 to-green-600 cursor-pointer hover:scale-105 hover:from-green-500 hover:to-green-700 rounded-xl p-5 flex items-center justify-between shadow-xl"
                    >
                        <img className="w-16 h-16" src={item.icon} alt={item.title} />
                        <div className="flex flex-col text-white items-end">
                            <h2 className="text-4xl font-bold">{formatNumber(item.value)}</h2>
                            <p className="text-lg font-medium opacity-80">{item.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <section className="flex items-center justify-center mt-10">
                <div className="w-1/2 my-10 flex flex-col gap-5 rounded-xl bg-white shadow-lg h-fit pb-10 justify-center">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 pt-5">
                        Booking Overview
                    </h2>
                    <PieActiveArc
                        data={[
                            { id: 0, value: pendingOrders, label: "Pending Bookings" },
                            { id: 1, value: successOrders, label: "Successful Bookings" },
                            { id: 2, value: cancelledOrders, label: "Cancelled Bookings" },
                        ]}
                    />
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
