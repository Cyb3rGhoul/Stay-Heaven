import React, { useEffect, useState } from "react";
import tick from "./assets/tick.png";
import cross from "./assets/cross.png";
import axios from "./utils/axios";
import { Link } from "react-router-dom";
import socket from "./utils/socket";


const AdminRequests = () => {
    const [hotels, setHotels] = useState([]);


    const getAllPendingHotels = async () => {
        try {
            const response = await axios.post(
                "/admin/all-pending-hotels",
                {},
                {
                    withCredentials: true,
                }
            );
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
            getAllPendingHotels();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        
        getAllPendingHotels();


        socket.on('hotel_is_created', (data) => {
            console.log('New hotel created:', data);
            setHotels((prev)=> [...prev , data.hotel]);
        });

        return () => {
            socket.off('new-hotel');
        };
    }, []);
    
    return (
        <div className="mt-10">
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr className="font-bold text-lg">
                            <th>S.No.</th>
                            <th className="text-center">Hotel Name</th>
                            <th className="text-center">Owner</th>
                            <th className="text-center">Price</th>
                            <th className="text-center">City</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hotels.map((hotel, index) => {
                            return (
                                <tr>
                                    <th>1</th>
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
                                    <td className="flex justify-center gap-5 mt-2">
                                        <img
                                            src={tick}
                                            alt="tick"
                                            className="w-8 h-8 mt-[0.1rem]"
                                            onClick={() => {
                                                approveHotel(
                                                    hotel._id,
                                                    "approved"
                                                );
                                            }}
                                        />
                                        <img
                                            src={cross}
                                            alt="tick"
                                            className="w-8 h-8"
                                            onClick={() => {
                                                approveHotel(
                                                    hotel._id,
                                                    "rejected"
                                                );
                                            }}
                                        />
                                    </td>
                                    <td className="text-center">
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

export default AdminRequests;
