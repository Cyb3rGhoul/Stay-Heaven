import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import randomImage from "./assets/random.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Rating from "@mui/material/Rating";
import { X } from 'lucide-react';

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
    const handleRatingClick = (booking, index) => {
        const updatedBookings = bookings.map((b) =>
            b.id === booking.id ? { ...b, rating: index + 1 } : b
        );
        // Update the bookings state with updatedBookings (if needed)
        // For now, we directly update the state for the example
        setSelectedBooking({ ...selectedBooking, rating: index + 1 });
    };

    return (
        <Container >
            <Title style={{marginTop: "3em"}}>Previous Bookings</Title>
            <ScrollableContainer>
                {previousBookings.map((booking) => (
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
                        </Description>
                    </BookingCard>
                ))}
            </ScrollableContainer>
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="mt-12  bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative animate-fade-in">
                  {/* Close Button */}
                  <button 
                    onClick={handleClosePopup}
                    className="absolute right-4 top-4 z-10 p-1 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
          
                  {/* Image Section */}
                  <div className="relative w-full h-[300px] sm:h-[400px]">
                    <img
                      src={selectedBooking.hotel.images[0]}
                      alt="Hotel"
                      onClick={handleImageClick}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity duration-200"
                    />
                  </div>
          
                  {/* Content Section */}
                  <div className="p-6 space-y-4">
                    {/* Description */}
                    <h2 className="text-xl font-semibold text-gray-800 leading-tight">
                      {selectedBooking.hotel.description}
                    </h2>
          
                    {/* Guest Information */}
                    <div className="space-y-3 text-gray-600">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-medium">Guests:</span>
                        <span>{selectedBooking.guests
                          .map((guest) => guest.firstName + " " + guest.lastName)
                          .join(", ")}
                        </span>
                      </div>
          
                      {/* Date Information */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-medium">Date:</span>
                        <span>
                          {getDate(selectedBooking.checkin)} to {getDate(selectedBooking.checkout)}
                        </span>
                      </div>
          
                      {/* Price Information */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-medium">Total:</span>
                        <span className="text-green-600 font-semibold">
                          ₹{selectedBooking.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
          
                    {/* Action Button */}
                    <div className="pt-4">
                      <Link to={`/hotel/${selectedBooking.hotel._id}`}>
                        <button className="w-full sm:w-auto px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
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