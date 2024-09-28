import React, { useEffect, useState } from "react";
import axios from "./utils/axios";
import { Link } from "react-router-dom";
import socket from "./utils/socket";

const AdminHotels = () => {
    const [hotels, setHotels] = useState([]);

    const getAllHotels = async () => {
        try {
            const response = await axios.post(
                "/admin/all-hotels",
                {},
                {
                    withCredentials: true,
                }
            );
            setHotels(response.data.data.hotels);
        } catch (error) {
            console.log(error);
        }
    };

    const approveHotel = async (id, approvalStatus) => {
        try {
            await axios.post(
                `/admin/hotel-approval`,
                { id, approvalStatus },
                {
                    withCredentials: true,
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllHotels();

        socket.on("hotel_is_created", (data) => {
            setHotels((prev) => [...prev, data.hotel]);
        });

        return () => {
            socket.off("new-hotel");
        };
    }, []);

    return (
        <div className="mt-10 max-w-7xl mx-auto">
            <div className="ml-2 py-4">
                <select className="border-2 border-green-400 rounded-md p-2 text-gray-700 shadow-sm focus:border-green-600 focus:ring focus:ring-green-300 transition duration-200 ease-in-out">
                    <option value="title">Title</option>
                    <option value="owner">Owner</option>
                    <option value="price">Price</option>
                    <option value="city">City</option>
                    <option value="state">State</option>
                    <option value="approvalStatus">Approval Status</option>
                </select>
            </div>

            <div className="overflow-x-auto shadow-lg sm:rounded-lg bg-white p-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-600 text-white">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">S.No.</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Hotel Name</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Owner</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">City</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">State</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {hotels.map((hotel, index) => (
                            <tr key={hotel._id} className="hover:bg-green-100 transition-colors duration-300">
                                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                <td className="px-6 py-4 text-center">{hotel.title}</td>
                                <td className="px-6 py-4 text-center">{hotel.owner.username}</td>
                                <td className="px-6 py-4 text-center">₹ {hotel.price}</td>
                                <td className="px-6 py-4 text-center">{hotel.city}</td>
                                <td className="px-6 py-4 text-center">{hotel.state}</td>
                                <td className="px-6 py-4 text-center">
                                    <select
                                        className="border-gray-300 rounded-md p-1 bg-white shadow-sm focus:ring focus:ring-green-200 transition ease-in-out"
                                        value={hotel.approvalStatus}
                                        onChange={(e) => {
                                            approveHotel(hotel._id, e.target.value);
                                            setHotels((prev) =>
                                                prev.map((h) =>
                                                    h._id === hotel._id
                                                        ? { ...h, approvalStatus: e.target.value }
                                                        : h
                                                )
                                            );
                                        }}
                                    >
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Link to={`/hotel/${hotel._id}`}>
                                        <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition duration-300">
                                            More
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminHotels;
