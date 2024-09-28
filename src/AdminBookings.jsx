import React, { useEffect, useState } from "react";
import axios from "./utils/axios";
import { Link } from "react-router-dom";
import socket from "./utils/socket";

const AdminBookings = () => {
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState({});
    const [modal, setModal] = useState(false);
    const getAllOrders = async () => {
        try {
            const response = await axios.post(
                "/admin/all-orders",
                {},
                {
                    withCredentials: true,
                }
            );
            console.log(response.data.data.orders);
            setOrders(response.data.data.orders);
        } catch (error) {
            console.log(error);
        }
    };

    const getDate = (date) => {
        const specificDate = new Date(date);

        const day = String(specificDate.getDate()).padStart(2, "0");
        const month = String(specificDate.getMonth() + 1).padStart(2, "0");
        const year = specificDate.getFullYear();

        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate;
    };
    useEffect(() => {
        getAllOrders();


        socket.on('order_is_created', (data) => {
            console.log('New hotel created:', data);
            setOrders((prev) => [...prev, data.order]);
        });

        return () => {
            socket.off('new-hotel');
        };
    }, []);
    return (
        <div className="relative mt-10">
            {modal && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 transition-opacity duration-300 ease-in-out">
                    <div className="mt-16 w-[40vw] max-h-[90vh] bg-white rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col">
                        <div className="relative">
                            <img src={order.hotel.images[0]} alt={order.hotel.title} className="object-cover w-full h-48 rounded-t-lg" />
                            <div
                                className="absolute right-3 top-3 text-xl font-bold cursor-pointer text-black-100 hover:text-black-100 bg-white rounded-full w-8 h-8 flex items-center justify-center"
                                onClick={() => setModal(false)}
                            >
                                ✘
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                            <div className="p-5 flex flex-col gap-3">
                                <h1 className="text-2xl font-semibold text-gray-800">{order.hotel.title}</h1>
                                <p className="text-gray-600">Customer: <span className="font-semibold">{order.customer.username}</span></p>
                                <p className="text-gray-600 font-semibold">
                                    Guests: {order.guests.map(guest => `${guest.firstName} ${guest.lastName}`).join(", ")}
                                </p>
                                <p className="text-gray-600">Order Date: <span className="font-semibold">{getDate(order.createdAt)}</span></p>
                                <p className="text-gray-600">Payment ID: <span className="font-semibold">{order.paymentDetails.razorpay_payment_id}</span></p>
                                <p className="text-gray-600">Razorpay Order ID: <span className="font-semibold">{order.paymentDetails.razorpay_order_id}</span></p>
                                <Link
                                    to={`/hotel/${order.hotel._id}`}
                                    className="bg-green-500 text-white rounded-md py-2 text-center transition duration-200 hover:bg-green-600 mt-4"
                                >
                                    Hotel Details
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <div className="ml-2 py-4">
                <select
                    className="border-2 border-green-500 rounded-md bg-white px-4 py-2 text-gray-700 shadow-md focus:ring-2 focus:ring-green-300 transition-all duration-200 ease-in-out hover:border-green-600 cursor-pointer"
                    name="filter"
                    id="filter"
                >
                    <option value="hotelid" className="text-gray-700">Hotel ID</option>
                    <option value="checkin" className="text-gray-700">Check-in</option>
                    <option value="checkout" className="text-gray-700">Check-out</option>
                    <option value="userid" className="text-gray-700">User ID</option>
                    <option value="approvalStatus" className="text-gray-700">Approval Status</option>
                </select>

            </div>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr className="font-bold text-lg">
                            <th>S.No.</th>
                            <th className="text-center">Order Id</th>
                            <th className="text-center">Check-in Date</th>
                            <th className="text-center">Check-out Date</th>
                            <th className="text-center">Rooms</th>
                            <th className="text-center">Amount</th>
                            <th className="text-center">Details</th>
                            <th className="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => {
                            return (
                                <tr>
                                    <th className="text-center">{index + 1}</th>
                                    <td className="text-center">{order._id}</td>
                                    <td className="text-center">
                                        {getDate(order.checkin)}
                                    </td>
                                    <td className="text-center">
                                        {getDate(order.checkout)}
                                    </td>
                                    <td className="text-center">
                                        {order.rooms}
                                    </td>
                                    <td className="text-center">
                                        ₹ {order.amount}
                                    </td>
                                    <td className="text-center">
                                        <button
                                            className="btn bg-zinc-200"
                                            onClick={() => {
                                                setModal(true);
                                                setOrder(order);
                                            }}
                                        >
                                            More
                                        </button>
                                    </td>
                                    <td className="text-center">Confirmed</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBookings;
