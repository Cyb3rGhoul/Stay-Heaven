import React, { useEffect, useState } from "react";
import axios from "./utils/axios";
import { Link } from "react-router-dom";
import socket from "./utils/socket";
import useHandleErr from "./utils/useHandleErr";

const AdminBookings = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [order, setOrder] = useState({});
    const [modal, setModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sort, setSort] = useState(null);
    const [approvalStatus, setApprovalStatus] = useState(null);
    const handleError = useHandleErr();
    const popup = () => {
        setIsOpen((prev) => !prev);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const sort = formData.get("sort");
        const approvalStatus = formData.get("ApprovalStatus");
        const type = sort?.split("-")[0];
        const order = sort?.split("-")[1];
        setFilteredOrders(orders);
        if (!sort && !approvalStatus) {
            setFilteredOrders(orders);
        }

        if (type === "p") {
            if (order[0] == "l")
                setFilteredOrders((prev) =>
                    prev.sort((a, b) => a.amount - b.amount)
                );
            else
                setFilteredOrders((prev) =>
                    prev.sort((a, b) => b.amount - a.amount)
                );
        }

        setFilteredOrders((prev) =>
            prev.filter(
                (order) =>
                    order.approvalStatus === approvalStatus || !approvalStatus
            )
        );
        setIsOpen((prev) => !prev);
    };

    const reset = () => {
        document.querySelectorAll('input[type="radio"]').forEach((radio) => {
            radio.checked = false;
        });
        setFilteredOrders(orders);
        setSort(null);
        setApprovalStatus(null);
    };

    const getAllOrders = async () => {
        try {
            const response = await axios.post(
                "/admin/all-orders",
                {},
                {
                    withCredentials: true,
                }
            );
            setOrders(response.data.data.orders);
            setFilteredOrders(response.data.data.orders);
        } catch (error) {
           handleError(error)
        }
    };

    const getDate = (date) => {
        const specificDate = new Date(date);
        return specificDate.toLocaleDateString("en-GB");
    };

    useEffect(() => {
        getAllOrders();

        socket.on("order_is_created", (data) => {
            setOrders((prev) => [...prev, data.order]);
        });

        return () => {
            socket.off("order_is_created");
        };
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
                                Customer:{" "}
                                <span className="font-semibold">
                                    {order.customer.username}
                                </span>
                            </p>
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
                            <p className="text-gray-600">
                                Payment ID:{" "}
                                <span className="font-semibold">
                                    {order.paymentDetails.razorpay_payment_id}
                                </span>
                            </p>
                            <p className="text-gray-600">
                                Razorpay Order ID:{" "}
                                <span className="font-semibold">
                                    {order.paymentDetails.razorpay_order_id}
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

            <div className="mb-6 flex justify-between">
                <button
                    onClick={popup}
                    className="btn text-white max-sm:scale-75 bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300 shadow-md max-md:ml-[-1.5rem]"
                >
                    Apply Filters
                </button>
                <label className="input input-bordered flex items-center max-sm:scale-75 gap-2 mr-6">
                    <input
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type="text"
                        className="grow"
                        placeholder="Search"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </label>
            </div>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-emerald-700">
                                Filters
                            </h2>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setIsOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={submitHandler} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Sort Price and Profit by:
                                </h3>
                                <div className="space-y-2">
                                    <label className="inline-flex items-center mr-2">
                                        <input
                                            type="radio"
                                            name="sort"
                                            value="p-lowToHigh"
                                            checked={sort === "p-lowToHigh"}
                                            onChange={(e) =>
                                                setSort(e.target.value)
                                            }
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">
                                            Low to High
                                        </span>
                                    </label>
                                    <label className="inline-flex items-center mr-2">
                                        <input
                                            type="radio"
                                            name="sort"
                                            value="p-highToLow"
                                            checked={sort === "p-highToLow"}
                                            onChange={(e) =>
                                                setSort(e.target.value)
                                            }
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">
                                            High to Low
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Status:
                                </h3>
                                <div className="space-y-2">
                                    <label className="inline-flex items-center mr-2">
                                        <input
                                            type="radio"
                                            name="ApprovalStatus"
                                            value="confirmed"
                                            checked={
                                                approvalStatus === "confirmed"
                                            }
                                            onChange={(e) =>
                                                setApprovalStatus(
                                                    e.target.value
                                                )
                                            }
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">Confirmed</span>
                                    </label>
                                    <label className="inline-flex items-center mr-2">
                                        <input
                                            type="radio"
                                            name="ApprovalStatus"
                                            value="cancelled"
                                            checked={
                                                approvalStatus === "cancelled"
                                            }
                                            onChange={(e) =>
                                                setApprovalStatus(
                                                    e.target.value
                                                )
                                            }
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">Cancelled</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="ApprovalStatus"
                                            value="in-progress"
                                            checked={
                                                approvalStatus === "in-progress"
                                            }
                                            onChange={(e) =>
                                                setApprovalStatus(
                                                    e.target.value
                                                )
                                            }
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">
                                            In-progress
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-300"
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={reset}
                                    type="button"
                                    className="px-4 py-2 bg-white text-emerald-600 border border-emerald-600 rounded-md hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-300"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto shadow-md rounded-lg  max-md:ml-[-.5rem]">
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
                                "Profit",
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
                        {filteredOrders
                            .filter((item) => {
                                return searchTerm.toLowerCase() === ""
                                    ? item
                                    : item.hotel.title
                                          .toLowerCase()
                                          .includes(searchTerm.toLowerCase());
                            })
                            .map((order, index) => (
                                <tr
                                    key={order._id}
                                    className="hover:bg-gray-50"
                                >
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
                                        {typeof order.amount === "number"
                                            ? order.amount.toLocaleString(
                                                  "en-IN"
                                              )
                                            : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ₹{" "}
                                        {typeof order.amount === "number"
                                            ? (
                                                  order.amount * 0.05
                                              ).toLocaleString("en-IN")
                                            : "N/A"}
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

export default AdminBookings;
