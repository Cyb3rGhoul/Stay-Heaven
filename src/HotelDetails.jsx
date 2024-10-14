// src/pages/SinglePage.js (entire file)
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    FaShareAlt,
    FaWifi,
    FaSnowflake,
    FaCoffee,
    FaParking,
    FaUtensils,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CgGym } from "react-icons/cg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import axios from "./utils/axios";
import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";
import "./HotelDetails.css";


const HotelDetails = () => {
    const { id } = useParams();
    const hotelId = id;
    const [user, setUser] = useState(useSelector((state) => state.user.userData));
    const [features, setFeatures] = useState({
        wifi: false,
        ac: false,
        breakfast: false,
        parking: false,
        kitchen: false,
        gym: false,
    });
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [guestNames, setGuestNames] = useState([{}]);
    const [reviews, setReviews] = useState([]);
    const [hotel, setHotel] = useState({});
    const [comment, setComment] = useState({
        message: "",
        rating: 0,
    });
    const [hotelRating, setHotelRating] = useState(0);
    const [rooms, setRooms] = useState(0);
    const [amount, setAmount] = useState(0);

    const [totalDays, setTotalDays] = useState(0);
    useEffect(() => {
        setRooms(Math.ceil(guestNames.length / hotel.maxGuests));
        let days = getDifferenceInDays(
            new Date(checkInDate),
            new Date(checkOutDate)
        );
        if (days == 0) days = 1;
        setTotalDays(days);
        setAmount(rooms * hotel.price * days);
    }, [guestNames, checkInDate, checkOutDate]);

    const getHotelRatings = () => {
        let len = reviews.length;
        let total = 0;
        for (let i = 0; i < len; i++) {
            total += reviews[i].rating;
        }
        setHotelRating(total / len);
    };

    function getDifferenceInDays(date1, date2) {
        const dateObj1 = new Date(date1);
        const dateObj2 = new Date(date2);

        const diffInMs = Math.abs(dateObj2 - dateObj1);

        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        return diffInDays;
    }

    useEffect(() => {
        getHotelRatings();
    }, [reviews]);

    const handleDeleteReview = (id) => {
        return async () => {
            try {
                await axios.post(
                    `/comment/delete/${id}`,
                    { hotelId },
                    { withCredentials: true }
                );
                setReviews((reviews) =>
                    reviews.filter((review) => review._id !== id)
                );
            } catch (error) {
                console.log(error);
            }
        };
    };
    const commentHandler = async () => {
        try {
            const response = await axios.post(
                `/comment/create/${id}`,
                comment,
                { withCredentials: true }
            );
            setReviews((reviews) => [...reviews, response.data.data]);
            setComment({ message: "", rating: 0 });
        } catch (error) {
            console.log(error);
        }
    };
    const getHotelDetails = async () => {
        try {
            const response = await axios.get(`/hotel/${id}`);
            features.gym = response.data.data.hotel.facilities.includes("gym");
            features.wifi =
                response.data.data.hotel.facilities.includes("wifi");
            features.ac = response.data.data.hotel.facilities.includes("ac");
            features.breakfast =
                response.data.data.hotel.facilities.includes("breakfast");
            features.parking =
                response.data.data.hotel.facilities.includes("parking");
            features.kitchen =
                response.data.data.hotel.facilities.includes("kitchen");
            setHotel(response.data.data.hotel);
            setReviews(response.data.data.hotel.comments);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getHotelDetails();
    }, []);

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

    const handleAddGuest = () => {
        setGuestNames([...guestNames, ""]);
    };

    const handleRemoveGuest = (index) => {
        setGuestNames((guestNames) => guestNames.filter((_, i) => i !== index));
    };

    const handleGuestNameChange = (index, name, value) => {
        setGuestNames((prevGuestNames) => {
            const updatedGuestNames = [...prevGuestNames];

            updatedGuestNames[index] = {
                ...updatedGuestNames[index],
                [name]: value,
            };

            return updatedGuestNames;
        });
    };

    const handlePopupClose = () => {
        setShowPopup(false);
    };

    const handleBookClick = () => {
        setShowPopup(true);
    };

    const handlePay = async () => {
        if (checkInDate === null || checkOutDate === null) {
            alert("Please fill all the required fields");
            return;
        }

        for (let i = 0; i < guestNames.length; i++) {
            if (Object.keys(guestNames[i]).length !== 3) {
                alert("Please fill all the required fields");
                return;
            }
        }
        setShowPopup(false);

        try {


            const { data: { data: { order } } } = await axios.post(
                `/payment/checkout`,
                {
                    rooms,
                    days: totalDays,
                    hotelId,
                },
                { withCredentials: true }
            );
            const { data: { data: { key } } } = await axios.post(`/payment/getkey`, { userId: user._id, guestNames, checkInDate, checkOutDate },
                { withCredentials: true });

            var options = {
                key,
                amount: order.amount,
                currency: "INR",
                name: "Stay Heaven",
                image: "https://res.cloudinary.com/djsdjtkyu/image/upload/v1725702771/cuktnsvqx7fstqfsxb4p.png",
                order_id: order.id,
                callback_url: import.meta.env.VITE_BACKEND_URL + "/payment/paymentverification",
                prefill: {
                    "name": user.fullName,
                    "email": user.email,
                    "contact": user.phoneNumber
                },

                theme: {
                    "color": "#4CAF50"
                }

            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        }
        catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <div className="hotelPage" id="hotelPage">
                <Wrapper>
                    <div>
                        <TitleSection>
                            <PropertyName style={{
                                fontFamily: "Josefin Sans, sans-serif",
                                fontOpticalSizing: "auto",
                                fontWeight: 800,
                                fontStyle: "normal",
                                marginTop: "10px",
                            }}>
                                {hotel.title}
                            </PropertyName>
                            <ActionButtons>
                                <ShareButton onClick={handleShare}>
                                    <FaShareAlt />
                                </ShareButton>
                            </ActionButtons>
                        </TitleSection>
                        <GalleryContainer>
                            <MainImage>
                                <img
                                    src={
                                        hotel.images?.length > 0
                                            ? hotel.images[0]
                                            : "https://via.placeholder.com/800x600"
                                    }
                                    alt="Gallery 1"
                                />
                            </MainImage>
                            <SmallImages>
                                <img
                                    src={
                                        hotel.images?.length > 1
                                            ? hotel.images[1]
                                            : "https://via.placeholder.com/400x300"
                                    }
                                    alt="Gallery 2"
                                />
                                <img
                                    src={
                                        hotel.images?.length > 2
                                            ? hotel.images[2]
                                            : "https://via.placeholder.com/400x300"
                                    }
                                    alt="Gallery 3"
                                />
                                <img
                                    src={
                                        hotel.images?.length > 3
                                            ? hotel.images[3]
                                            : "https://via.placeholder.com/400x300"
                                    }
                                    alt="Gallery 4"
                                />
                                <img
                                    src={
                                        hotel.images?.length > 4
                                            ? hotel.images[4]
                                            : "https://via.placeholder.com/400x300"
                                    }
                                    alt="Gallery 5"
                                />
                            </SmallImages>
                        </GalleryContainer>
                        <Details>
                            <Left>
                                <GuestReviews>
                                    <GuestFavourite>Guest favourite</GuestFavourite>
                                    <RatingWrapper>
                                        <RatingValue>{hotelRating || 0}</RatingValue>
                                        <StyledRating
                                            name="half-rating"
                                            precision={0.5}
                                            value={hotelRating}
                                            readOnly
                                        />
                                    </RatingWrapper>
                                    <ReviewCount>{reviews.length} Reviews</ReviewCount>
                                </GuestReviews>

                                <Features>
                                    <CheckboxContainer>
                                        {features.wifi && (
                                            <CheckboxLabel checked={features.wifi}>
                                                <IconWrapper>
                                                    <FaWifi size={24} />
                                                </IconWrapper>
                                                WiFi
                                            </CheckboxLabel>
                                        )}
                                        {features.ac && (
                                            <CheckboxLabel checked={features.ac}>
                                                <IconWrapper>
                                                    <FaSnowflake size={24} />
                                                </IconWrapper>
                                                AC
                                            </CheckboxLabel>
                                        )}
                                        {features.breakfast && (
                                            <CheckboxLabel checked={features.breakfast}>
                                                <IconWrapper>
                                                    <FaCoffee size={24} />
                                                </IconWrapper>
                                                Breakfast
                                            </CheckboxLabel>
                                        )}
                                        {features.parking && (
                                            <CheckboxLabel checked={features.parking}>
                                                <IconWrapper>
                                                    <FaParking size={24} />
                                                </IconWrapper>
                                                Parking
                                            </CheckboxLabel>
                                        )}
                                        {features.kitchen && (
                                            <CheckboxLabel checked={features.kitchen}>
                                                <IconWrapper>
                                                    <FaUtensils size={24} />
                                                </IconWrapper>
                                                Kitchen
                                            </CheckboxLabel>
                                        )}
                                        {features.gym && (
                                            <CheckboxLabel checked={features.gym}>
                                                <IconWrapper>
                                                    <CgGym size={36} />
                                                </IconWrapper>
                                                Gym
                                            </CheckboxLabel>
                                        )}
                                    </CheckboxContainer>
                                </Features>

                                <Description>
                                    <p>Description: {hotel.description}</p>
                                </Description>
                                <Address>
                                    <p>Address: {hotel.address}</p>
                                </Address>
                                <City>
                                    <p>City: Koi toh</p>
                                </City>
                                <State>
                                    <p>State: Kahi dur</p>
                                </State>

                            </Left>
                            <Right>
                                <PriceSection>
                                    <p>
                                        <DiscountedPrice>
                                            ₹ {typeof hotel.price === 'number' ? hotel.price.toLocaleString('en-IN') : "N/A"}
                                        </DiscountedPrice>{" "}
                                        per night
                                    </p>

                                    <p>Max guest per room : {hotel.maxGuests}</p>
                                    <button onClick={handleBookClick}>Reserve</button>
                                    {showPopup && (
                                        <PopupOverlay onClick={handlePopupClose}>
                                            <PopupContent
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <PopupHeader>
                                                    <h2>Booking Details</h2>
                                                    <CloseButton
                                                        onClick={handlePopupClose}
                                                    >
                                                        ×
                                                    </CloseButton>
                                                </PopupHeader>
                                                <Form>
                                                    {guestNames.map((guest, index) => (
                                                        <GuestDetails key={index}>
                                                            <FormItem>
                                                                <label>
                                                                    Guest {index + 1}{" "}
                                                                    First Name:
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        guest.firstName
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleGuestNameChange(
                                                                            index,
                                                                            "firstName",
                                                                            e.target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </FormItem>
                                                            <FormItem>
                                                                <label>
                                                                    Guest {index + 1}{" "}
                                                                    Last Name:
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        guest.lastName
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleGuestNameChange(
                                                                            index,
                                                                            "lastName",
                                                                            e.target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </FormItem>
                                                            <FormItem>
                                                                <label>
                                                                    Guest {index + 1}{" "}
                                                                    Phone Number:
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        guest.phoneNumber
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleGuestNameChange(
                                                                            index,
                                                                            "phoneNumber",
                                                                            e.target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </FormItem>
                                                            {guestNames.length > 1 && (
                                                                <RemoveGuestButton
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRemoveGuest(
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    Remove Guest
                                                                </RemoveGuestButton>
                                                            )}
                                                        </GuestDetails>
                                                    ))}
                                                    <AddGuestButton
                                                        type="button"
                                                        onClick={handleAddGuest}
                                                    >
                                                        Add Guest
                                                    </AddGuestButton>
                                                    <div className="flex flex-row">
                                                        <FormItem>
                                                            <label>
                                                                Check-In Date:
                                                            </label>
                                                            <DatePicker
                                                                selected={checkInDate}
                                                                onChange={(date) =>
                                                                    setCheckInDate(date)
                                                                }
                                                                placeholderText="Check-In"
                                                            />
                                                        </FormItem>
                                                        <div className="w-5"></div>
                                                        <FormItem>
                                                            <label>
                                                                Check-Out Date:
                                                            </label>
                                                            <DatePicker
                                                                selected={checkOutDate}
                                                                onChange={(date) => {
                                                                    setCheckOutDate(
                                                                        date
                                                                    );
                                                                }}
                                                                placeholderText="Check-Out"
                                                            />
                                                        </FormItem>
                                                    </div>
                                                    <FormItem className="self-center">
                                                        <label>Rooms:</label>
                                                        <p>{rooms || 0}</p>
                                                    </FormItem>
                                                    <FormItem className="self-center">
                                                        <label>Final Price:</label>
                                                        <p>₹ {amount || 0}</p>
                                                    </FormItem>
                                                    <PayButton
                                                        type="button"
                                                        onClick={handlePay}
                                                    >
                                                        Pay
                                                    </PayButton>
                                                </Form>
                                            </PopupContent>
                                        </PopupOverlay>
                                    )}
                                </PriceSection>
                            </Right>
                        </Details>
                        <div className="comment-section flex flex-col gap-6 mx-auto max-w-4xl p-6 bg-gray-50 rounded-lg shadow-lg">
                            <div className="comment-box flex flex-col md:flex-row gap-4 items-start">
                                <div className="rating-component flex-shrink-0">
                                    <Rating
                                        name="half-rating"
                                        defaultValue={0}
                                        precision={0.5}
                                        onChange={(e) => setComment({ ...comment, rating: e.target.value })}
                                        value={comment.rating}
                                        size="large"
                                    />
                                </div>
                                <input
                                    className="comment-input w-full md:flex-grow border-2 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-gray-700"
                                    type="text"
                                    onChange={(e) => setComment({ ...comment, message: e.target.value })}
                                    value={comment.message}
                                    placeholder="Share your thoughts..."
                                />
                                <button
                                    onClick={commentHandler}
                                    className="add-comment-btn text-white bg-green-500 px-6 py-3 rounded-md hover:bg-green-600 transition-all font-semibold shadow-md hover:shadow-lg"
                                >
                                    Post
                                </button>
                            </div>
                            <div className="reviews-container space-y-4">
                                {reviews?.map((review, index) => (
                                    <div key={index} className="review-box flex items-start gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
                                        <Avatar src={review.user.avatar} className="w-18 h-8 rounded-full" />
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center mb-2">
                                                <strong className="text-lg text-gray-800">{review.user.username}</strong>
                                                <Rating
                                                    name="half-rating-read"
                                                    className="read-only-rating"
                                                    defaultValue={0}
                                                    precision={0.5}
                                                    value={review.rating}
                                                    readOnly
                                                    size="small"
                                                />
                                            </div>
                                            <p className="comment-text text-gray-600 mb-2">{review.message}</p>
                                            {user && user._id === review.user._id && (
                                                <button
                                                    onClick={() => handleDeleteReview(review._id)()}
                                                    className="text-red-500 hover:text-red-700 transition-colors focus:outline-none"
                                                >
                                                    <MdDelete size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Wrapper >
            </div >
        </>
    );
};

export default HotelDetails;

const Wrapper = styled.div`
    color: #333;
    min-height: 100vh;
    padding: 20px;
`;

const TitleSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 60px;
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
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const GuestFavourite = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: #333;

    @media (max-width: 768px) {
        font-size: 14px;
    }
`;

const RatingWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 7px;

    @media (max-width: 768px) {
        gap: 5px;
    }
`;

const RatingValue = styled.div`
    font-size: 18px;
    color: #333;

    @media (max-width: 768px) {
        font-size: 16px;
    }
`;

const ReviewCount = styled.div`
    font-size: 14px;
    color: #666;

    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const StyledRating = styled(Rating)`
    .MuiRating-icon {
        font-size: 1.2rem;
    }

    @media (max-width: 768px) {
        .MuiRating-icon {
            font-size: 1rem;
        }
    }
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


     @media (max-width: 768px) {
        label {
        font-size: 10px;
        }
    }
`;
const CheckboxContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;

    @media (max-width: 768px) {
        gap: 5px;
    }
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
    height: 100px;
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

    @media (max-width: 768px) {
        width: 80px;
        height: 80px;
        padding: 5px;
        font-size: 0.1rem;
    }

    @media (max-width: 480px) {
        width: 60px;
        height: 60px;
        padding: 3px;
        font-size: 0.1rem;
    }
`;

const IconWrapper = styled.div`
    margin: 5px;

    @media (max-width: 768px) {
        margin: 3px 0;
    }

    @media (max-width: 480px) {
        margin-bottom: 2px;
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

const City = styled.div`
    font-size: 18px;
    color: #333;
`;

const State = styled.div`
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
    padding: 20px;

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
    z-index: 10;
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
    max-width: 60vw;
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
    background: #fff !important;
    border: none !important;
    color: black !important;
    font-size: 2.5em !important;
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
    width: 21%;
    margin-top: 10px;
    padding: 10px 20px;
    font-size: 1em;
    background-color: #000;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const PayButton = styled.button`
    padding: 10px 20px;
    width: 30%;
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
