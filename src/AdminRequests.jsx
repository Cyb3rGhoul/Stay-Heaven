import React, { useEffect, useState } from "react";
import tick from "./assets/tick.png";
import cross from "./assets/cross.png";
import axios from "./utils/axios";
import { Link } from "react-router-dom";
import socket from "./utils/socket";
import useHandleErr from "./utils/useHandleErr";
import { Check, X } from "lucide-react"
import toast from "react-hot-toast";

const AdminRequests = () => {
    const [hotels, setHotels] = useState([]);
    const handleError = useHandleErr();
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
            handleError(error);
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
            if(approvalStatus === "approved"){
                toast.success("Hotel Approved Successfully");
            } else if(approvalStatus === "rejected"){
                toast.error("Hotel Rejected Successfully");
            }
        } catch (error) {
            handleError(error);
        }
    };

    useEffect(() => {
        getAllPendingHotels();

        socket.on("hotel_is_created", (data) => {
            setHotels((prev) => [...prev, data.hotel]);
        });

        socket.on("hotel_is_edited", (data) => {
            setHotels((prev) => {
                let newarr = prev.filter((hotel) => hotel._id === data._id);
                if (newarr.length === 0) return [...prev, data];
                else
                    return prev.map((hotel) =>
                        hotel._id === data._id ? data : hotel
                    );
            });
        });
        return () => {
            socket.off("new-hotel");
            socket.off("hotel_is_edited");
        };
    }, []);

    return (
        <div className="mt-10 px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto max-md:ml-[-0.7rem]">
                <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg max-md:rounded-lg">
                        <table className="min-w-full divide-y divide-emerald-200 rounded">
                            <thead className="bg-emerald-500 rounded">
                                <tr>
                                    {[
                                        "S.No.",
                                        "Hotel Name",
                                        "Owner",
                                        "Price",
                                        "City",
                                        "Status",
                                        "Document",
                                        "Details",
                                    ].map((header) => (
                                        <th
                                            key={header}
                                            scope="col"
                                            className="px-4 py-5 text-left text-xs font-medium text-white uppercase tracking-wider max-md:py-4"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-emerald-100">
                                {hotels.map((hotel, index) => (
                                    <tr
                                        key={hotel._id}
                                        className="hover:bg-emerald-50 transition-colors duration-300"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:pl-6">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {hotel.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {hotel.owner.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            ₹{" "}
                                            {typeof hotel.price === "number"
                                                ? hotel.price.toLocaleString(
                                                      "en-IN"
                                                  )
                                                : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {hotel.city}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => approveHotel(hotel._id, "approved")}
                                                    className="p-1.5 text-white bg-emerald-500 rounded-full hover:bg-emerald-600 transition-colors"
                                                    aria-label="Approve"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => approveHotel(hotel._id, "rejected")}
                                                    className="p-1.5 text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                                    aria-label="Reject"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <Link
                                                target="_blank"
                                                to={`${hotel.pdf}`}
                                                className="inline-block"
                                            >
                                                <button className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors duration-300">
                                                    Document
                                                </button>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link to={`/hotel/${hotel._id}`}>
                                                <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition-colors duration-300">
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
