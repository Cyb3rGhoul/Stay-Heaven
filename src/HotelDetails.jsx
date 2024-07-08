// src/pages/SinglePage.js (entire file)
import React, { useState } from "react";
import styled from "styled-components";
import {
  FaShareAlt,
  FaWifi,
  FaSnowflake,
  FaCoffee,
  FaParking,
  FaTv,
  FaUtensils,
  FaTshirt,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MaxGuests from "./MaxGuest";


const HotelDetails = () => {
  const [maxGuests, setMaxGuests] = useState(1);
  const [features, setFeatures] = useState({
    wifi: true,
    ac: true,
    breakfast: false,
    parking: true,
    tv: false,
    kitchen: true,
    laundry: true,
  });
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [guestNames, setGuestNames] = useState([""]);
  const [mobileNumber, setMobileNumber] = useState("");

  const handleFeatureChange = (e) => {
    setFeatures({ ...features, [e.target.name]: e.target.checked });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Horizon Tower - Stunning Four Bedroom",
        text: "Check out this property!",
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

const reviews = [
  { user: "User 1", comment: "Great place to stay!", date: "2023-06-01" },
  {
    user: "User 2",
    comment: "Loved the location and amenities.",
    date: "2023-06-10",
  },
  {
    user: "User 3",
    comment: "Very comfortable and clean.",
    date: "2023-06-15",
  },
  {
    user: "User 4",
    comment: "Excellent service and location.",
    date: "2023-06-20",
  },
];

const generateRandomStars = () => {
  const stars = Math.floor(Math.random() * 5) + 1;
  return "★".repeat(stars) + "☆".repeat(5 - stars);
};

const handleAddGuest = () => {
  setGuestNames([...guestNames, ""]);
};

const handleRemoveGuest = (index) => {
  const updatedGuestNames = [...guestNames];
  updatedGuestNames.splice(index, 1);
  setGuestNames(updatedGuestNames);
};

const handleGuestNameChange = (index, value) => {
  const newGuestNames = [...guestNames];
  newGuestNames[index] = value;
  setGuestNames(newGuestNames);
};

const handlePopupClose = () => {
  setShowPopup(false);
};

const handleBookClick = () => {
  setShowPopup(true);
};

const handlePay = () => {
  // Handle payment logic here
  console.log("Payment processed");
  setShowPopup(false);
};



  return (
    <>
      <Wrapper>
        <TitleSection>
          <PropertyName>Horizon Tower - Stunning Four Bedroom</PropertyName>
          <ActionButtons>
            <ShareButton onClick={handleShare}>
              <FaShareAlt />
            </ShareButton>
          </ActionButtons>
        </TitleSection>
        <GalleryContainer>
          <MainImage>
            <img src="https://via.placeholder.com/800x600" alt="Gallery 1" />
          </MainImage>
          <SmallImages>
            <img src="https://via.placeholder.com/400x300" alt="Gallery 2" />
            <img src="https://via.placeholder.com/400x300" alt="Gallery 3" />
            <img src="https://via.placeholder.com/400x300" alt="Gallery 4" />
            <img src="https://via.placeholder.com/400x300" alt="Gallery 5" />
          </SmallImages>
        </GalleryContainer>
        <Details>
          <Left>
            <GuestReviews>
              <GuestFavourite>Guest favourite</GuestFavourite>
              <Rating>4.93 ★★★★☆</Rating>
              <ReviewCount>29 Reviews</ReviewCount>
            </GuestReviews>
            <HostInfo>
              <HostName>Hosted by Vacationer</HostName>
              <Superhost>Superhost - 2 years hosting</Superhost>
            </HostInfo>
            <Features>
              <CheckboxContainer>
                <CheckboxLabel checked={features.wifi}>
                  <HiddenCheckbox
                    name="wifi"
                    checked={features.wifi}
                    onChange={handleFeatureChange}
                  />
                  <FaWifi size={24} />
                  WiFi
                </CheckboxLabel>
                <CheckboxLabel checked={features.ac}>
                  <HiddenCheckbox
                    name="ac"
                    checked={features.ac}
                    onChange={handleFeatureChange}
                  />
                  <FaSnowflake size={24} />
                  AC
                </CheckboxLabel>
                <CheckboxLabel checked={features.breakfast}>
                  <HiddenCheckbox
                    name="breakfast"
                    checked={features.breakfast}
                    onChange={handleFeatureChange}
                  />
                  <FaCoffee size={24} />
                  Breakfast
                </CheckboxLabel>
                <CheckboxLabel checked={features.parking}>
                  <HiddenCheckbox
                    name="parking"
                    checked={features.parking}
                    onChange={handleFeatureChange}
                  />
                  <FaParking size={24} />
                  Parking
                </CheckboxLabel>
                <CheckboxLabel checked={features.tv}>
                  <HiddenCheckbox
                    name="tv"
                    checked={features.tv}
                    onChange={handleFeatureChange}
                  />
                  <FaTv size={24} />
                  TV
                </CheckboxLabel>
                <CheckboxLabel checked={features.kitchen}>
                  <HiddenCheckbox
                    name="kitchen"
                    checked={features.kitchen}
                    onChange={handleFeatureChange}
                  />
                  <FaUtensils size={24} />
                  Kitchen
                </CheckboxLabel>
                <CheckboxLabel checked={features.laundry}>
                  <HiddenCheckbox
                    name="laundry"
                    checked={features.laundry}
                    onChange={handleFeatureChange}
                  />
                  <FaTshirt size={24} />
                  Laundry
                </CheckboxLabel>
              </CheckboxContainer>
            </Features>

            <Description>
              <p>
                Stunning newly upgraded four-bedroom apartment centrally located
                in the Dubai Marina. With immaculate finishes, stylish
                furnishings, artistic touches throughout, and hotel-grade
                amenities - this apartment offers everything Vacationer guests
                need and more! Only a 15-minute walk to JBR Beach, spend your
                days relaxing with your toes in the sand or dining at the
                restaurants nearby. Vacationer guests are also minutes away...
              </p>
            </Description>
            <Address>
              <p>Address: 1234 City Center, Country</p>
            </Address>
          </Left>
          <Right>
            <PriceSection>
              <p>
                <DiscountedPrice>₹19,293</DiscountedPrice> per night
              </p>
              <MaxGuests maxGuests={maxGuests} setMaxGuests={setMaxGuests} />
              <button onClick={handleBookClick}>Reserve</button>
              {showPopup && (
                <PopupOverlay onClick={handlePopupClose}>
                  <PopupContent onClick={(e) => e.stopPropagation()}>
                    <PopupHeader>
                      <h2>Booking Details</h2>
                      <CloseButton onClick={handlePopupClose}>×</CloseButton>
                    </PopupHeader>
                    <Form>
                      {guestNames.map((guest, index) => (
                        <GuestDetails key={index}>
                          <FormItem>
                            <label>Guest {index + 1} First Name:</label>
                            <input
                              type="text"
                              value={guest.firstName}
                              onChange={(e) =>
                                handleGuestNameChange(
                                  index,
                                  "firstName",
                                  e.target.value
                                )
                              }
                            />
                          </FormItem>
                          <FormItem>
                            <label>Guest {index + 1} Last Name:</label>
                            <input
                              type="text"
                              value={guest.lastName}
                              onChange={(e) =>
                                handleGuestNameChange(
                                  index,
                                  "lastName",
                                  e.target.value
                                )
                              }
                            />
                          </FormItem>
                          <FormItem>
                            <label>Guest {index + 1} Phone Number:</label>
                            <input
                              type="text"
                              value={guest.phoneNumber}
                              onChange={(e) =>
                                handleGuestNameChange(
                                  index,
                                  "phoneNumber",
                                  e.target.value
                                )
                              }
                            />
                          </FormItem>
                          <RemoveGuestButton
                            type="button"
                            onClick={() => handleRemoveGuest(index)}
                          >
                            Remove Guest
                          </RemoveGuestButton>
                        </GuestDetails>
                      ))}
                      <AddGuestButton type="button" onClick={handleAddGuest}>
                        Add Guest
                      </AddGuestButton>
                      <FormItem>
                        <label>Check-In Date:</label>
                        <DatePicker
                          selected={checkInDate}
                          onChange={(date) => setCheckInDate(date)}
                          placeholderText="Check-In"
                        />
                      </FormItem>
                      <FormItem>
                        <label>Check-Out Date:</label>
                        <DatePicker
                          selected={checkOutDate}
                          onChange={(date) => setCheckOutDate(date)}
                          placeholderText="Check-Out"
                        />
                      </FormItem>
                      <FormItem>
                        <label>Mobile Number:</label>
                        <input
                          type="text"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                        />
                      </FormItem>
                      <FormItem>
                        <label>Final Price:</label>
                        <p>₹19999</p>
                      </FormItem>
                      <PayButton type="button" onClick={handlePay}>
                        Pay
                      </PayButton>
                    </Form>
                  </PopupContent>
                </PopupOverlay>
              )}
            </PriceSection>
          </Right>
        </Details>
        <ReviewsContainer>
          <Reviews>
            {reviews.map((review, index) => (
              <Review key={index}>
                <Avatar
                  src={`https://via.placeholder.com/50?text=User${index + 1}`}
                  alt={`User ${index + 1}`}
                />
                <Comment>
                  <ReviewHeader>
                    <strong>{review.user}</strong>
                    <ReviewDate>{review.date}</ReviewDate>
                  </ReviewHeader>
                  <p>{generateRandomStars()}</p>
                  <p>{review.comment}</p>
                </Comment>
              </Review>
            ))}
          </Reviews>
        </ReviewsContainer>
      </Wrapper>
    </>
  );
};

export default HotelDetails;

const Wrapper = styled.div`
  background-color: #f4f4f9;
  color: #333;
  min-height: 100vh;
  padding: 20px;
  font-family: "Arial", sans-serif;
`;

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PropertyName = styled.h1`
  font-size: 28px;
  font-family: "Helvetica Neue", sans-serif;
  color: #333;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ShareButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 24px;
  cursor: pointer;

  &:hover {
    color: #666;
  }
`;

const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 10px;
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
`;

const MainImage = styled.div`
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
`;

const SmallImages = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Left = styled.div`
  flex: 2;
  margin-right: 20px;

  & > * {
    margin-bottom: 20px;
  }
`;

const GuestReviews = styled.div`
  display: flex;
  justify-content: space-between;
`;

const GuestFavourite = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const Rating = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-top: 5px;
  color: #ffb300;
`;

const ReviewCount = styled.div`
  font-size: 14px;
  margin-top: 5px;
  color: #666;
`;

const HostInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HostName = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const Superhost = styled.div`
  font-size: 14px;
  color: #ff6347;
  margin-top: 5px;
`;


const Features = styled.div`
  display: flex;
  justify-content: space-between;

  label {
    font-size: 18px;
    color: #333;

    input {
      margin-right: 5px;
    }
  }
`;
const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
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
    checked ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "0 2px 4px rgba(0, 0, 0, 0.1)"};

  &:hover {
    border-color: #04af70;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  display: none;
`;


const Description = styled.div`
  font-size: 18px;
  color: #333;
`;

const Address = styled.div`
  font-size: 18px;
  color: #333;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PriceSection = styled.div`
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  p {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
    color: #333;
  }

  button {
    padding: 5px 10px;
    background-color: #4caf50;
    border: 1px solid #4caf50;
    border-radius: 5px;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 18px;

    &:hover {
      background-color: #04af70;
      border: 1px solid #04af70;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
  }
`;

const DiscountedPrice = styled.span`
  color: #e57373;
`;

const DatePickers = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-direction: column;

  .react-datepicker-wrapper {
    display: inline-block;
    width: auto;
  }

  input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    color: #333;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;


const ReviewsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
`;

const Reviews = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  background-color: #f9f9f9;
  padding: 20px;
  border: 2px solid #ddd;
  border-radius: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const Review = styled.div`
  display: flex;
  width: calc(50% - 20px);
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #f1f1f1;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;


const Avatar = styled.img`
  border-radius: 50%;
  height: 80px;
  margin-right: 10px;
`;

const Comment = styled.div`
  p {
    margin: 0;
    color: #333;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReviewDate = styled.span`
  font-size: 12px;
  color: #999;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 70vw;
  max-height: 70vh;
  overflow-y: auto;
  width: 100%;
`;
const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: #ff6347;
  border: none;
  color: white;
  font-size: 1.5em;
  cursor: pointer;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: #e5533d;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
`;

const GuestDetails = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  label {
    font-weight: bold;
  }
  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
`;

const AddGuestButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 1em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const PayButton = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  align-self: center;

  &:hover {
    background-color: #0056b3;
  }
`;

const RemoveGuestButton = styled.button`
  margin-top: 20px;
  padding: 5px 10px;
  font-size: 0.9em;
  background-color: #ff6347;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  align-self: center;

  &:hover {
    background-color: #e5533d;
  }
`;