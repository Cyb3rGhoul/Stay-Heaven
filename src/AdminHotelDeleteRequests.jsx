import React, { useEffect, useState } from "react";
import tick from "./assets/tick.png";
import cross from "./assets/cross.png";
import axios from "./utils/axios";
import { Link } from "react-router-dom";
import socket from "./utils/socket";
import useHandleErr from "./utils/useHandleErr";

const AdminHotelDeleteRequests = () => {
    const [hotels, setHotels] = useState([]);
    const [modal, setModal] = useState(false);
    const [reason, setReason] = useState("");
    const handleError = useHandleErr();
    const getAllPendingHotels = async () => {
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
        <div className="mt-10 px-4 sm:px-6 lg:px-8">
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
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                    >
                                        S.No.
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Hotel Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Owner
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Price
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Reason
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        City
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        State
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Delete Option
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Document
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {hotels.map((hotel, index) => (
                                    <tr key={hotel._id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            {index + 1}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {hotel.title}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {hotel.owner.username}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            ₹{" "}
                                            {typeof hotel.price === "number"
                                                ? hotel.price.toLocaleString(
                                                      "en-IN"
                                                  )
                                                : "N/A"}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <button
                                                onClick={() => {
                                                    setReason(
                                                        (prev) =>
                                                            hotel.deleteReason
                                                    );
                                                    setModal(true);
                                                }}
                                                className="px-3 py-1 bg-zinc-200 rounded-md hover:bg-zinc-300 transition-colors"
                                            >
                                                More
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {hotel.city}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {hotel.state}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <div className="flex justify-center gap-2">
                                                <img
                                                    src={tick}
                                                    alt="approve"
                                                    className="w-6 h-6 cursor-pointer"
                                                    onClick={() =>
                                                      approveDelete(hotel._id)
                                                    }
                                                />
                                                <img
                                                    src={cross}
                                                    alt="reject"
                                                    className="w-6 h-6 cursor-pointer"
                                                    onClick={() =>
                                                        rejectDelete(hotel._id)
                                                    }
                                                />
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <Link
                                                target="_blank"
                                                to={`${hotel.pdf}`}
                                            >
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

export default AdminHotelDeleteRequests;
