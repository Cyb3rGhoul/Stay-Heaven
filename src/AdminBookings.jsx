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
            setOrders((prev)=> [...prev , data.order]);
        });

        return () => {
            socket.off('new-hotel');
        };
    }, []);
    return (
        <div className="relative">
            {modal && (
                <div className="w-screen h-full bg-black/60 fixed top-0 left-0 z-10 flex items-center justify-center">
                    <div className="w-[40vw] h-[80vh] flex flex-col items-center justify-center absolute bg-white rounded-md">
                        <div
                            className="absolute right-[1%] top-[1%] text-xl font-bold"
                            onClick={() => setModal(false)}
                        >
                            X
                        </div>
                        <img src={order.hotel.images[0]} alt="" />
                        <h1>{order.hotel.title}</h1>
                        <p>Customer: {order.customer.username}</p>
                        <p className=" text-black font-semibold">
                            Guests:{" "}
                            {order.guests
                                .map(
                                    (guest) =>
                                        guest.firstName + " " + guest.lastName
                                )
                                .join(", ")}
                        </p>
                        <p>Order Date: {getDate(order.createdAt)}</p>
                        <p>Payment Id: {order.paymentDetails.razorpay_payment_id}</p>
                        <p>Razorpay Order Id: {order.paymentDetails.razorpay_payment_id}</p>
                        <Link
                            to={`/hotel/${order.hotel._id}`}
                            className="btn bg-zinc-200"
                        >
                            Hotel Details
                        </Link>
                    </div>
                </div>
            )}
            <div className="ml-2 py-4">
                <select
                    className="border-2 border-black rounded-md"
                    name="filter"
                    id="filter"
                >
                    <option value="hotelid">hotel id</option>
                    <option value="checkin">checkin</option>
                    <option value="checkout">checkout</option>
                    <option value="userid ">userid</option>
                    <option value="approvalStatus">approval status</option>
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
