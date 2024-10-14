import React, { useEffect, useState } from "react";
import tick from "./assets/tick.png";
import cross from "./assets/cross.png";
import axios from "./utils/axios";
import { Link } from "react-router-dom";
import socket from "./utils/socket";

const AdminRequests = () => {
    const [hotels, setHotels] = useState([]);

    const getAllPendingHotels = async () => {
        try {
            const response = await axios.post(
                "/admin/all-pending-hotels",
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
            getAllPendingHotels();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllPendingHotels();

        socket.on('hotel_is_created', (data) => {
            setHotels((prev) => [...prev, data.hotel]);
        });

        return () => {
            socket.off('new-hotel');
        };
    }, []);
    
    return (
        <div className="mt-10 px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">S.No.</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Hotel Name</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Owner</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">City</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Document</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {hotels.map((hotel, index) => (
                                    <tr key={hotel._id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{index + 1}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{hotel.title}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{hotel.owner.username}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">₹ {hotel.price}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{hotel.city}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <div className="flex justify-start gap-2">
                                                <img
                                                    src={tick}
                                                    alt="approve"
                                                    className="w-6 h-6 cursor-pointer"
                                                    onClick={() => approveHotel(hotel._id, "approved")}
                                                />
                                                <img
                                                    src={cross}
                                                    alt="reject"
                                                    className="w-6 h-6 cursor-pointer"
                                                    onClick={() => approveHotel(hotel._id, "rejected")}
                                                />
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <Link target="_blank" to={`${hotel.pdf}`}>
                                                <button className="px-3 py-1 bg-zinc-200 rounded-md hover:bg-zinc-300 transition-colors">
                                                   Document
                                                </button>
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <Link to={`/hotel/${hotel._id}`}>
                                                <button className="px-3 py-1 bg-zinc-200 rounded-md hover:bg-zinc-300 transition-colors">
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
            </div>
        </div>
    );
};

export default AdminRequests;