import React, { useEffect, useState } from "react";
import axios from "./utils/axios";
import { Link } from "react-router-dom";
import socket from "./utils/socket";

const AdminHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const popup = () => {
        console.log("hi");
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
            console.log(response.data.data.hotels);
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
        <div className="mt-10 max-w-7xl mx-auto">
            <div className="ml-2 py-4">
                <button
                    onClick={popup}
                    className="btn text-white bg-green-600 hover:bg-green-700"
                >
                    Apply Filters
                </button>
            </div>
            {isOpen && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 transition-opacity duration-300 ease-in-out">
                    <div className="mt-16 w-[40vw] max-h-[90vh] p-4 relative bg-white rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col">
                        <div
                            className="absolute right-3 top-3 text-xl font-bold cursor-pointer text-black-100 hover:text-black-100 bg-white rounded-full w-8 h-8 flex items-center justify-center"
                            onClick={() => setIsOpen(false)}
                        >
                            ✘
                        </div>
                        <form onSubmit={submitHandler}>
                            <div className="w-1/2">
                                <h1 className="text-xl mb-4">Sort By Price</h1>
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="radio"
                                        name="price"
                                        className="radio radio-success"
                                        id="p-lowToHigh"
                                        value="lowToHigh"
                                    />
                                    <label htmlFor="p-lowToHigh">
                                        Low to High
                                    </label>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="radio"
                                        name="price"
                                        className="radio radio-success"
                                        id="p-highToLow"
                                        value="highToLow"
                                    />
                                    <label htmlFor="p-highToLow">
                                        High to Low
                                    </label>
                                </div>

                                <h1 className="text-xl mb-4">
                                    Sort By Revenue
                                </h1>
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="radio"
                                        name="revenue"
                                        className="radio radio-success"
                                        id="r-lowToHigh"
                                        value="lowToHigh"
                                    />
                                    <label htmlFor="r-lowToHigh">
                                        Low to High
                                    </label>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="radio"
                                        name="revenue"
                                        className="radio radio-success"
                                        id="r-highToLow"
                                        value="highToLow"
                                    />
                                    <label htmlFor="r-highToLow">
                                        High to Low
                                    </label>
                                </div>

                                <h1 className="text-xl mb-4">
                                    Approval Status
                                </h1>
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="radio"
                                        name="ApprovalStatus"
                                        className="radio radio-success"
                                        id="a-approved"
                                        value="approved"
                                    />
                                    <label htmlFor="a-approved">Approved</label>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="radio"
                                        name="ApprovalStatus"
                                        className="radio radio-success"
                                        id="a-rejected"
                                        value="rejected"
                                    />
                                    <label htmlFor="a-rejected">Rejected</label>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="btn text-white bg-green-600 hover:bg-green-700"
                                >
                                    Apply
                                </button>
                                <button
                                onClick={reset}
                                    className="btn hover:text-white bg-white text-green-500 border-green-500 border-2 hover:bg-green-700"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto shadow-lg sm:rounded-lg bg-white p-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-600 text-white">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                                S.No.
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                            >
                                Hotel Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                            >
                                Owner
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                            >
                                Price
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                            >
                                City
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                            >
                                State
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                            >
                                Status
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                            >
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {hotels.map((hotel, index) => (
                            <tr
                                key={hotel._id}
                                className="hover:bg-green-100 transition-colors duration-300"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {hotel.title}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {hotel.owner.username}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    ₹ {hotel.price}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {hotel.city}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {hotel.state}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <select
                                        className="border-gray-300 rounded-md p-1 bg-white shadow-sm focus:ring focus:ring-green-200 transition ease-in-out"
                                        value={hotel.approvalStatus}
                                        onChange={(e) => {
                                            approveHotel(
                                                hotel._id,
                                                e.target.value
                                            );
                                            setHotels((prev) =>
                                                prev.map((h) =>
                                                    h._id === hotel._id
                                                        ? {
                                                              ...h,
                                                              approvalStatus:
                                                                  e.target
                                                                      .value,
                                                          }
                                                        : h
                                                )
                                            );
                                        }}
                                    >
                                        <option value="approved">
                                            Approved
                                        </option>
                                        <option value="rejected">
                                            Rejected
                                        </option>
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
