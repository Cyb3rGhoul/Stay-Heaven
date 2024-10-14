import axios from "./utils/axios"
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SellerBookings = () => {
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState({});
    const [modal, setModal] = useState(false);

    const getAllOrders = async () => {
        try {
            const response = await axios.post(
                "/user/get-orders",
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
        return specificDate.toLocaleDateString("en-GB");
    };

    useEffect(() => {
        getAllOrders();
    }, []);
    return (
        <div className="mt-10 px-4 sm:px-6 lg:px-8">
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="relative">
                            <img
                                src={order.hotel.images[0]}
                                alt={order.hotel.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <button
                                className="absolute top-2 right-2 bg-white rounded-full p-2 text-gray-600 hover:text-gray-800"
                                onClick={() => setModal(false)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {order.hotel.title}
                            </h2>
                            <p className="text-gray-600">
                                Guests:{" "}
                                <span className="font-semibold">
                                    {order.guests
                                        .map(
                                            (guest) =>
                                                `${guest.firstName} ${guest.lastName}`
                                        )
                                        .join(", ")}
                                </span>
                            </p>
                            <p className="text-gray-600">
                                Order Date:{" "}
                                <span className="font-semibold">
                                    {getDate(order.createdAt)}
                                </span>
                            </p>
                            <Link
                                to={`/hotel/${order.hotel._id}`}
                                className="block w-full bg-emerald-500 text-white text-center py-2 px-4 rounded-md hover:bg-emerald-600 transition duration-300"
                            >
                                Hotel Details
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <select
                    className="w-full sm:w-auto border-2 border-emerald-500 rounded-md bg-white px-4 py-2 text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-200 ease-in-out hover:border-emerald-600 cursor-pointer"
                    name="filter"
                    id="filter"
                >
                    <option value="hotelid">Hotel ID</option>
                    <option value="checkin">Check-in</option>
                    <option value="checkout">Check-out</option>
                    <option value="userid">User ID</option>
                    <option value="approvalStatus">Approval Status</option>
                </select>
            </div>

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
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
                                "Details",
                                "Status",
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
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order, index) => (
                            <tr key={order._id} className="hover:bg-gray-50">
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
                                    ₹ {order.amount - order.amount * 0.05}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setModal(true);
                                            setOrder(order);
                                        }}
                                        className="text-emerald-600 hover:text-emerald-900 transition duration-300"
                                    >
                                        More
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {order.approvalStatus}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerBookings;
