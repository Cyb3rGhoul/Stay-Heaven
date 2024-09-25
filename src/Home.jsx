import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import axios from "./utils/axios";
import { useDispatch } from 'react-redux';
import { setSearch } from "./app/reducers/userSlice";
import socket from "./utils/socket";

const Landing = () => {
    const navigate = useNavigate();
    const [showAllCities, setShowAllCities] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();

    const toggleShowAllCities = () => {
        setShowAllCities(!showAllCities);
    };
    const [hotels, setHotels] = useState([]);
    const gethotels = async () => {
        try {
            const response = await axios("/hotel/hotels");
            setHotels(response.data.data.hotels);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        gethotels();

        socket.on('hotel_is_approved', (data) => {
            console.log('New hotel approved:', data);
            setHotels((prev)=> [...prev , data.hotel]);
        });

        return () => {
            socket.off('new-hotel');
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
                        <button className="landing__search-button" onClick={()=>{
                            dispatch(setSearch(searchTerm));
                        }}>
                            Search
                        </button>
                    </Link>
                </div>
                <div className="landing__hero">
                    <div className="landing__city-container">
                        <div className="landing__city-grid">
                            {cities.map((city, index) => (
                                <div key={index} className="landing__city-item" onClick={()=>{
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
                        {hotels.map((hotel) => (
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
                                    <div className="text-lg font-bold">
                                        {hotel.title}
                                    </div>
                                    <div>₹ {hotel.price}</div>
                                </div>
                            </div>
                        ))}
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
                                <div key={index} className="landing__city-item" onClick={()=>{
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
