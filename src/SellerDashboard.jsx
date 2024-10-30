import React, { useState, useEffect } from "react";
import PieActiveArc from "./PieActiveArc";
import { motion } from "framer-motion";
import axios from "./utils/axios";
import total from "./assets/total.png";
import bookingsicon from "./assets/bookings.png";
import useHandleErr from "./utils/useHandleErr";

const SellerDashboard = () => {
    const [duration, setDuration] = useState("overall");
    const [hotels, setHotels] = useState(null);
    const [bookings, setBookings] = useState(null);
    const [confirmedBookings, setConfirmedBookings] = useState(null);
    const [inprogressBookings, setInprogressBookings] = useState(null);
    const [revenue, setRevenue] = useState(0);
    const handleError = useHandleErr()
    const getSellerData = async (duration) => {
        try {
            const response = await axios.post(
                "/user/get-seller-dashboard-data",
                {
                    duration,
                },
                {
                    withCredentials: true,
                }
            );
            let data = response.data.data;

            setRevenue(data.totalRevenue);
            setHotels(data.totalCreatedPlaces);
            setConfirmedBookings(
                data.receivedOrders.filter(
                    (order) => order.approvalStatus === "confirmed"
                ).length
            );
            setInprogressBookings(
                data.receivedOrders.filter(
                    (order) => order.approvalStatus === "in-progress"
                ).length
            );
            setBookings(data.receivedOrders.length);
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

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = windowWidth < 768;

    const data = [
        { title: "Revenue", value: revenue, icon: total },
        {
            title: "Hotels",
            value: hotels,
            icon: "https://cdn-icons-png.flaticon.com/512/2933/2933921.png",
        },
        { title: "Bookings", value: confirmedBookings, icon: bookingsicon },
    ];

    useEffect(() => {
        getSellerData(duration);
    }, []);

    return (
        <div className="sell mt-12 w-full h-fit px-5 md:px-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-0"
                >
                    Hi, Welcome Back 👋
                </motion.h1>
                <motion.select
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="border-2 border-green-500 rounded-md bg-white px-4 py-2 text-gray-700 shadow-lg focus:ring-2 focus:ring-green-300 transition-all ease-in-out duration-200 hover:border-green-600 cursor-pointer w-3/4 md:w-auto"
                    name="filter"
                    id="filter"
                    value={duration}
                    onChange={(e) => {
                        setDuration(e.target.value);
                        getSellerData(e.target.value);
                    }}
                >
                    <option value="overall">Overall</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                    <option value="This Year">This Year</option>
                </motion.select>
            </div>

            <div
                className={`flex flex-col md:flex-row gap-5 ${isMobile ? "items-center" : ""
                    }`}
            >
                {data.map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-[20vh] ${isMobile ? "w-full" : "w-1/3"
                            } relative transition-all duration-300 ease-in bg-gradient-to-r from-green-400 to-green-600 cursor-pointer hover:shadow-xl rounded-lg p-4 flex gap-5 items-center justify-center`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img
                            className="w-16 h-16"
                            src={item.icon}
                            alt={item.title}
                        />
                        <div className="flex flex-col gap-2 text-white">
                            <h2 className="text-3xl font-semibold">
                                {index == 0 ? "₹" : ""}{index === 0
                                    ? formatNumber(item.value)
                                    : item.value}
                            </h2>
                            <p className="text-md font-semibold opacity-75">
                                {item.title}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center justify-center mt-10"
            >
                <div
                    className={`
        ${isMobile ? "w-full" : "w-full"}

        my-10 
        flex 
        flex-col 
        gap-5 
        rounded-xl
        bg-gradient-to-br 
        from-white 
        via-gray-50
        to-gray-100
        h-fit 
        pt-10 
        pb-10 
        shadow-[0_8px_30px_rgb(0,0,0,0.42)]
        border
        border-gray-100
        backdrop-blur-sm
        hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
        transition-all
        duration-300
      `}
                >
                    <PieActiveArc
                        data={[
                            {
                                id: 0,
                                value: inprogressBookings,
                                label: "In-progress Bookings",
                            },
                            {
                                id: 1,
                                value: confirmedBookings,
                                label: "Confirmed Bookings",
                            },
                            {
                                id: 2,
                                value: bookings - confirmedBookings - inprogressBookings,
                                label: "Cancelled Bookings",
                            },
                        ]}
                    />
                </div>

            </motion.section>
        </div>
    );
};

export default SellerDashboard;
