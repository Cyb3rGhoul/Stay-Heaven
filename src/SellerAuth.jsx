import React, { useEffect, useRef, useState } from "react";
import axios from "./utils/axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import socket from "./utils/socket";

const SellerFormPage = () => {
    const navigate = useNavigate();
    const aadharInputRef = useRef();
    const panInputRef = useRef();
    const [user, setUser] = useState(
        useSelector((state) => state.user.userData)
    );
    const [aadharFile, setAadharFile] = useState(null);
    const [panFile, setPanFile] = useState(null);
    const [error, setError] = useState(null);

    const uploadFile = async (file) => {
        if (!file) return null;

        try {
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
            return response.data.secure_url;
        } catch (error) {
            console.error("Error while uploading the PDF", error);
            return null;
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.target);
        const address = formData.get("address");
        if (!aadharFile || !panFile) {
            setError("Both Aadhar and Pan PDF files are required.");
            return;
        }

        try {
            const aadharUrl = await uploadFile(aadharFile);
            const panUrl = await uploadFile(panFile);

            if (!aadharUrl || !panUrl) {
                setError("Error while uploading files. Please try again.");
                return;
            }

            // backend req
            await axios.post(
                "/user/get-seller-data",
                {
                    address,
                    aadhaar: aadharUrl,
                    pan: panUrl,
                },
                {
                    withCredentials: true,
                }
            );
        } catch (error) {
            console.error("Error submitting the form", error);
            setError("Failed to submit the form. Please try again.");
        }
    };

    const handleFileAttach = (e, setFile) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            if (file.size <= 5 * 1024 * 1024) {
                setFile(file);
                setError(null);
            } else {
                setError("The PDF file must be smaller than 5MB.");
                setFile(null);
            }
        } else {
            setError("Please upload a valid PDF file.");
            setFile(null);
        }
    };

    useEffect(() => {
        socket.on("rejected_seller", (data) => {
            setUser((prev) => ({ ...prev, ...data.seller }));
        });

        socket.on("seller_request_made", (data) => {
            setUser((prev) => {
                const updatedUser = { ...prev, ...data.seller };
                return updatedUser;
            });
            console.log(user);
        });

        socket.on("seller_made", (data) => {
            navigate("/");
        });

        return () => {
            socket.off("rejected_seller");
            socket.off("seller_request_made");
            socket.off("seller_made");
        };
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50 py-10">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
                {user.sellerRequestMade ? (
                    <>
                        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
                            Your Seller Request Has Been Made and is under
                            Review <br />
                            Please wait for the Seller to approve your request
                        </h1>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
                            Become a Seller
                        </h1>
                        <form onSubmit={submitHandler} className="space-y-6">
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="relative">
                                <input
                                    name="address"
                                    placeholder="Residential Address"
                                    type="text"
                                    required
                                    className="w-full p-3 border-2 rounded-lg focus:outline-none focus:border-green-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">
                                    Upload Aadhar Card (PDF)
                                </label>
                                <input
                                    required
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) =>
                                        handleFileAttach(e, setAadharFile)
                                    }
                                    className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">
                                    Upload Pan Card (PDF)
                                </label>
                                <input
                                    required
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) =>
                                        handleFileAttach(e, setPanFile)
                                    }
                                    className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                            >
                                Verify
                            </button>

                            <p className="text-xs text-red-400">
                                Note: If you are seeing this form, it means you
                                need to apply to become a seller. If you have
                                previously applied and your application was
                                rejected, please apply again.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default SellerFormPage;
