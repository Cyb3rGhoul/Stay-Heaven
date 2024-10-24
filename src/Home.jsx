import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import axios from "./utils/axios";
import { useDispatch } from 'react-redux';
import { setSearch } from "./app/reducers/userSlice";
import socket from "./utils/socket";
import useHandleErr from "./utils/useHandleErr";

const Landing = () => {
    const navigate = useNavigate();
    const [showAllCities, setShowAllCities] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const handleError = useHandleErr()
    const toggleShowAllCities = () => {
        setShowAllCities(!showAllCities);
    };
    const [hotels, setHotels] = useState([]);
    const gethotels = async () => {
        try {
            const response = await axios("/hotel/hotels");
            setHotels(response.data.data.hotels);
        } catch (error) {
            handleError(error);
        }
    };

    useEffect(() => {
        gethotels();

        socket.on('hotel_is_approved', (data) => {
            console.log('New hotel approved:', data);
            setHotels((prev) => [...prev, data.hotel]);
        });

        socket.on("hotel_deleted", (id) => {
            setHotels((prev) => {
                return prev.filter((hotel) => hotel._id !== id);
            });
        });

        return () => {
            socket.off('new-hotel');
            socket.off("hotel_deleted");
        };
    }, []);

    const cities = [
        {
            name: "Mumbai",
            image: "https://in.bmscdn.com/m6/images/common-modules/regions/mumbai.png",
        },
        {
            name: "Delhi",
            image: "https://in.bmscdn.com/m6/images/common-modules/regions/ncr.png",
        },
        {
            name: "Bengaluru",
            image: "https://in.bmscdn.com/m6/images/common-modules/regions/bang.png",
        },
        {
            name: "Hyderabad",
            image: "https://in.bmscdn.com/m6/images/common-modules/regions/hyd.png",
        },
        {
            name: "Ahmedabad",
            image: "https://in.bmscdn.com/m6/images/common-modules/regions/ahd.png",
        },
        {
            name: "Chandigarh",
            image: "https://in.bmscdn.com/m6/images/common-modules/regions/chd.png",
        },
        {
            name: "Chennai",
            image: "https://in.bmscdn.com/m6/images/common-modules/regions/chen.png",
        },
        {
            name: "Pune",
            image: "https://in.bmscdn.com/m6/images/common-modules/regions/pune.png",
        },
        {
            name: "Kolkata",
            image: "https://in.bmscdn.com/m6/images/common-modules/regions/kolk.png",
        },
        {
            name: "Kochi",
            image: "https://in.bmscdn.com/m6/images/common-modules/regions/koch.png",
        },
    ];

    const StarRating = ({ value }) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`text-xl ${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const internationalCities = [
        { name: "Nagpur" },
        { name: "Bhopal" },
        { name: "Agartala" },
        { name: "Ludhiana" },
        { name: "Gwalior" },
        { name: "Kanpur" },
        { name: "Lucknow" },
        { name: "Dispur" },
        { name: "Srinagar" },
        { name: "Daman" },
        { name: "Gandhinagar" },
        { name: "Vadorara" },
        { name: "Jaipur" },
        { name: "Jodhpur" },
        // Add more international cities here
    ];

    const allCities = [...cities, ...internationalCities];

    return (
        <>
            <div className="landing">
                <div className="landing__search-container" style={{
                    marginTop: "5rem",
                }}>
                    <input
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type="text"
                        className="landing__search-input"
                        placeholder="Search Destination/Hotel"
                    />
                    <Link to={`/search`}>
                        <button
                            className="landing__search-button"
                            onClick={() => {
                                dispatch(setSearch(searchTerm));
                            }}
                            style={{
                                padding: window.innerWidth < 768 ? "0.45rem 0.75rem" : "",
                            }}
                        >
                            Search
                        </button>
                    </Link>
                </div>
                <div className="landing__hero">
                    <div className="landing__city-container">
                        <div className="landing__city-grid">
                            {cities.map((city, index) => (
                                <div key={index} className="landing__city-item" onClick={() => {
                                    dispatch(setSearch(city.name));
                                    navigate("/search");
                                }}>
                                    <img
                                        src={city.image}
                                        alt={city.name}
                                        className="landing__city-image m-auto"
                                    />
                                    <p className="landing__city-name">
                                        {city.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button
                            className="landing__view-all-cities"
                            onClick={toggleShowAllCities}
                        >
                            View All Cities
                        </button>
                    </div>
                </div>
                <div className="landing__grid-container">
                    <div className="landing__grid">
                        {hotels.map((hotel) => {
                            return (
                                <div
                                    key={hotel._id}
                                    className="landing__grid-item"
                                    onClick={() => navigate(`/hotel/${hotel._id}`)}
                                >
                                    <img
                                        src={hotel.images[0]}
                                        alt={hotel.title}
                                        className="landing__grid-item-image"
                                    />
                                    <div className="landing__grid-item-content flex flex-col gap-1">
                                        <div className="flex justify-between items-center">
                                            <div className="text-lg font-bold">{hotel.title}</div>
                                            <StarRating value={hotel.rating} />
                                        </div>
                                        <div className="text-left">
                                            ₹ {typeof hotel.price === 'number' ? hotel.price.toLocaleString('en-IN') : "N/A"}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {showAllCities && (
                <div className="landing__modal">
                    <div className="landing__modal-content">
                        <span
                            className="landing__modal-close"
                            onClick={toggleShowAllCities}
                        >
                            &times;
                        </span>
                        <div className="landing__modal-grid">
                            {allCities.map((city, index) => (
                                <div key={index} className="landing__city-item" onClick={() => {
                                    dispatch(setSearch(city.name));
                                    navigate("/search");
                                }}>
                                    <p className="landing__city-name">
                                        {city.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Landing;
