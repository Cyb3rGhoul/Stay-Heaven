import React, { useEffect, useState } from "react";
import axios from "./utils/axios";
import { Link } from "react-router-dom";
import socket from "./utils/socket";
import useHandleErr from "./utils/useHandleErr";

const AdminHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sort, setSort] = useState(null);
    const [approvalStatus, setApprovalStatus] = useState(null);
    const handleError = useHandleErr()
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
            setFilteredHotels(response.data.data.hotels);
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
        } catch (error) {
            handleError(error);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const sort = formData.get("sort");
        const approvalStatus = formData.get("ApprovalStatus");
        const type = sort?.split("-")[0];
        const order = sort?.split("-")[1];
        setFilteredHotels(hotels);
        if (!sort && !approvalStatus) {
            setFilteredHotels(hotels);
        }

        if (type === "p") {
            if (order[0] == "l")
                setFilteredHotels((prev) =>
                    prev.sort((a, b) => a.price - b.price)
                );
            else
                setFilteredHotels((prev) =>
                    prev.sort((a, b) => b.price - a.price)
                );
        } else if (type == "r") {
            if (order[0] == "l")
                setFilteredHotels((prev) =>
                    prev.sort((a, b) => a.revenue - b.revenue)
                );
            else
                setFilteredHotels((prev) =>
                    prev.sort((a, b) => b.revenue - a.revenue)
                );
        }

        if (approvalStatus == "approved") {
            setFilteredHotels((prev) =>
                prev.filter((hotel) => hotel.approvalStatus === "approved")
            );
        } else if (approvalStatus == "rejected") {
            setFilteredHotels((prev) =>
                prev.filter((hotel) => hotel.approvalStatus === "rejected")
            );
        }

        setIsOpen(prev => !prev)
    };

    const reset = () => {
        document.querySelectorAll('input[type="radio"]').forEach((radio) => {
            radio.checked = false;
        });
        setFilteredHotels(hotels);
        setSort(null)
        setApprovalStatus(null)
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
        <div className="mt-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="mb-6 flex justify-between overflow-hidden">
                <button
                    onClick={popup}
                    className="btn text-white max-sm:scale-75 bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300 shadow-md"
                >
                    Apply Filters
                </button>
                <label className="input input-bordered flex items-center max-sm:scale-50 gap-2 mr-6">
                    <input
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type="text"
                        className="grow"
                        placeholder="Search"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </label>
            </div>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-emerald-700">
                                Filters
                            </h2>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setIsOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={submitHandler} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Sort By
                                </h3>
                                <div className="space-y-2">
                                    <label className="inline-flex items-center mr-2">
                                        <input
                                            type="radio"
                                            name="sort"
                                            value="p-lowToHigh"
                                            checked={sort === "p-lowToHigh"}
                                            onChange={(e) => setSort(e.target.value)}
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">
                                            Low to High (Price)
                                        </span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="sort"
                                            value="p-highToLow"
                                            checked={sort === "p-highToLow"}
                                            onChange={(e) => setSort(e.target.value)}
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">
                                            High to Low (Price)
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="inline-flex items-center mr-2">
                                        <input
                                            type="radio"
                                            name="sort"
                                            value="r-lowToHigh"
                                            checked={sort === "r-lowToHigh"}
                                            onChange={(e) => setSort(e.target.value)}
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">
                                            Low to High (Revenue)
                                        </span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="sort"
                                            value="r-highToLow"
                                            checked={sort === "r-highToLow"}
                                            onChange={(e) => setSort(e.target.value)}
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">
                                            High to Low (Revenue)
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Approval Status
                                </h3>
                                <div className="space-y-2">
                                    <label className="inline-flex items-center mr-2">
                                        <input
                                            type="radio"
                                            name="ApprovalStatus"
                                            value="approved"
                                            checked={approvalStatus === "approved"}
                                            onChange={(e) => setApprovalStatus(e.target.value)}
                                            className="form-radio text-emerald-600"
                                        />
                                        <span className="ml-2">Approved</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="ApprovalStatus"
                                            value="rejected"
                                            checked={approvalStatus === "rejected"}
                                            onChange={(e) => setApprovalStatus(e.target.value)}
                                            className="form-radio text-emerald-600"
                                        />
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
                            {[
                                "S.No.",
                                "Hotel Name",
                                "Owner",
                                "Price",
                                "Revenue",
                                "City",
                                "State",
                                "Document",
                                "Status",
                                "Details",
                            ].map((header) => (
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
                        {filteredHotels
                            .filter((item) => {
                                return searchTerm.toLowerCase() === ""
                                    ? item
                                    : item.title
                                          .toLowerCase()
                                          .includes(searchTerm.toLowerCase()) ||
                                          item.city
                                              .toLowerCase()
                                              .includes(
                                                  searchTerm.toLowerCase()
                                              ) ||
                                          item.state
                                              .toLowerCase()
                                              .includes(
                                                  searchTerm.toLowerCase()
                                              ) ||
                                              item.owner.username
                                                  .toLowerCase()
                                                  .includes(
                                                      searchTerm.toLowerCase()
                                                  );
                            })
                            .map((hotel, index) => (
                                <tr
                                    key={hotel._id}
                                    className="hover:bg-emerald-50 transition-colors duration-300"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {hotel.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {hotel.owner.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ₹{" "}
                                        {typeof hotel.price === "number"
                                            ? hotel.price.toLocaleString(
                                                  "en-IN"
                                              )
                                            : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ₹{" "}
                                        {typeof hotel.revenue === "number"
                                            ? hotel.revenue.toLocaleString(
                                                  "en-IN"
                                              )
                                            : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {hotel.city}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {hotel.state}
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <select
                                            className="block w-fit py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
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
