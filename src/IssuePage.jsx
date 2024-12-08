import React, { useState } from "react";
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
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatBot from "./ChatBot";

const IssuesPage = () => {
    const [images, setImages] = useState([]);

    const handleImageUpload = (e) => {
        // In a real implementation, this would handle actual file uploads
        const files = Array.from(e.target.files);
        setImages((prev) => [...prev, ...files.map((file) => file.name)]);
    };

    return (
        <div className="min-h-screen bg-gray-50">
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
                    <form className="space-y-6">
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
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                        <option value="">
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

                                {images.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {images.map((image, index) => (
                                            <div
                                                key={index}
                                                className="bg-green-50 px-3 py-1 rounded-full text-sm text-green-700"
                                            >
                                                {image}
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
                        <div className="bg-green-50 px-8 py-2 rounded-full text-sm text-green-700 w-full relative">
                            Category: ...
                            <br />
                            Description: ...
                            <br />
                            Date: ...
                            <br />
                            <button className="btn btn-primary bg-green-200 text-green-800 hover:text-green-800 hover:bg-green-300 border-none px-2 py-2 absolute right-4 bottom-4">
                                more details
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default IssuesPage;
