import React, { useEffect, useState } from "react";
import axios from "./utils/axios";
import { Link } from "react-router-dom";
import socket from "./utils/socket";

const AdminHotels = () => {
    const [hotels, setHotels] = useState([]);
    const getAllHotels = async () => {
        try {
            const response = await axios.post(
                "/admin/all-hotels",
                {},
                {
                    withCredentials: true,
                }
            );
            console.log(response.data.data.hotels);
            setHotels(response.data.data.hotels);
        } catch (error) {
            console.log(error);
        }
    };

    const approveHotel = async (id, approvalStatus) => {
        try {
            const response = await axios.post(
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
    useEffect(() => {
        getAllHotels();

        socket.on('hotel_is_created', (data) => {
            console.log('New hotel created:', data);
            setHotels((prev)=> [...prev , data.hotel]);
        });

        return () => {
            socket.off('new-hotel');
        };

    }, []);
    return (
        <div>
            <div className="ml-2 py-4">
                <select
                    className="border-2 border-black rounded-md"
                    name="filter"
                    id="filter"
                >
                    <option value="title">title</option>
                    <option value="owner">owner</option>
                    <option value="price">price</option>
                    <option value="city">city</option>
                    <option value="state">state</option>
                    <option value="approvalStatus">approval status</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr className="font-bold text-lg">
                            <th>S.No.</th>
                            <th className="text-center">Hotel Name</th>
                            <th className="text-center">Owner</th>
                            <th className="text-center">Price</th>
                            <th className="text-center">City</th>
                            <th className="text-center">State</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Details</th>
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
                                        {hotel.owner.username}
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
                                        <select
                                            className="select bg-zinc-200 select-ghost select-sm"
                                            value={hotel.approvalStatus} // Bind the hotel-specific approval status
                                            onChange={(e) => {
                                                const selectedValue =
                                                    e.target.value;

                                                // Update the hotel approval status in the state and call the API
                                                approveHotel(
                                                    hotel._id,
                                                    selectedValue
                                                );

                                                setHotels((prevHotels) =>
                                                    prevHotels.map((h) =>
                                                        h._id === hotel._id
                                                            ? {
                                                                  ...h,
                                                                  approvalStatus:
                                                                      selectedValue,
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
                                    <td className="text-center flex justify-center ">
                                        <Link to={`/hotel/${hotel._id}`}>
                                            <button className="btn bg-zinc-200">
                                                More
                                            </button>
                                        </Link>
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

export default AdminHotels;
