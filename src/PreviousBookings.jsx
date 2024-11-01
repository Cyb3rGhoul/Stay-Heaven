import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import randomImage from "./assets/random.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Rating from "@mui/material/Rating";
import socket from "./utils/socket";

const PreviousBookings = () => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const navigate = useNavigate();
    const [previousBookings, setpreviousBookings] = useState(
        useSelector((state) => state.user.userData.previousBookings)
    );
    const handleCardClick = (booking) => {
        setSelectedBooking(booking);
    };

    const handleClosePopup = () => {
        setSelectedBooking(null);
    };

    const handleImageClick = () => {
        navigate("/hotel");
    };

    const getDate = (date) => {
        const specificDate = new Date(date);

        const day = String(specificDate.getDate()).padStart(2, "0"); // Ensures two digits
        const month = String(specificDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
        const year = specificDate.getFullYear();

        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate; // Correctly returning formattedDate
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
    
    const handleRatingClick = (booking, index) => {
        const updatedBookings = booking.map((b) =>
            b.id === booking.id ? { ...b, rating: index + 1 } : b
        );
        setSelectedBooking({ ...selectedBooking, rating: index + 1 });
    };

    useEffect(()=> {
        socket.on("order_is_created", (data) => {
            setpreviousBookings(prev => [...prev, data.order])
        })

        socket.on("order_is_accepted_or_rejected", (data) => {
            setpreviousBookings(prev => prev.map((order) => order.id === data._id? data : order))
        })

        return () => {
            socket.off("order_is_created")
            socket.off("order_is_accepted_or_rejected")
        }
    })
    return (
        <Container >
            <Title style={{marginTop: "3em"}}>Previous Bookings</Title>
            <ScrollableContainer>
                {previousBookings
                .slice()
                .reverse()
                .map((booking) => (
                    <BookingCard
                        key={booking._id}
                        onClick={() => handleCardClick(booking)}
                    >
                        <Image src={booking.hotel.images[0]} alt="Booking" />
                        <Description>
                            <p>{booking.description}</p>
                            <p>Guests: {booking.guests.length}</p>
                            <p>
                                Date: {getDate(booking.checkin)} to{" "}
                                {getDate(booking.checkout)}{" "}
                            </p>
                            <p>Price: ₹{booking.amount}</p>
                            <p>Ordered at: {getTime(booking.createdAt)}</p>
                            <p>Status: {booking.approvalStatus}</p>
                        </Description>
                    </BookingCard>
                ))}
            </ScrollableContainer>
            {selectedBooking && (
                <PopupOverlay>
                    <Popup>
                        <CloseButton onClick={handleClosePopup}>✖</CloseButton>
                        <PopupImage
                            src={selectedBooking.hotel.images[0]}
                            alt="Booking"
                            onClick={handleImageClick}
                        />
                        <PopupDescription>
                            <h2>{selectedBooking.hotel.description}</h2>
                            <p>
                                Guests:{" "}
                                {selectedBooking.guests
                                    .map((guest) => guest.firstName + " " + guest.lastName)     
                                    .join(", ")}
                            </p>
                            <p>
                                {" "}
                                Date: {getDate(selectedBooking.checkin)} to{" "}
                                {getDate(selectedBooking.checkout)}{" "}
                            </p>
                            <p>Total: ₹{selectedBooking.amount}</p>
                            <Link to={`/hotel/${selectedBooking.hotel._id}`}>
                                <button className="bg-green-500 text-white p-2 rounded-md">
                                    More Details
                                </button>
                            </Link>
                        </PopupDescription>
                    </Popup>
                </PopupOverlay>
            )}
        </Container>
    );
};

export default PreviousBookings;

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const Container = styled.div`
    height: 100vh;
    padding: 20px;
    background-color: #f0f0f0;
    color: #333;
`;

const Title = styled.h2`
    color: #2a9d8f;
    margin-bottom: 20px;
    text-align: center;
    font-size: 32px;
    font-weight: bold;
`;

const ScrollableContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const BookingCard = styled.div`
    animation: ${fadeIn} 2.5s ease forwards;
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

const Star = styled.span`
    font-size: 20px;
    cursor: pointer;
    color: ${({ isFilled }) => (isFilled ? "#ffd700" : "#ccc")};
    &:hover {
        color: #ffd700;
    }
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
    height: 90%;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    position: relative;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 0px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
`;

const PopupImage = styled.img`
    width: 100%;
    height: 60%;
    border-radius: 8px;
    cursor: pointer;
    margin: 0 auto;
`;

const PopupDescription = styled.div`
    margin-top: 20px;
    font-size: 16px;
    color: #333;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
