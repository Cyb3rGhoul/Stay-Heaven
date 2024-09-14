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
        <div className="w-full h-fit px-5">
            <h1 className="text-3xl mb-10  font-semibold">
                Hi, Welcome Back 👋
            </h1>
            <select
                className="border-2 absolute top-10 right-6 border-black  rounded-md"
                name="filter"
                id="filter"
                onChange={(e) => {
                    setDuration(e.target.value);
                    console.log(e.target.value);
                    getAdminDashboardData(e.target.value);
                }}
            >
                <option value="overall">overall</option>
                <option value="This Week">This week</option>
                <option value="This Month">This month</option>
                <option value="This Year">This year</option>
            </select>
            <div className="flex gap-5">
                {data.map((item, index) => (
                    <div
                        key={item.title}
                        className="h-[20vh] w-1/3 relative transition-all duration-300 ease-in bg-[#6bac71] cursor-pointer hover:bg-[#43A344]  rounded-lg p-4 flex gap-5 items-center justify-center"
                    >
                        <img className="size-20" src={item.icon} alt="" />
                        <div className="flex flex-col gap-2 text-white">
                            <h2 className="text-3xl font-semibold">
                                {formatNumber(item.value)}
                            </h2>
                            <p className="text-md font-semibold opacity-50">
                                {item.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <section className="flex items-center justify-center ">
                <div className="w-1/2 my-10 flex flex-col gap-5 rounded-lg bg-[#D6EFD8] h-fit pb-10 justify-center">
                    <div className=" py-2"></div>
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
