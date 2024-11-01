import React, { useEffect, useState } from "react";
import tick from "./assets/tick.png";
import cross from "./assets/cross.png";
import axios from "./utils/axios";
import { Link } from "react-router-dom";
import socket from "./utils/socket";
import useHandleErr from "./utils/useHandleErr";
import toast from "react-hot-toast";
import Preloader from "./Preloader";

const AdminHotelDeleteRequests = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [hotels, setHotels] = useState([]);
    const [modal, setModal] = useState(false);
    const [reason, setReason] = useState("");
    const handleError = useHandleErr();
    const getAllPendingHotels = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                "/admin/all-hotels",
                {},
                {
                    withCredentials: true,
                }
            );
            setHotels(
                response.data.data.hotels.filter((hotel) => hotel.deleteReason)
            );
        } catch (error) {
            handleError(error)
        } finally {
            setIsLoading(false);
        }
    };

    const approveDelete = async (id) => {
        try {
            await axios.post(
                `/hotel/delete-my-created-places`,
                { id },
                {
                    withCredentials: true,
                }
            );
            toast.success("Hotel Deleted Request Approved Successfully");
        } catch (error) {
            handleError(error)
        }
    };

    const rejectDelete = async (id) => {
        try {
            await axios.post(
                "/hotel/undo-delete-request",
                { id },
                { withCredentials: true }
            );
            toast.success("Hotel Delete Request Rejected Successfully");
        } catch (error) {
            handleError(error)
        }
    };

    useEffect(() => {
        getAllPendingHotels();

        socket.on("hotel_delete_req_sent", (data) => {
            setHotels((prev) => {
                return [...prev, data.hotel];
            });
        });

        socket.on("delete_request_undone", (data) => {
            setHotels((prev) => {
                return prev.filter((hotel) => hotel._id !== data.hotel._id);
            });
        });

        socket.on("hotel_deleted", (id) => {
            setHotels((prev) => {
                return prev.filter((hotel) => hotel._id !== id);
            });
        });


        return () => {
            socket.off("hotel_delete_req_sent");
            socket.off("delete_request_undone");
            socket.off("hotel_deleted");
        };
    }, []);
    return (
       isLoading ? <Preloader /> :  <div className="mt-10 px-4 sm:px-6 lg:px-8">
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 h-fit max-h-[90vh] overflow-y-auto">
                        <div className="relative">
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
                            <h2 className="text-2xl font-bold text-green-800">
                                Reason
                            </h2>
                            <h4>{reason}</h4>
                        </div>
                    </div>
                </div>
            )}
            <div className="overflow-x-auto max-md:ml-[-0.7rem]">
                <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg max-md:rounded-lg">
                        <table className="min-w-full divide-y divide-emerald-200">
                            <thead className="bg-emerald-500">
                                <tr>
                                    {[
                                        "S.No.",
                                        "Hotel Name",
                                        "Owner",
                                        "Price",
                                        "Reason",
                                        "City",
                                        "State",
                                        "Delete Option",
                                        "Document",
                                        "Details"
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
                                            ₹ {typeof hotel.price === 'number' ? hotel.price.toLocaleString('en-IN') : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <button
                                                onClick={() => {
                                                    setReason((prev) => hotel.deleteReason);
                                                    setModal(true);
                                                }}
                                                className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors duration-300"
                                            >
                                                More
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {hotel.city}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {hotel.state}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <div className="flex justify-center gap-3">
                                                <img
                                                    src={tick}
                                                    alt="approve"
                                                    className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                                                    onClick={() => {
                                                        approveDelete(hotel._id)
                                                    }}
                                                />
                                                <img
                                                    src={cross}
                                                    alt="reject"
                                                    className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                                                    onClick={() => {
                                                        rejectDelete(hotel._id)
                                                    }}
                                                />
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

export default AdminHotelDeleteRequests;
