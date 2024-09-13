import React, { useEffect, useState } from "react";
import axios from "./utils/axios";
import { useNavigate } from "react-router-dom";

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

        const day = String(specificDate.getDate()).padStart(2, "0"); // Ensures two digits
        const month = String(specificDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
        const year = specificDate.getFullYear();

        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate; // Correctly returning formattedDate
    };
    useEffect(() => {
        getUsers();
    }, []);
    return (
        <div>
            {(order || createdhotel || pastbookings) && (
                <div className="w-screen h-full bg-black/60 fixed top-0 left-0 z-10 flex items-center justify-center">
                    {order && (
                        <div className="w-[40vw] h-[80vh] flex flex-col items-center justify-center absolute bg-white rounded-md">
                            <div
                                className="absolute right-[1%] top-[1%] text-xl font-bold"
                                onClick={() => setOrder(false)}
                            >
                                X
                            </div>
                            <img
                                className="w-[90%] h-3/5 object-cover rounded-md"
                                src={order.hotel.images[0]}
                                alt="Booking"
                            />
                            <h1 className="font-semibold">Hotel Name: {order.hotel.title}</h1>
                            <h1 className="font-semibold">
                                Order id: {order._id}
                            </h1>
                            <p>Price: {order.amount}</p>
                            <p>Order Date: {getDate(order.createdAt)}</p>
                            <p>Rooms: {order.rooms}</p>
                            <p className=" text-black font-semibold">
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
                            <div className="flex gap-2 font-semibold">
                                <p>{getDate(order.checkin)}</p> to
                                <p>{getDate(order.checkout)}</p>
                            </div>
                            <p>Payment Order Id: {order.paymentDetails.razorpay_payment_id}</p> 
                            <p>Payment Id: {order.paymentDetails.razorpay_payment_id}</p>
                            <button
                                onClick={() =>
                                    navigate(`/hotel/${pastbookings.hotel._id}`)
                                }
                                className="btn btn-primary bg-white border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-800"
                            >
                                Hotel Details
                            </button>
                        </div>
                    )}
                    {createdhotel && (
                        <div className="w-[40vw] h-[80vh] gap-2 flex flex-col items-center justify-center  absolute bg-white rounded-md">
                            <div
                                className="absolute right-[1%] top-[1%] text-xl font-bold"
                                onClick={() => setCreatedHotel(false)}
                            >
                                X
                            </div>
                            <img
                                className="w-[90%] h-3/5 object-cover rounded-md"
                                src={createdhotel.images[0]}
                                alt="Booking"
                            />
                            <h1 className="text-center text-2xl font-bold text-green-500 ">
                                {createdhotel.title}
                            </h1>
                            <p className="text-center text-black font-semibold">
                                {createdhotel.description}
                            </p>
                            <p className="font-semibold">
                                Hotel id: {createdhotel._id}
                            </p>
                            <p className="font-semibold">
                                {" "}
                                Date of Creation:{" "}
                                {getDate(createdhotel.createdAt)}
                            </p>
                            <p className="font-semibold">Approval Status: {createdhotel.approvalStatus}</p>
                            <button
                                onClick={() =>
                                    navigate(`/hotel/${createdhotel.hotel._id}`)
                                }
                                className="btn btn-primary bg-white border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-800"
                            >
                                More Details
                            </button>
                        </div>
                    )}
                    {pastbookings && (
                        <div className="w-[40vw] h-[80vh] flex flex-col items-center justify-center absolute bg-white rounded-md">
                            <div
                                className="absolute right-[1%] top-[1%] text-xl font-bold"
                                onClick={() => setPastbookings(false)}
                            >
                                X
                            </div>
                            <img
                                className="w-[90%] h-3/5 object-cover rounded-md"
                                src={pastbookings.hotel.images[0]}
                                alt="Booking"
                            />
                            <h1 className="text-center text-2xl font-bold text-green-500 ">
                                {pastbookings.hotel.title}
                            </h1>
                            <p className="text-center text-black font-semibold">
                                {pastbookings.hotel.description}
                            </p>
                            <p className=" text-black font-semibold">
                                Guests:{" "}
                                {pastbookings.guests
                                    .map(
                                        (guest) =>
                                            guest.firstName +
                                            " " +
                                            guest.lastName
                                    )
                                    .join(", ")}
                            </p>
                            <p>Approval Status: {pastbookings.approvalStatus}</p>
                            <p>Order Date: {getDate(pastbookings.createdAt)}</p>
                            <p>Rooms: {pastbookings.rooms}</p>
                            <p>Razorpay Order Id: {pastbookings.paymentDetails.razorpay_payment_id}</p> 
                            <p>Razorpay Payment Id: {pastbookings.paymentDetails.razorpay_payment_id}</p> 

                            <div className="flex gap-2 font-semibold">
                                <p>{getDate(pastbookings.checkin)}</p> to
                                <p>{getDate(pastbookings.checkout)}</p>
                            </div>
                            <p className="font-semibold">
                                Total: ₹{pastbookings.amount}
                            </p>
                            <p className="font-semibold">
                                order id: {pastbookings._id}
                            </p>
                            
                        </div>
                    )}
                </div>
            )}
            <div className="ml-2 py-4">
                <select
                    className="border-2 border-black rounded-md"
                    name="filter"
                    id="filter"
                >
                    <option value="select">select</option>
                    <option value="username">username</option>
                    <option value="email">email</option>
                    <option value="previousBookings">previous bookings</option>
                    <option value="myCreatedPlaces">my created places</option>
                    <option value="admin">admin</option>
                    <option value="seller">seller</option>
                    <option value="receivedOrders">received orders</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="table">
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
                        {users.map((user, index) => {
                            return (
                                <tr>
                                    <th className="text-center">{index + 1}</th>
                                    <td>
                                        <div className="flex items-center gap-3 text-center">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img
                                                        src={user.avatar}
                                                        alt="Avatar Tailwind CSS Component"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">
                                                    {user.username}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        {user.email}
                                    </td>
                                    <td className="text-center">
                                        {user.fullName}
                                    </td>
                                    <td className="text-center">
                                        +91 {user.phoneNumber}
                                    </td>
                                    <td className="text-center">
                                        <select
                                            className="select bg-zinc-200 select-ghost select-sm"
                                            value=""
                                            onChange={(e) => {
                                                const selectedOrderId =
                                                    e.target.value;
                                                const selectedOrder =
                                                    user.previousBookings.find(
                                                        (order) =>
                                                            order._id ===
                                                            selectedOrderId
                                                    );
                                                if (selectedOrder) {
                                                    setPastbookings(
                                                        selectedOrder
                                                    );
                                                }
                                            }}
                                        >
                                            <option value="" disabled selected>
                                                order id
                                            </option>
                                            {user.previousBookings.map(
                                                (order) => (
                                                    <option
                                                        key={order._id}
                                                        value={order._id}
                                                    >
                                                        {order._id}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </td>
                                    <td className="text-center  mt-2  ">
                                        <select
                                            className="select bg-zinc-200 select-ghost select-sm"
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
                                    <td className="">
                                        <select
                                            className="select bg-zinc-200 select-ghost select-sm"
                                            value={
                                                user.isCreator ? "yes" : "no"
                                            }
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
                                    <td className="text-center">
                                        <select
                                            disabled={!user.isCreator}
                                            className="select bg-zinc-200 select-ghost select-sm"
                                            value=""
                                            onChange={(e) => {
                                                const hoteltitle =
                                                    e.target.value;
                                                const selectedHotel =
                                                    user.myCreatedPlaces.find(
                                                        (hotel) =>
                                                            hotel.title ===
                                                            hoteltitle
                                                    );
                                                if (selectedHotel) {
                                                    setCreatedHotel(
                                                        selectedHotel
                                                    );
                                                }
                                            }}
                                        >
                                            <option value="" disabled selected>
                                                Hotels
                                            </option>
                                            {user.myCreatedPlaces.map(
                                                (hotel) => (
                                                    <option>
                                                        {hotel.title}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            disabled={!user.isCreator}
                                            className="select bg-zinc-200 select-ghost select-sm"
                                            value=""
                                            onChange={(e) => {
                                                const receivedbooking =
                                                    e.target.value;
                                                const selectedbooking =
                                                    user.receivedOrders.find(
                                                        (order) =>
                                                            order._id ===
                                                            receivedbooking
                                                    );
                                                if (selectedbooking) {
                                                    setOrder(selectedbooking);
                                                }
                                            }}
                                        >
                                            <option value="" disabled selected>
                                                Received Order id
                                            </option>
                                            {user.receivedOrders.map(
                                                (order) => (
                                                    <option
                                                        key={order._id}
                                                        value={order._id}
                                                    >
                                                        {order._id}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </td>
                                    <td className="">
                                        <select
                                            className="select bg-zinc-200 select-ghost select-sm"
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
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUser;
