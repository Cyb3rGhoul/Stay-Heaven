import React, { useRef, useState } from "react";
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

import { IoMdClose } from "react-icons/io";
import randomImage from "./assets/random.jpg";
import axios from "./utils/axios";
import useHandleErr from "./utils/useHandleErr";
import toast from "react-hot-toast";

const CreateHotel = () => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);
    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef([]);
    const pdfInputRef = useRef();
    const [files, setFiles] = useState([]);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfError, setPdfError] = useState(null);
    const submitButton = useRef();
    const closeButton = useRef();
    const handleError = useHandleErr()

    const handleClosePopup = () => {
        setSelectedBooking(null);
        setFiles([]);
        setPreviews([]);
        setPdfFile(null);
        setIsCreateBookingOpen(false);
    };

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
            pdf: ""
        });
    };

    const removeFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
    };

    const handleImageAttach = () => {
        if (files.length < 5) {
            fileInputRef.current.disabled = false;
            fileInputRef.current.click();
        } else {
            fileInputRef.current.disabled = true;
        }
    };

    const attachImageHandler = (e) => {
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
            handleError("Error while uploading the images", error);
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
            handleError("Error while uploading the PDF", error);
            return null;
        }
    };

    const createHotel = async (hotel) => {
        try {
            const response = await axios.post("/hotel/create", hotel, {
                withCredentials: true,
            });
        } catch (error) {
            handleError("Error while creating the hotel", error);
            return;
        }
    };

    const handleSubmit = async () => {
        submitButton.current.disabled = true;
        const imageUrls = await uploadImages();
        const pdfUrl = await uploadPdf();

        const hotel = {
            ...selectedBooking,
            images: imageUrls,
            pdf: pdfUrl,
        };
        createHotel(hotel);

        toast.success("Hotel Created Successfully");
        submitButton.current.disabled = false;
        setFiles([]);
        setPreviews([]);
        setPdfFile(null);
        setSelectedBooking(null);
        handleClosePopup();
        closeButton.current.click();
    };

    return (
        <Container
            style={{
                marginTop: "1em",
            }}
        >
            <div className="flex items-center justify-center h-[85vh]">
                <div className="w-80 h-80 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center p-5 transform transition-all duration-300 ease-in-out hover:scale-105">
                    <Title className="text-center mb-4">
                        My Created Places
                    </Title>
                    <CreateButton
                        onClick={handleCreateBooking}
                        className="mt-4 bg-green-500 text-white rounded-md py-2 px-4 transition-all duration-300 ease-in-out hover:bg-green-600"
                    >
                        Create a Place
                    </CreateButton>
                </div>
            </div>

            {(selectedBooking || isCreateBookingOpen) && (
                <PopupOverlay>
                    <Popup>
                        <CloseButton
                            ref={closeButton}
                            onClick={handleClosePopup}
                        >
                            ✖
                        </CloseButton>
                        <ScrollablePopupContent>
                            <input
                                className="hidden"
                                ref={fileInputRef}
                                onChange={attachImageHandler}
                                type="file"
                                accept="image/*"
                                multiple
                            />
                            {previews.length > 0 && (
                                <div className="flex gap-2 ">
                                    {previews?.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index}`}
                                                className="h-[100px] w-[100px] rounded-md relative"
                                            />
                                            <button
                                                onClick={() =>
                                                    removeFile(index)
                                                }
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
                                    opacity: files.length === 5 ? "0.2" : "1",
                                }}
                                onClick={handleImageAttach}
                                className="flex border-green-500 border-2 w-fit px-2 py-1 rounded-md gap-2"
                            >
                                Attach Images
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
                            <Input
                                type="number"
                                name="maxGuests"
                                value={selectedBooking.guests}
                                onChange={handleDetailChange}
                            />
                            <Label>
                                Price: (in INR) (
                                <span className="text-red-500">
                                    5% will be deducted
                                </span>
                                )
                            </Label>
                            <Input
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
                                    checked={selectedBooking.facilities.includes(
                                        "ac"
                                    )}
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
                                    checked={selectedBooking.facilities.includes(
                                        "gym"
                                    )}
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
                                Attach Hotel Documents PDF
                            </button>
                            {pdfError && (
                                <p className="text-red-500">{pdfError}</p>
                            )}
                            {pdfFile && (
                                <p className="text-green-500">
                                    PDF: {pdfFile.name}
                                </p>
                            )}

                            <SubmitButton
                                ref={submitButton}
                                onClick={handleSubmit}
                            >
                                Submit
                            </SubmitButton>
                        </ScrollablePopupContent>
                    </Popup>
                </PopupOverlay>
            )}
        </Container>
    );
};

export default CreateHotel;

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
