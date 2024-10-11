import React, { useEffect, useState } from "react";
import axios from "./utils/axios";
import { Link } from "react-router-dom";
import socket from "./utils/socket";

const AdminHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const popup = () => {
        setIsOpen((prev) => !prev);
    };

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

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const price = formData.get("price");
        const revenue = formData.get("revenue");
        const approvalStatus = formData.get("ApprovalStatus");

        const filters = { price, revenue, approvalStatus };
        // Implement filter logic here
    };

    const reset = () => {
       document.querySelectorAll('input[type="radio"]').forEach(radio => {
           radio.checked = false;
       });
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
        <div className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
                <button
                    onClick={popup}
                    className="btn text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300 shadow-md"
                >
                    Apply Filters
                </button>
            </div>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-emerald-700">Filters</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setIsOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={submitHandler} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Sort By Price</h3>
                                <div className="space-y-2">
                                    <label className="inline-flex items-center">
                                        <input type="radio" name="price" value="lowToHigh" className="form-radio text-emerald-600" />
                                        <span className="ml-2">Low to High</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input type="radio" name="price" value="highToLow" className="form-radio text-emerald-600" />
                                        <span className="ml-2">High to Low</span>
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Sort By Revenue</h3>
                                <div className="space-y-2">
                                    <label className="inline-flex items-center">
                                        <input type="radio" name="revenue" value="lowToHigh" className="form-radio text-emerald-600" />
                                        <span className="ml-2">Low to High</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input type="radio" name="revenue" value="highToLow" className="form-radio text-emerald-600" />
                                        <span className="ml-2">High to Low</span>
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Approval Status</h3>
                                <div className="space-y-2">
                                    <label className="inline-flex items-center">
                                        <input type="radio" name="ApprovalStatus" value="approved" className="form-radio text-emerald-600" />
                                        <span className="ml-2">Approved</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input type="radio" name="ApprovalStatus" value="rejected" className="form-radio text-emerald-600" />
                                        <span className="ml-2">Rejected</span>
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

            <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-emerald-600">
                        <tr>
                            {["S.No.", "Hotel Name", "Owner", "Price", "City", "State", "Status", "Details"].map((header) => (
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
                        {hotels.map((hotel, index) => (
                            <tr key={hotel._id} className="hover:bg-emerald-50 transition-colors duration-300">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hotel.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hotel.owner.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹ {hotel.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hotel.city}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hotel.state}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <select
                                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link to={`/hotel/${hotel._id}`}>
                                        <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-200 transition-colors duration-300">
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