import React, { useEffect, useRef, useState } from "react";
import axios from "./utils/axios";
import styled from "styled-components";
import Edit from "./Edit";

const SellerHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [orders, setOrders] = useState(null);
    const [revenue, setRevenue] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const getAllSellerHotels = async () => {
        try {
            const response = await axios.get("/user/current-user", {
                withCredentials: true,
            });
            const allOrders = response.data.data.receivedOrders;
            const allHotels = response.data.data.myCreatedPlaces;

            for (let i = 0; i < allHotels.length; i++) {
                allHotels[i].revenue = 0;
                for (let j = 0; j < allOrders.length; j++) {
                    if (allHotels[i]._id === allOrders[j].hotel._id) {
                        allHotels[i].revenue += allOrders[j].amount;
                    }
                }
            }

            setHotels(allHotels);
            setOrders(allOrders);
        } catch (error) {
            console.log(error);
        }
    };

    const EditPopup = () => {
        setSelectedHotel(null);
        setIsEditOpen((prev) => !prev);
    };

    useEffect(() => {
        getAllSellerHotels();
    }, []);
    return (
        <div className="mt-10">
            {(selectedHotel || isEditOpen) && (
                <Edit selectedHotel={selectedHotel} EditPopup={EditPopup} />
            )}
            <div className="ml-2 py-4">
                <select
                    className="border-2 border-green-500 rounded-md bg-white px-4 py-2 text-gray-700 shadow-md focus:ring-2 focus:ring-green-300 transition-all duration-200 ease-in-out hover:border-green-600 cursor-pointer"
                    name="filter"
                    id="filter"
                >
                    <option value="title" className="text-gray-700">Title</option>
                    <option value="price" className="text-gray-700">Price</option>
                    <option value="city" className="text-gray-700">City</option>
                    <option value="state" className="text-gray-700">State</option>
                    <option value="revenue" className="text-gray-700">Revenue</option>
                </select>

            </div>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr className="font-bold text-lg">
                            <th>S.No.</th>
                            <th className="text-center">Hotel Name</th>
                            <th className="text-center">Price</th>
                            <th className="text-center">City</th>
                            <th className="text-center">State</th>
                            <th className="text-center">Revenue</th>
                            <th className="text-center">Details</th>
                            <th className="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hotels.map((hotel, index) => {
                            return (
                                <tr>
                                    <th>{index + 1}</th>
                                    <td className="text-center">
                                        {hotel.title}
                                    </td>
                                    <td className="text-center">
                                        ₹ {hotel.price}
                                    </td>
                                    <td className="text-center">
                                        {hotel.city}
                                    </td>
                                    <td className="text-center">
                                        {hotel.state}
                                    </td>
                                    <td className="text-center">
                                        {hotel.revenue}
                                    </td>
                                    <td className="text-center flex justify-center ">
                                        <button
                                            onClick={() => {
                                                setSelectedHotel(hotel);
                                                setIsEditOpen();
                                            }}
                                            className="btn bg-zinc-200"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    <td className="text-center">
                                        {hotel.approvalStatus === "approved" ? (
                                            <button className="btn bg-green-500 text-white hover:bg-white hover:border-green-500 hover:border-2 hover:text-black transition-all duration-500">
                                                Approved
                                            </button>
                                        ) : (
                                            <button className="btn bg-red-500 text-white">
                                                Rejected
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerHotels;

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
