import React, { useEffect, useState } from "react";
import axios from "./utils/axios";
import { useNavigate } from "react-router-dom";
import socket from "./utils/socket";

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [order, setOrder] = useState(false);
    const [createdhotel, setCreatedHotel] = useState(false);
    const [pastbookings, setPastbookings] = useState(false);
    const navigate = useNavigate();

    const makeAdmin = async (id) => {
        try {
            const response = await axios.post(
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
        } catch (error) {
            console.log(error);
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
        } catch (error) {
            console.log(error);
        }
    };

    const makeCreator = async (id) => {
        try {
            const response = await axios.post(
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
        } catch (error) {
            console.log(error);
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
        } catch (error) {
            console.log(error);
        }
    };

    const makeBan = async (id) => {
        try {
            const response = await axios.post(
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
            console.log(error);
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
            console.log(error);
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
        getUsers();

        socket.on('user_is_created', (data) => {
            setUsers((prev) => [...prev, data.user]);
        });

        return () => {
            socket.off('new-hotel');
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
                                    .map((guest) => guest.firstName + " " + guest.lastName)
                                    .join(", ")}
                            </p>
                            <div className="flex gap-2 font-semibold text-center">
                                <p>{getDate(order.checkin)}</p> to <p>{getDate(order.checkout)}</p>
                            </div>
                            <p>Payment Order Id: {order.paymentDetails.razorpay_payment_id}</p>
                            <button
                                onClick={() => navigate(`/hotel/${pastbookings.hotel._id}`)}
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
                            <p className="font-semibold">Hotel id: {createdhotel._id}</p>
                            <button
                                onClick={() => navigate(`/hotel/${createdhotel.hotel._id}`)}
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
                            <p className="font-semibold">Total: ₹{pastbookings.amount}</p>
                        </div>
                    )}
                </div>
            )}
            <div className="ml-2 py-4">
                <select
                    className="border-2 border-green-400 rounded-md p-2 text-gray-700 shadow-sm focus:border-green-600 focus:ring focus:ring-green-300 transition duration-200 ease-in-out"
                    name="filter"
                    id="filter"
                >
                    <option value="select" className="bg-gray-100">Select</option>
                    <option value="username" className="bg-gray-100">Username</option>
                    <option value="email" className="bg-gray-100">Email</option>
                    <option value="previousBookings" className="bg-gray-100">Previous Bookings</option>
                    <option value="myCreatedPlaces" className="bg-gray-100">My Created Places</option>
                    <option value="admin" className="bg-gray-100">Admin</option>
                    <option value="seller" className="bg-gray-100">Seller</option>
                    <option value="receivedOrders" className="bg-gray-100">Received Orders</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="table min-w-full">
                    <thead>
                        <tr className="font-bold text-lg">
                            <th>S.No.</th>
                            <th className="text-center">Username</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Full Name</th>
                            <th className="text-center">Phone Number</th>
                            <th className="text-center">Past Bookings</th>
                            <th className="text-center">Admin</th>
                            <th className="text-center">Seller</th>
                            <th className="text-center">Created Hotels</th>
                            <th className="text-center">Orders</th>
                            <th className="text-center">Ban</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <th className="text-center">{index + 1}</th>
                                <td className="flex items-center gap-3 text-center">
                                    <div className="avatar">
                                        <div className="mask mask-squircle h-12 w-12">
                                            <img
                                                src={user.avatar}
                                                alt="Avatar"
                                            />
                                        </div>
                                    </div>
                                    <div className="font-bold">{user.username}</div>
                                </td>
                                <td className="text-center">{user.email}</td>
                                <td className="text-center">{user.fullName}</td>
                                <td className="text-center">+91 {user.phoneNumber}</td>
                                <td className="text-center">
                                    <select
                                        className="select bg-zinc-200 select-ghost select-sm"
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
                                        <option value="" disabled selected>
                                            Order ID
                                        </option>
                                        {user.previousBookings.map((order) => (
                                            <option key={order._id} value={order._id}>
                                                {order._id}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="text-center mt-2">
                                    <select
                                        className="select bg-zinc-200 select-ghost select-sm w-full md:w-auto"
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
                                <td className="text-center mt-2">
                                    <select
                                        className="select bg-zinc-200 select-ghost select-sm w-full md:w-auto"
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
                                <td className="text-center mt-2">
                                    <select
                                        disabled={!user.isCreator}
                                        className="select bg-zinc-200 select-ghost select-sm w-full md:w-auto"
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
                                        <option value="" disabled selected>
                                            Hotels
                                        </option>
                                        {user.myCreatedPlaces.map((hotel) => (
                                            <option key={hotel.title}>{hotel.title}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="text-center mt-2">
                                    <select
                                        disabled={!user.isCreator}
                                        className="select bg-zinc-200 select-ghost select-sm w-full md:w-auto"
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
                                        <option value="" disabled selected>
                                            Received Order ID
                                        </option>
                                        {user.receivedOrders.map((order) => (
                                            <option key={order._id} value={order._id}>
                                                {order._id}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="text-center mt-2">
                                    <select
                                        className="select bg-zinc-200 select-ghost select-sm w-full md:w-auto"
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

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default AdminUser;
