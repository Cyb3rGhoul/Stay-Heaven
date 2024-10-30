import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    FaWifi,
    FaSnowflake,
    FaParking,
    FaUtensils,
    FaCoffee,
} from "react-icons/fa";
import { CgGym } from "react-icons/cg";
import { Link } from "react-router-dom";

import { IoMdClose } from "react-icons/io";
import randomImage from "./assets/random.jpg";
import axios from "./utils/axios";
import useHandleErr from "./utils/useHandleErr";
import toast from "react-hot-toast";

const Edit = ({ selectedHotel, EditPopup }) => {
    const [selectedBooking, setSelectedBooking] = useState(selectedHotel);
    const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);
    const [previews, setPreviews] = useState(selectedHotel.images);
    const [oldImages, setOldImages] = useState(selectedHotel.images);
    const [newImages, setNewImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const file = useRef([]);
    const [files, setFiles] = useState([]);
    const [updatedOldImages, setUpdatedOldImages] = useState(
        selectedHotel.images
    );
    const [pdfFile, setPdfFile] = useState(null);
    const pdfInputRef = useRef();
    const [pdfError, setPdfError] = useState(null);

    const handleClosePopup = () => {
        toast.success("Hotel Edited Successfully");
        setFiles([]);
        setPreviews([]);
        setDeletedImages([]);
        setIsCreateBookingOpen(false);
        EditPopup();
    };
    const handleError = useHandleErr();

    const handleDetailChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.split(",")[0] === "facility") {
            setSelectedBooking({
                ...selectedBooking,
                facilities: selectedBooking.facilities.includes(
                    name.split(",")[1]
                )
                    ? selectedBooking.facilities.filter(
                          (facility) => facility !== name.split(",")[1]
                      )
                    : [...selectedBooking.facilities, name.split(",")[1]],
            });
        } else {
            setSelectedBooking({
                ...selectedBooking,
                [name]: type === "checkbox" ? checked : value,
            });
        }
    };

    const handleCreateBooking = () => {
        setIsCreateBookingOpen(true);
        setSelectedBooking({
            images: [],
            title: "",
            description: "",
            maxGuests: 1,
            facilities: [],
            address: "",
            city: "",
            state: "",
            pinCode: "",
            price: 0,
            pdf: "",
        });
    };

    const removeFile = (index) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
    };
    const handleAttach = () => {
        if (previews.length < 5) {
            file.current.disabled = false;
            file.current.click();
        } else {
            file.current.disabled = true;
        }
    };

    const handlePdfAttach = () => {
        pdfInputRef.current.click();
    };

    const attachPdfHandler = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            if (file.size <= 5 * 1024 * 1024) {
                setPdfFile(file);
                setPdfError(null);
            } else {
                setPdfError("The PDF file must be smaller than 5MB.");
                setPdfFile(null);
            }
        } else {
            setPdfError("Please upload a valid PDF file.");
            setPdfFile(null);
        }
    };

    const attachHandler = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length + previews.length > 5) {
            toast.error("You can only upload a maximum of 5 files.");
            return;
        }

        const newPreviews = selectedFiles.map((file) =>
            URL.createObjectURL(file)
        );
        setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };
    const uploadImages = async (newfiles) => {
        let urls = [];

        try {
            for (const file of newfiles) {
                const formdata = new FormData();
                formdata.append("file", file);
                formdata.append(
                    "upload_preset",
                    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
                );
                formdata.append(
                    "cloud_name",
                    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
                );

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${
                        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
                    }/image/upload`,
                    formdata
                );

                urls.push(response.data.secure_url);
            }
            return urls;
        } catch (error) {
            toast.error("Error while uploading the images");
            return;
        }
    };

    const uploadPdf = async () => {
        if (!pdfFile) return null;

        try {
            const formData = new FormData();
            formData.append("file", pdfFile);
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
            toast.error("Error while uploading the PDF");
            return;
        }
    };

    const editHotel = async (hotel) => {
        try {
            await axios.post(
                `/hotel/edit`,
                { hotel },
                {
                    withCredentials: true,
                }
            );
        } catch (error) {
            handleError(error);
        }
    };

    async function convertObjectUrlsToFiles() {
        const newFiles = [];
        for (const img of previews) {
            // Check if the URL is an object URL (starting with "blob:")
            if (img.startsWith("blob:")) {
                // Convert the object URL to a File
                const response = await fetch(img);
                const blob = await response.blob();

                // Use a placeholder name or derive one as needed
                const fileName = `file_${Date.now()}`;
                const file = new File([blob], fileName, { type: blob.type });

                // Add to the new files array
                newFiles.push(file);
            }
        }

        // Update the files state with the new files
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        return newFiles;
    }

    function arraysAreEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;

        return arr1.every((value, index) => value === arr2[index]);
    }
    const handleSubmit = async () => {
        let deleted = [];
        let updated = [];
        let urls;
        if (arraysAreEqual(previews, oldImages)) {
            urls = oldImages;
        } else {
            setUpdatedOldImages((prev) => {
                updated = prev.filter((img) => {
                    if (previews.includes(img)) return true;
                    else {
                        deleted.push(img);
                        return false;
                    }
                });

                return updated;
            });
            let newfiles = await convertObjectUrlsToFiles();
            urls = await uploadImages(newfiles);
            urls = [...updated, ...urls];
        }
        const pdfUrl = await uploadPdf();
        let hotel;
        if (!pdfUrl)
            hotel = {
                ...selectedBooking,
                images: urls,
                newPdf: false,
                old: selectedBooking.pdf,
                deletedImages: deleted,
            };
        else
            hotel = {
                ...selectedBooking,
                images: urls,
                pdf: pdfUrl,
                newPdf: true,
                old: selectedBooking.pdf,
                deletedImages: deleted,
            };
        await editHotel(hotel);
        handleClosePopup();
    };

    return (
        <PopupOverlay>
            <Popup>
                <CloseButton onClick={EditPopup}>✖</CloseButton>
                <ScrollablePopupContent>
                    <input
                        className="hidden"
                        onChange={attachHandler}
                        ref={file}
                        type="file"
                        accept="image/*"
                        multiple
                    />
                    {previews.length > 0 && (
                        <div className="flex gap-2 ">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        className="h-[100px] w-[100px] rounded-md relative"
                                    />
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="absolute -top-2 -right-2 bg-green-500/60 text-white rounded-full   p-1"
                                    >
                                        <IoMdClose />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <button
                        style={{
                            opacity: previews.length == 5 ? "0.2" : "1",
                        }}
                        onClick={handleAttach}
                        className="flex border-green-500 border-2 w-fit px-2 py-1 rounded-md gap-2"
                    >
                        <img src="/Attach.svg" alt="" />
                        Attach
                    </button>
                    <Label>Hotel Title</Label>
                    <Input
                        type="text"
                        name="title"
                        value={selectedBooking.title}
                        onChange={handleDetailChange}
                    />
                    <Label>Description</Label>
                    <Input
                        type="text"
                        name="description"
                        value={selectedBooking.description}
                        onChange={handleDetailChange}
                    />
                    <Label>Max Guests Per Room</Label>
                    <input
                        className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
                        type="number"
                        name="maxGuests"
                        value={selectedBooking.maxGuests}
                        onChange={handleDetailChange}
                    />
                    <Label>Price: (in INR)</Label>
                    <input
                        className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
                        type="number"
                        name="price"
                        value={selectedBooking.price}
                        onChange={handleDetailChange}
                    />
                    <Label>Address</Label>
                    <Input
                        type="text"
                        name="address"
                        value={selectedBooking.address}
                        onChange={handleDetailChange}
                    />
                    <Label>City</Label>
                    <Input
                        type="text"
                        name="city"
                        value={selectedBooking.city}
                        onChange={handleDetailChange}
                    />
                    <Label>State</Label>
                    <Input
                        type="text"
                        name="state"
                        value={selectedBooking.state}
                        onChange={handleDetailChange}
                    />
                    <Label>Pin Code</Label>
                    <Input
                        type="text"
                        name="pinCode"
                        value={selectedBooking.pinCode}
                        onChange={handleDetailChange}
                    />
                    <CheckboxContainer>
                        <CheckboxLabel
                            checked={selectedBooking.facilities.includes(
                                "wifi"
                            )}
                        >
                            <HiddenCheckbox
                                name="facility,wifi"
                                checked={selectedBooking.facilities.includes(
                                    "wifi"
                                )}
                                onChange={handleDetailChange}
                            />
                            <FaWifi size={28} />
                            WiFi
                        </CheckboxLabel>
                        <CheckboxLabel
                            checked={selectedBooking.facilities.includes("ac")}
                        >
                            <HiddenCheckbox
                                name="facility,ac"
                                checked={selectedBooking.facilities.includes(
                                    "ac"
                                )}
                                onChange={handleDetailChange}
                            />
                            <FaSnowflake size={28} />
                            AC
                        </CheckboxLabel>
                        <CheckboxLabel
                            checked={selectedBooking.facilities.includes(
                                "parking"
                            )}
                        >
                            <HiddenCheckbox
                                name="facility,parking"
                                checked={selectedBooking.facilities.includes(
                                    "parking"
                                )}
                                onChange={handleDetailChange}
                            />
                            <FaParking size={28} />
                            Parking
                        </CheckboxLabel>
                        <CheckboxLabel
                            checked={selectedBooking.facilities.includes(
                                "kitchen"
                            )}
                        >
                            <HiddenCheckbox
                                name="facility,kitchen"
                                checked={selectedBooking.facilities.includes(
                                    "kitchen"
                                )}
                                onChange={handleDetailChange}
                            />
                            <FaUtensils size={28} />
                            Kitchen
                        </CheckboxLabel>
                        <CheckboxLabel
                            checked={selectedBooking.facilities.includes("gym")}
                        >
                            <HiddenCheckbox
                                name="facility,gym"
                                checked={selectedBooking.facilities.includes(
                                    "gym"
                                )}
                                onChange={handleDetailChange}
                            />
                            <CgGym size={36} />
                            Gym
                        </CheckboxLabel>
                        <CheckboxLabel
                            checked={selectedBooking.facilities.includes(
                                "breakfast"
                            )}
                        >
                            <HiddenCheckbox
                                name="facility,breakfast"
                                checked={selectedBooking.facilities.includes(
                                    "breakfast"
                                )}
                                onChange={handleDetailChange}
                            />
                            <FaCoffee size={28} />
                            Breakfast
                        </CheckboxLabel>
                    </CheckboxContainer>
                    <input
                        className="hidden"
                        ref={pdfInputRef}
                        onChange={attachPdfHandler}
                        type="file"
                        accept="application/pdf"
                    />
                    <button
                        onClick={handlePdfAttach}
                        className="flex border-green-500 border-2 w-fit px-2 py-1 rounded-md gap-2"
                    >
                        Update Hotel Document
                    </button>
                    {pdfFile && (
                        <p className="text-green-500">
                            PDF: {pdfInputRef.current.files[0].name}
                        </p>
                    )}
                    <Link target="_blank" to={`${selectedBooking.pdf}`}>
                        <button className="px-3 py-1 bg-zinc-200 rounded-md hover:bg-zinc-300 transition-colors">
                            Preview Hotel Document
                        </button>
                    </Link>
                    <SubmitButton onClick={handleSubmit}>Edit</SubmitButton>
                </ScrollablePopupContent>
            </Popup>
        </PopupOverlay>
    );
};

export default Edit;

const Container = styled.div`
    padding: 20px;
    background-color: #f0f0f0;
    color: #333;
    font-family: "Josefin Sans", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
`;

const Title = styled.h2`
    color: #2a9d8f;
    margin-bottom: 20px;
    text-align: center;
    font-size: 32px;
    font-weight: bold;
`;

const CreateButton = styled.button`
    padding: 10px;
    background-color: #2a9d8f;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: block;
    margin: 0 auto 20px;
`;

const ScrollableContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const BookingCard = styled.div`
    display: flex;
    flex-direction: row;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
`;

const Image = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 8px;
    margin-right: 20px;
    @media (max-width: 768px) {
        margin-right: 0;
        margin-bottom: 20px;
    }
`;

const Description = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 14px;
    color: #333;
`;

const PopupOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const Popup = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 80%;
    overflow-y: auto;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    position: relative;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
`;

const ScrollablePopupContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const ImageUploadContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: space-between;
`;

const ImageUpload = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 48%;
    position: relative;
`;

const ImageInput = styled.input`
    display: none;
`;

const PopupImage = styled.img`
    width: 100%;
    height: auto;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 10px;
`;

const AddImageButton = styled.button`
    padding: 10px;
    background-color: #2a9d8f;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    align-self: center;
`;

const Label = styled.label`
    font-size: 14px;
    color: #333;
`;

const Input = styled.input`
    width: 100%;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
`;

const CheckboxContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const CheckboxLabel = styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100px;
    text-align: center;
    background-color: ${({ checked }) => (checked ? "#CAFFCB" : "#fff")};
    border-color: ${({ checked }) => (checked ? "#04AF70" : "#ddd")};
    box-shadow: ${({ checked }) =>
        checked
            ? "0 4px 8px rgba(0, 0, 0, 0.2)"
            : "0 2px 4px rgba(0, 0, 0, 0.1)"};

    &:hover {
        border-color: #04af70;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
    display: none;
`;

const SubmitButton = styled.button`
    padding: 10px;
    background-color: #2a9d8f;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    align-self: center;
`;
