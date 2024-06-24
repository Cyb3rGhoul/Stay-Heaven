import React, { useState } from "react";
import styled from "styled-components";
import randomImage from "./assets/random.jpg";
import { useNavigate } from "react-router-dom";

const bookings = [
  {
    id: 1,
    image: randomImage,
    description: "Beautiful beach house",
    guests: 4,
    date: "2023-06-21",
    price: 200,
    rating: 4,
    review: "Had a wonderful time!",
  },
  {
    id: 2,
    image: randomImage,
    description: "Beautiful beach house",
    guests: 4,
    date: "2023-06-21",
    price: 200,
    rating: 4,
    review: "Had a wonderful time!",
  },
  {
    id: 3,
    image: randomImage,
    description: "Beautiful beach house",
    guests: 4,
    date: "2023-06-21",
    price: 200,
    rating: 4,
    review: "Had a wonderful time!",
  },
  // Add more booking objects as needed
];

const PreviousBookings = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleClosePopup = () => {
    setSelectedBooking(null);
  };

  const handleImageClick = () => {
    navigate("/hotel");
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
    <Container>
      <Title>Previous Bookings</Title>
      <ScrollableContainer>
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            onClick={() => handleCardClick(booking)}
          >
            <Image src={booking.image} alt="Booking" />
            <Description>
              <p>{booking.description}</p>
              <p>Guests: {booking.guests}</p>
              <p>Date: {booking.date}</p>
              <p>Price: ₹{booking.price}</p>
              <Rating>
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    isFilled={index < booking.rating}
                    onClick={() => handleRatingClick(booking, index)}
                  >
                    ★
                  </Star>
                ))}
              </Rating>
            </Description>
          </BookingCard>
        ))}
      </ScrollableContainer>
      {selectedBooking && (
        <PopupOverlay>
          <Popup>
            <CloseButton onClick={handleClosePopup}>✖</CloseButton>
            <PopupImage
              src={selectedBooking.image}
              alt="Booking"
              onClick={handleImageClick}
            />
            <PopupDescription>
              <h2>{selectedBooking.description}</h2>
              <p>Guests: {selectedBooking.guests}</p>
              <p>Date: {selectedBooking.date}</p>
              <p>Price: ₹{selectedBooking.price}</p>
              <p>Review: {selectedBooking.review}</p>
              <Rating>
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    isFilled={index < selectedBooking.rating}
                    onClick={() => handleRatingClick(selectedBooking, index)}
                  >
                    ★
                  </Star>
                ))}
              </Rating>
            </PopupDescription>
          </Popup>
        </PopupOverlay>
      )}
    </Container>
  );
};

export default PreviousBookings;

const Container = styled.div`
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

const Rating = styled.div`
  display: flex;
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
