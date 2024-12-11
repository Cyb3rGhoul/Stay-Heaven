import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "./utils/axios";
import tick from "./assets/tick.png";
import cross from "./assets/cross.png";
import socket from "./utils/socket";

const AdminIssues = () => {
    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [filterPopup, setFilteredPopup] = useState(false);
    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("");

    const getIssues = async () => {
        try {
            const response = await axios.post(
                "/admin/issue",
                {},
                { withCredentials: true }
            );
            setIssues(response.data.data.issues);
            setFilteredIssues(response.data.data.issues);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const getTime = (time) => {
        time = new Date(time);
        // Format the time as 12:00 PM
        const formattedTime = time.toLocaleTimeString("en-US", {
            hour12: true,
            hour: "numeric",
            minute: "numeric",
        });

        // Format the date as dd/mm/yyyy
        const formattedDate = time.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        // Combine the formatted time and date
        const formattedTimeAndDate = `${formattedTime} - ${formattedDate}`;

        return formattedTimeAndDate;
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.post(
                "/admin/issue-update",
                { id, status },
                {
                    withCredentials: true,
                }
            );
            console.log(issues);
            console.log(id);
            setIssues((prev) =>
                prev.map((issue) =>
                    issue._id === id ? { ...issue, status } : issue
                )
            );
            setFilteredIssues((prev) =>
                prev.map((issue) =>
                    issue._id === id ? { ...issue, status } : issue
                )
            );
            toast.success("Issue Updated Successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const filterIssues = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (data.status !== "" && data.status)
            setFilteredIssues((prev) =>
                issues.filter((issue) => issue.status === data.status)
            );
        if (data.category !== "" && data.category)
            setFilteredIssues((prev) =>
                prev.filter((issue) => issue.category === data.category)
            );
        setFilteredPopup(false);
    };

    const reset = () => {
        setFilteredIssues(issues);
        setStatus("");
        setCategory("");
        setFilteredPopup(false);
    };

    useEffect(() => {
        getIssues();

        socket.on("issue_is_created", (data) => {
            setIssues((prev) => [...prev, data.issue]);
            setFilteredIssues(prev => [...prev, data.issue])
        });

        return () => {
            socket.off("issue_is_created");
        };
    }, []);
    return (
        <div className="mt-10 px-4 sm:px-6 lg:px-8">
            {filterPopup && (
                <div className="fixed z-50 h-screen w-screen top-0 left-0 flex items-center justify-center bg-black/50">
                    <form
                        onSubmit={filterIssues}
                        className=" bg-white rounded-xl p-4 flex flex-col items-center justify-center max-h-[70vh] gap-4"
                    >
                        <h1>Category:</h1>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            name="category"
                            className="block w-fit py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        >
                            <option disabled selected value="">
                                Select a category
                            </option>
                            <option value="booking">Booking Related</option>
                            <option value="payment">Payment Issues</option>
                            <option value="amenities">Amenities</option>
                            <option value="cleanliness">Cleanliness</option>
                            <option value="service">Customer Service</option>
                            <option value="other">Other</option>
                        </select>
                        <h1>Status:</h1>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            name="status"
                            className="block w-fit py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        >
                            <option disabled selected value="">
                                Select a category
                            </option>
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                        </select>
                        <div className="flex items-center justify-center gap-4">
                            <button
                                type="submit"
                                className="btn text-white max-sm:scale-75 bg-green-600 hover:bg-green-700 transition-colors duration-300 shadow-md max-md:ml-[-1.5rem]"
                            >
                                Apply
                            </button>
                            <button
                                onClick={reset}
                                type="submit"
                                className="btn text-white max-sm:scale-75 bg-green-600 hover:bg-green-700 transition-colors duration-300 shadow-md max-md:ml-[-1.5rem]"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <div className="ml-4 mb-6 overflow-hidden flex max-md:flex-col-reverse max-md:items-center sm:justify-between max-md:ml-[-.5rem]">
                <button
                    onClick={() => setFilteredPopup(!filterPopup)}
                    className="btn text-white max-sm:scale-75 bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300 shadow-md max-md:ml-[-1.5rem]"
                >
                    Apply Filters
                </button>
            </div>
            <div className="overflow-x-auto shadow-md rounded-lg  max-md:ml-[-.5rem]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-emerald-500">
                        <tr>
                            {[
                                "S.No.",
                                "Issue ID",
                                "Issue Category",
                                "Issue Description",
                                "Issue Date and Time",
                                "Issue Status",
                                "Raised By",
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
                        {filteredIssues?.map(
                            (
                                {
                                    _id,
                                    category,
                                    description,
                                    images,
                                    createdAt,
                                    status,
                                    user,
                                },
                                i
                            ) => (
                                <tr key={_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {i + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {description.length > 100
                                            ? description.slice(0, 100) + "..."
                                            : description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getTime(createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <select
                                            className="block w-fit py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                            value={status}
                                            onChange={(e) => {
                                                updateStatus(
                                                    _id,
                                                    e.target.value
                                                );
                                            }}
                                        >
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="resolved">
                                                Resolved
                                            </option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.fullName}
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminIssues;
