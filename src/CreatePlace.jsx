import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaWifi,
  FaSnowflake,
  FaParking,
  FaTv,
  FaUtensils,
  FaTshirt,
} from "react-icons/fa";
import randomImage from "./assets/random.jpg";

const bookings = [
  {
    id: 1,
    images: [randomImage, randomImage, randomImage],
    description: "Beautiful beach house",
    guests: 4,
    availableFrom: new Date(),
    availableTo: new Date(),
    wifi: true,
    ac: true,
    parking: false,
    tv: true,
    kitchen: true,
    laundry: false,
    address: "123 Beach Ave",
    price: 900,
  },
  {
    id: 1,
    images: [randomImage, randomImage, randomImage],
    description: "Beautiful beach house",
    guests: 4,
    availableFrom: new Date(),
    availableTo: new Date(),
    wifi: true,
    ac: true,
    parking: false,
    tv: true,
    kitchen: true,
    laundry: false,
    address: "123 Beach Ave",
    price: 900,
  },
  {
    id: 1,
    images: [randomImage, randomImage, randomImage],
    description: "Beautiful beach house",
    guests: 4,
    availableFrom: new Date(),
    availableTo: new Date(),
    wifi: true,
    ac: true,
    parking: false,
    tv: true,
    kitchen: true,
    laundry: false,
    address: "123 Beach Ave",
    price: 900,
  },
];

const CreateBooking = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);

  const handleCardClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleClosePopup = () => {
    setSelectedBooking(null);
    setIsCreateBookingOpen(false);
  };

  const handleDetailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedBooking({
      ...selectedBooking,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    alert("Booking updated/created");
    handleClosePopup();
  };

  const handleCreateBooking = () => {
    setIsCreateBookingOpen(true);
    setSelectedBooking({
      id: Date.now(),
      images: [],
      description: "",
      guests: 1,
      availableFrom: new Date(),
      availableTo: new Date(),
      wifi: false,
      ac: false,
      parking: false,
      tv: false,
      kitchen: false,
      laundry: false,
      address: "",
      price: 0,
    });
  };
  const handleImageChange = (e) => {
    const newImage = URL.createObjectURL(e.target.files[0]);
    const updatedImages = [...selectedBooking.images, newImage];
    setSelectedBooking({ ...selectedBooking, images: updatedImages });
  };

  const triggerFileUpload = () => {
    document.getElementById("imageUploadInput").click();
  };

  return (
    <Container>
      <Title>My Created Places</Title>
      <CreateButton onClick={handleCreateBooking}>Create a Place</CreateButton>
      <ScrollableContainer>
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            onClick={() => handleCardClick(booking)}
          >
            <Image src={booking.images[0] || randomImage} alt="Booking" />
            <Description>
              <p>{booking.description}</p>
              <p>Guests: {booking.guests}</p>
              <p>Address: {booking.address}</p>
              <p>Price: ₹{booking.price}</p>
            </Description>
          </BookingCard>
        ))}
      </ScrollableContainer>
      {(selectedBooking || isCreateBookingOpen) && (
        <PopupOverlay>
          <Popup>
            <CloseButton onClick={handleClosePopup}>✖</CloseButton>
            <ScrollablePopupContent>
              <ImageUploadContainer>
                {selectedBooking.images.map((image, index) => (
                  <ImageUpload key={index}>
                    <ImageInput
                      type="file"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                    {image && (
                      <PopupImage src={image} alt={`Booking ${index + 1}`} />
                    )}
                  </ImageUpload>
                ))}
                {selectedBooking.images.length < 5 && (
                  <AddImageButton onClick={triggerFileUpload}>
                    Add Image
                  </AddImageButton>
                )}
                <ImageInput
                  id="imageUploadInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </ImageUploadContainer>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={selectedBooking.description}
                onChange={handleDetailChange}
              />
              <Label>Guests</Label>
              <Input
                type="number"
                name="guests"
                value={selectedBooking.guests}
                onChange={handleDetailChange}
              />
              <Label>Price: (in INR)</Label>
              <Input
                type="number"
                name="price"
                value={selectedBooking.price}
                onChange={handleDetailChange}
              />
              <Label>Available From</Label>
              <DatePicker
                selected={new Date(selectedBooking.availableFrom)}
                onChange={(date) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    availableFrom: date,
                  })
                }
              />
              <Label>Available To</Label>
              <DatePicker
                selected={new Date(selectedBooking.availableTo)}
                onChange={(date) =>
                  setSelectedBooking({ ...selectedBooking, availableTo: date })
                }
              />
              <Label>Address</Label>
              <Input
                type="text"
                name="address"
                value={selectedBooking.address}
                onChange={handleDetailChange}
              />
              <CheckboxContainer>
                <CheckboxLabel checked={selectedBooking.wifi}>
                  <HiddenCheckbox
                    name="wifi"
                    checked={selectedBooking.wifi}
                    onChange={handleDetailChange}
                  />
                  <FaWifi size={24} />
                  WiFi
                </CheckboxLabel>
                <CheckboxLabel checked={selectedBooking.ac}>
                  <HiddenCheckbox
                    name="ac"
                    checked={selectedBooking.ac}
                    onChange={handleDetailChange}
                  />
                  <FaSnowflake size={24} />
                  AC
                </CheckboxLabel>
                <CheckboxLabel checked={selectedBooking.parking}>
                  <HiddenCheckbox
                    name="parking"
                    checked={selectedBooking.parking}
                    onChange={handleDetailChange}
                  />
                  <FaParking size={24} />
                  Parking
                </CheckboxLabel>
                <CheckboxLabel checked={selectedBooking.tv}>
                  <HiddenCheckbox
                    name="tv"
                    checked={selectedBooking.tv}
                    onChange={handleDetailChange}
                  />
                  <FaTv size={24} />
                  TV
                </CheckboxLabel>
                <CheckboxLabel checked={selectedBooking.kitchen}>
                  <HiddenCheckbox
                    name="kitchen"
                    checked={selectedBooking.kitchen}
                    onChange={handleDetailChange}
                  />
                  <FaUtensils size={24} />
                  Kitchen
                </CheckboxLabel>
                <CheckboxLabel checked={selectedBooking.laundry}>
                  <HiddenCheckbox
                    name="laundry"
                    checked={selectedBooking.laundry}
                    onChange={handleDetailChange}
                  />
                  <FaTshirt size={24} />
                  Laundry
                </CheckboxLabel>
              </CheckboxContainer>
              <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
            </ScrollablePopupContent>
          </Popup>
        </PopupOverlay>
      )}
    </Container>
  );
};

export default CreateBooking;

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
    checked ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "0 2px 4px rgba(0, 0, 0, 0.1)"};

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
