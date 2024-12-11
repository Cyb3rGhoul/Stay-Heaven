import React, { useEffect, useRef, useState } from "react";
import {
    Camera,
    Upload,
    Send,
    AlertCircle,
    Calendar,
    Home,
    Phone,
    Mail,
    User,
    Cross,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatBot from "./ChatBot";
import toast from "react-hot-toast";
import axios from "./utils/axios";
import { IoIosClose } from "react-icons/io";
import ImageSlider from "./ImageSlider";
import socket from "./utils/socket";

const IssuesPage = () => {
    const [files, setFiles] = useState([]);
    const [issues, setIssues] = useState([]);
    const [issue, setIssue] = useState({});
    const [previews, setPreviews] = useState([]);
    const [popup, setPopup] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 5) {
            toast.error("You can only upload a maximum of 5 images.");
            return;
        }
        const updatedFiles = [...files, ...selectedFiles];
        setFiles(updatedFiles);
        const newPreviews = selectedFiles?.map((file) =>
            URL.createObjectURL(file)
        );
        setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };

    const uploadImages = async () => {
        let urls = [];
        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append(
                    "upload_preset",
                    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
                );
                formData.append(
                    "cloud_name",
                    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
                );
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${
                        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
                    }/image/upload`,
                    formData
                );
                urls.push(response.data.secure_url);
            }
            return urls;
        } catch (error) {
            console.log(error);
            return;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const imageUrls = await uploadImages();
        const formData = new FormData(e.target);
        // Log the data
        const formDataObject = Object.fromEntries(formData.entries());
        try {
            const response = await axios.post(
                "/issue/create",
                {
                    category: formDataObject.category,
                    description: formDataObject.description,
                    images: imageUrls,
                },
                { withCredentials: true }
            );
            e.target.reset();
            setFiles([]);
            toast.success("Issue created successfully");
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

    const getIssues = async () => {
        try {
            const response = await axios.post(
                "/issue/get",
                {},
                { withCredentials: true }
            );
            console.log(response.data.data);
            setIssues(response.data.data.issues);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };
    useEffect(() => {
        getIssues();

        socket.on("statusUpdated", ({ id, status }) => {
            setIssues((prev) =>
                prev.map((issue) =>
                    issue._id === id ? { ...issue, status } : issue
                )
            );
        });
    }, []);
    return (
        <div className="min-h-screen bg-gray-50 relative">
            {popup && (
                <div className="fixed z-50 h-screen w-full flex items-center justify-center bg-black/50">
                    <div className=" bg-white rounded-xl p-4 flex flex-col items-center justify-center max-h-[70vh]">
                        {/* images Swiper */}
                        <ImageSlider images={issue.images} />
                        <h1 className="text-green-700">
                            Category: {issue.category}
                        </h1>
                        <p className="text-green-700">
                            Description: {issue.description}
                        </p>
                        <p className="text-green-700">
                            Date: {getTime(issue.createdAt)}
                        </p>
                        <button
                            onClick={() => {
                                setPopup(false);
                            }}
                            className="btn btn-primary bg-green-200 text-green-800 hover:text-green-800 hover:bg-green-300 border-none px-2 py-2 "
                        >
                            close
                        </button>
                    </div>
                </div>
            )}
            {/* <ChatBot /> */}
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-10 mt-20">
                    <h1 className="text-4xl font-bold text-green-800 mb-4">
                        How Can We Help You?
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We're here to assist you with any issues or concerns.
                        Please fill out the form below and we'll get back to you
                        as soon as possible.
                    </p>
                </div>

                {/* Main Form */}
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Issue Details Section */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-green-700 flex items-center gap-2">
                                <AlertCircle className="h-6 w-6" />
                                Issue Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Issue Category
                                    </label>
                                    <select
                                        name="category"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option disabled selected value="">
                                            Select a category
                                        </option>
                                        <option value="booking">
                                            Booking Related
                                        </option>
                                        <option value="payment">
                                            Payment Issues
                                        </option>
                                        <option value="amenities">
                                            Amenities
                                        </option>
                                        <option value="cleanliness">
                                            Cleanliness
                                        </option>
                                        <option value="service">
                                            Customer Service
                                        </option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Issue Description
                                    </label>
                                    <textarea
                                        name="description"
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Please describe your issue in detail..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-green-700 flex items-center gap-2">
                                <Camera className="h-6 w-6" />
                                Upload Images
                            </h2>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    multiple
                                    ref={fileInputRef}
                                    accept="image/*"
                                    className="hidden"
                                    id="image-upload"
                                    onChange={handleImageUpload}
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer flex flex-col items-center space-y-2"
                                >
                                    <Upload className="h-12 w-12 text-green-600" />
                                    <span className="text-gray-600">
                                        Drop your images here or click to upload
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        (Maximum 5 images, up to 5MB each)
                                    </span>
                                </label>

                                {files.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {files.map((image, index) => (
                                            <div
                                                key={index}
                                                className="bg-green-50 px-3 py-1 rounded-full text-sm text-green-700 flex items-center justify-center"
                                            >
                                                {image.name}

                                                <IoIosClose
                                                    className="text-xl cursor-pointer"
                                                    onClick={() =>
                                                        setFiles(
                                                            files.filter(
                                                                (_, i) =>
                                                                    i !== index
                                                            )
                                                        )
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                            <Send className="h-5 w-5" />
                            Submit Issue
                        </button>
                    </form>
                </div>

                {/* previous Issues */}
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-10">
                    <h2 className="text-2xl font-semibold text-green-700 flex items-center gap-2">
                        <Home className="h-6 w-6" />
                        Previous Issues
                    </h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {issues.map((issue) => (
                            <div
                                key={issue._id}
                                className={`${issue.status === "pending" ? "bg-red-100" : "bg-green-50"} px-8 py-2 rounded-full text-sm text-green-700 w-full relative`}
                            >
                                Category: {issue.category}
                                <br />
                                Description: {issue.description.slice(0, 100)}
                                <br />
                                Date: {getTime(issue.createdAt)}
                                <br />
                                Status: {issue.status}
                                <button
                                    onClick={() => {
                                        setPopup(!popup);
                                        setIssue(issue);
                                    }}
                                    className="btn btn-primary bg-green-200 text-green-800 hover:text-green-800 hover:bg-green-300 border-none px-2 py-2 absolute right-4 bottom-4"
                                >
                                    more details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default IssuesPage;
