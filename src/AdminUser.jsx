import React, { useEffect, useState } from "react";
import axios from "./utils/axios";
import { Link, useNavigate } from "react-router-dom";
import socket from "./utils/socket";
import useHandleErr from "./utils/useHandleErr";

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [order, setOrder] = useState(false);
    const [createdhotel, setCreatedHotel] = useState(false);
    const [pastbookings, setPastbookings] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAdmin, setIsAdmin] = useState(null);
    const [isSeller, setIsSeller] = useState(null);
    const [isBan, setIsBan] = useState(null);
    const navigate = useNavigate();
    const handleError = useHandleErr()
    const popup = () => {
        setIsOpen((prev) => !prev);
    };

    const headers = [
        "S.No.",
        "Username",
        "Email",
        "Full Name",
        "Phone Number",
        "Past Bookings",
        "Admin",
        "Seller",
        "Created Hotels",
        "Orders",
        "Ban",
        "Address",
        "Aadhaar Card",
        "Pan Card"
    ];

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const isBan = formData.get("isBan");
        const isAdmin = formData.get("isAdmin");
        const isSeller = formData.get("isSeller");

        setFilteredUsers(users);
        if (!isAdmin && !isSeller && !isBan) {
            setFilteredUsers(users);
        }
        setFilteredUsers((prev) =>
            prev.filter(
                (user) =>
                    (!isBan || user.isban === (isBan === "true")) &&
                    (!isAdmin || user.isAdmin === (isAdmin === "true")) &&
                    (!isSeller || user.isCreator === (isSeller === "true"))
            )
        );

        setIsOpen((prev) => !prev);
    };

    const reset = () => {
        document.querySelectorAll('input[type="radio"]').forEach((radio) => {
            radio.checked = false;
        });
        setFilteredUsers(users);
        setIsAdmin(null);
        setIsBan(null);
        setIsSeller(null);
    };

    const makeAdmin = async (id) => {
        try {
            await axios.post(
                "/admin/make-admin",
                { id },
                {
                    withCredentials: true,
                }
            );
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isAdmin: true } : user
                )
            );
            setFilteredUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isAdmin: true } : user
                )
            );
        } catch (error) {
            handleError(error);
        }
    };

    const removeAdmin = async (id) => {
        try {
            await axios.post(
                "/admin/remove-admin",
                { id },
                {
                    withCredentials: true,
                }
            );
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isAdmin: false } : user
                )
            );
            setFilteredUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isAdmin: false } : user
                )
            );
        } catch (error) {
            handleError(error);
        }
    };

    const makeCreator = async (id) => {
        try {
            await axios.post(
                "/admin/make-creator",
                { id },
                {
                    withCredentials: true,
                }
            );
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isCreator: true } : user
                )
            );
            setFilteredUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isCreator: true } : user
                )
            );
        } catch (error) {
            handleError(error);
        }
    };

    const removeCreator = async (id) => {
        try {
            await axios.post(
                "/admin/remove-creator",
                { id },
                {
                    withCredentials: true,
                }
            );
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isCreator: false } : user
                )
            );
            setFilteredUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isCreator: false } : user
                )
            );
        } catch (error) {
            handleError(error);
        }
    };

    const makeBan = async (id) => {
        try {
            await axios.post(
                "/admin/ban-user",
                { id },
                {
                    withCredentials: true,
                }
            );
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isban: true } : user
                )
            );
        } catch (error) {
            handleError(error);
        }
    };

    const removeBan = async (id) => {
        try {
            await axios.post(
                "/admin/unban-user",
                { id },
                {
                    withCredentials: true,
                }
            );
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id ? { ...user, isban: false } : user
                )
            );
        } catch (error) {
            handleError(error);
        }
    };

    const getUsers = async () => {
        try {
            const response = await axios.post(
                "/admin/all-users",
                {},
                {
                    withCredentials: true,
                }
            );
            setUsers(response.data.data.users);
            setFilteredUsers(response.data.data.users);
        } catch (error) {
            handleError(error);
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
        getUsers();

        socket.on("user_is_created", (data) => {
            setUsers((prev) => [...prev, data.user]);
            setFilteredUsers((prev) => [...prev, data.user]);
        });

        socket.on("removed_seller", (data) => {
            setUsers((prev) => [...prev, data.user]);
            setFilteredUsers((prev) => [...prev, data.user]);
        });

        return () => {
            socket.off("new-hotel");
            socket.off("removed_seller");
        };
    }, []);
    return (
        <div className="mt-10">
            {(order || createdhotel || pastbookings) && (
                <div className="w-screen h-full bg-black/60 fixed top-0 left-0 z-10 flex items-center justify-center">
                    {order && (
                        <div className="w-[90vw] sm:w-[70vw] lg:w-[40vw] h-[80vh] flex flex-col items-center justify-center bg-white rounded-md relative p-4">
                            <div
                                className="absolute right-[2%] top-[2%] text-xl font-bold cursor-pointer"
                                onClick={() => setOrder(false)}
                            >
                                X
                            </div>
                            <img
                                className="w-[90%] h-3/5 object-cover rounded-md"
                                src={order.hotel.images[0]}
                                alt="Booking"
                            />
                            <h1 className="font-semibold text-center">
                                Hotel Name: {order.hotel.title}
                            </h1>
                            <h1 className="font-semibold text-center">
                                Order id: {order._id}
                            </h1>
                            <p>Price: {order.amount}</p>
                            <p>Order Date: {getDate(order.createdAt)}</p>
                            <p>Rooms: {order.rooms}</p>
                            <p className="text-black font-semibold">
                                Guests:{" "}
                                {order.guests
                                    .map(
                                        (guest) =>
                                            guest.firstName +
                                            " " +
                                            guest.lastName
                                    )
                                    .join(", ")}
                            </p>
                            <div className="flex gap-2 font-semibold text-center">
                                <p>{getDate(order.checkin)}</p> to{" "}
                                <p>{getDate(order.checkout)}</p>
                            </div>
                            <p>
                                Payment Order Id:{" "}
                                {order.paymentDetails.razorpay_payment_id}
                            </p>
                            <button
                                onClick={() =>
                                    navigate(`/hotel/${pastbookings.hotel._id}`)
                                }
                                className="btn bg-green-500 text-white hover:bg-green-700"
                            >
                                Hotel Details
                            </button>
                        </div>
                    )}

                    {createdhotel && (
                        <div className="w-[90vw] sm:w-[70vw] lg:w-[40vw] h-[80vh] flex flex-col items-center justify-center bg-white rounded-md relative p-4">
                            <div
                                className="absolute right-[2%] top-[2%] text-xl font-bold cursor-pointer"
                                onClick={() => setCreatedHotel(false)}
                            >
                                X
                            </div>
                            <img
                                className="w-[90%] h-3/5 object-cover rounded-md"
                                src={createdhotel.images[0]}
                                alt="Booking"
                            />
                            <h1 className="text-center text-2xl font-bold text-green-500">
                                {createdhotel.title}
                            </h1>
                            <p className="text-center text-black font-semibold">
                                {createdhotel.description}
                            </p>
                            <p className="font-semibold">
                                Hotel id: {createdhotel._id}
                            </p>
                            <button
                                onClick={() =>
                                    navigate(`/hotel/${createdhotel.hotel._id}`)
                                }
                                className="btn bg-green-500 text-white hover:bg-green-700"
                            >
                                More Details
                            </button>
                        </div>
                    )}

                    {pastbookings && (
                        <div className="w-[90vw] sm:w-[70vw] lg:w-[40vw] h-[80vh] flex flex-col items-center justify-center bg-white rounded-md relative p-4">
                            <div
                                className="absolute right-[2%] top-[2%] text-xl font-bold cursor-pointer"
                                onClick={() => setPastbookings(false)}
                            >
                                X
                            </div>
                            <img
                                className="w-[90%] h-3/5 object-cover rounded-md"
                                src={pastbookings.hotel.images[0]}
                                alt="Booking"
                            />
                            <h1 className="text-center text-2xl font-bold text-green-500">
                                {pastbookings.hotel.title}
                            </h1>
                            <p className="text-center text-black font-semibold">
                                {pastbookings.hotel.description}
                            </p>
                            <div className="flex gap-2 font-semibold text-center">
                                <p>{getDate(pastbookings.checkin)}</p> to{" "}
                                <p>{getDate(pastbookings.checkout)}</p>
                            </div>
                            <p className="font-semibold">
                                Total: ₹{pastbookings.amount}
                            </p>
                        </div>
                    )}
                </div>
            )}
            <div className="mb-6 flex justify-between">
                <button
                    onClick={popup}
                    className="btn text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300 shadow-md mr-2 ml-2"
                >
                    Apply Filters
                </button>
                <label className="input input-bordered flex items-center gap-2 mr-6">
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
                                    Admin Status
                                </h3>
                                <div className="space-y-2">
                                    <label className="inline-flex items-center mr-2">
                                        <input
                                            type="radio"
                                            name="isAdmin"
                                            value="false"
                                            checked={isAdmin === "false"}
                                            onChange={(e) =>
                                                setIsAdmin(e.target.value)
                                            }
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">Not Admin</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="isAdmin"
                                            value="true"
                                            checked={isAdmin === "true"}
                                            onChange={(e) =>
                                                setIsAdmin(e.target.value)
                                            }
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">Is Admin</span>
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Seller Status
                                </h3>
                                <div className="space-y-2">
                                    <label className="inline-flex items-center mr-2">
                                        <input
                                            type="radio"
                                            name="isSeller"
                                            value="false"
                                            checked={isSeller === "false"}
                                            onChange={(e) =>
                                                setIsSeller(e.target.value)
                                            }
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">Not Seller</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="isSeller"
                                            value="true"
                                            checked={isSeller === "true"}
                                            onChange={(e) =>
                                                setIsSeller(e.target.value)
                                            }
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">Is Seller</span>
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Ban Status
                                </h3>
                                <div className="space-y-2">
                                    <label className="inline-flex items-center mr-2">
                                        <input
                                            type="radio"
                                            name="isBan"
                                            value="false"
                                            checked={isBan === "false"}
                                            onChange={(e) =>
                                                setIsBan(e.target.value)
                                            }
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">Not Banned</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="isBan"
                                            value="true"
                                            checked={isBan === "true"}
                                            onChange={(e) =>
                                                setIsBan(e.target.value)
                                            }
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">Banned</span>
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
            <div className="overflow-x-auto mr-2 ml-2 ">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-emerald-500">
                        <tr>
                            {headers.map((header) => (
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
                        {filteredUsers
                            .filter((item) => {
                                return searchTerm.toLowerCase() === ""
                                    ? item
                                    : item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    item.fullName.toLowerCase().includes(searchTerm.toLowerCase());
                            })
                            .map((user, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.fullName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        +91 {user.phoneNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            className="text-sm text-gray-500 bg-amber-50 border border-amber-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-200"
                                            value=""
                                            onChange={(e) => {
                                                const selectedOrderId = e.target.value;
                                                const selectedOrder = user.previousBookings.find(
                                                    (order) => order._id === selectedOrderId
                                                );
                                                if (selectedOrder) {
                                                    setPastbookings(selectedOrder);
                                                }
                                            }}
                                        >
                                            <option value="" disabled>Order ID</option>
                                            {user.previousBookings.map((order) => (
                                                <option key={order._id} value={order._id}>
                                                    {order._id}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            className="text-sm text-gray-500 bg-amber-50 border border-amber-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-200"
                                            value={user.isAdmin ? "yes" : "no"}
                                            onChange={(e) => {
                                                if (e.target.value === "yes") {
                                                    makeAdmin(user._id);
                                                } else {
                                                    removeAdmin(user._id);
                                                }
                                            }}
                                        >
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            className="text-sm text-gray-500 bg-amber-50 border border-amber-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-200"
                                            value={user.isCreator ? "yes" : "no"}
                                            onChange={(e) => {
                                                if (e.target.value === "yes") {
                                                    makeCreator(user._id);
                                                } else {
                                                    removeCreator(user._id);
                                                }
                                            }}
                                        >
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            disabled={!user.isCreator}
                                            className="text-sm text-gray-500 bg-amber-50 border border-amber-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:opacity-50"
                                            value=""
                                            onChange={(e) => {
                                                const hoteltitle = e.target.value;
                                                const selectedHotel = user.myCreatedPlaces.find(
                                                    (hotel) => hotel.title === hoteltitle
                                                );
                                                if (selectedHotel) {
                                                    setCreatedHotel(selectedHotel);
                                                }
                                            }}
                                        >
                                            <option value="" disabled>Hotels</option>
                                            {user.myCreatedPlaces.map((hotel) => (
                                                <option key={hotel.title}>{hotel.title}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            disabled={!user.isCreator}
                                            className="text-sm text-gray-500 bg-amber-50 border border-amber-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:opacity-50"
                                            value=""
                                            onChange={(e) => {
                                                const receivedbooking = e.target.value;
                                                const selectedbooking = user.receivedOrders.find(
                                                    (order) => order._id === receivedbooking
                                                );
                                                if (selectedbooking) {
                                                    setOrder(selectedbooking);
                                                }
                                            }}
                                        >
                                            <option value="" disabled>Received Order ID</option>
                                            {user.receivedOrders.map((order) => (
                                                <option key={order._id} value={order._id}>
                                                    {order._id}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            className="text-sm text-gray-500 bg-amber-50 border border-amber-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-200"
                                            value={user.isban ? "yes" : "no"}
                                            onChange={(e) => {
                                                if (e.target.value === "yes") {
                                                    makeBan(user._id);
                                                } else {
                                                    removeBan(user._id);
                                                }
                                            }}
                                        >
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.address || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {user.aadhaar ? (
                                            <Link target="_blank" to={`${user.aadhaar}`}>
                                                <button className="px-3 py-1 text-emerald-600 hover:text-emerald-900 font-medium transition duration-300">
                                                    Document
                                                </button>
                                            </Link>
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {user.pan ? (
                                            <Link target="_blank" to={`${user.pan}`}>
                                                <button className="px-3 py-1 text-emerald-600 hover:text-emerald-900 font-medium transition duration-300">
                                                    Document
                                                </button>
                                            </Link>
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUser;
