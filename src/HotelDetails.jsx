// src/pages/SinglePage.js (entire file)
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
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
import useHandleErr from "./utils/useHandleErr";
import toast from "react-hot-toast";
import ImageGallery from "./ImageGallery";

const HotelDetails = () => {
    const { id } = useParams();
    const hotelId = id;
    console.log("This is hotel id:", hotelId);
    console.log("This is id: ", id);
    const [user, setUser] = useState(
        useSelector((state) => state.user.userData)
    );
    const handleError = useHandleErr();
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
        if (checkInDate && checkOutDate) {
            setAmount(rooms * hotel.price * days);
        }
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
                handleError(error);
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
            handleError(error);
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
            handleError(error);
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
        setCheckInDate(null);
        setCheckOutDate(null);
        setGuestNames([{}]);
        setRooms(0);
        setAmount(0);
    };

    const handleBookClick = () => {
        if (hotel.owner === user._id)
            toast.error("You can't book your own hotel");
        else setShowPopup(true);
    };

    const handlePay = async (e) => {
        e.preventDefault();
        if (checkInDate === null || checkOutDate === null) {
            toast.error("Please fill all the required fields");
            return;
        }

        for (let i = 0; i < guestNames.length; i++) {
            if (Object.keys(guestNames[i]).length !== 3) {
                toast.error("Please fill all the required fields");
                return;
            }
            if (!/^\d{10}$/.test(guestNames[i].phoneNumber)) {
                toast.error("Phone number should be 10 digits and contain only numbers");
                return;
            }
            if (guestNames[i].firstName.length < 1 || guestNames[i].lastName.length < 1) {
                toast.error("Please fill all the required fields");
                return;
            }
        }
        setShowPopup(false);

        try {
            const {
                data: {
                    data: { order },
                },
            } = await axios.post(
                `/payment/checkout`,
                {
                    rooms,
                    days: totalDays,
                    hotelId,
                },
                { withCredentials: true }
            );
            const {
                data: {
                    data: { key },
                },
            } = await axios.post(
                `/payment/getkey`,
                { userId: user._id, guestNames, checkInDate, checkOutDate },
                { withCredentials: true }
            );

            var options = {
                key,
                amount: order.amount,
                currency: "INR",
                name: "Stay Heaven",
                image: "https://res.cloudinary.com/djsdjtkyu/image/upload/v1725702771/cuktnsvqx7fstqfsxb4p.png",
                order_id: order.id,
                callback_url:
                    import.meta.env.VITE_BACKEND_URL +
                    "/payment/paymentverification",
                prefill: {
                    name: user.fullName,
                    email: user.email,
                    contact: user.phoneNumber,
                },

                theme: {
                    color: "#4CAF50",
                },
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (e) {
            handleError(e);
        }
    };
    const formatPrice = (price) => {
        return price.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
            style: "currency",
            currency: "INR",
        });
    };

    return (
        <>
            <div className="hotelPage" id="hotelPage">
                <Wrapper>
                    <div>
                        <TitleSection>
                            <PropertyName
                                style={{
                                    fontFamily: "Josefin Sans, sans-serif",
                                    fontOpticalSizing: "auto",
                                    fontWeight: 800,
                                    fontStyle: "normal",
                                    marginTop: "10px",
                                }}
                            >
                                {hotel.title}
                            </PropertyName>
                            <ActionButtons>
                                <ShareButton onClick={handleShare}>
                                    <FaShareAlt />
                                </ShareButton>
                            </ActionButtons>
                        </TitleSection>
                        <ImageGallery images={hotel.images} />
                        <Details>
                            <Left>
                                <GuestReviews>
                                    <GuestFavourite>
                                        Guest favourite
                                    </GuestFavourite>
                                    <RatingWrapper>
                                        <RatingValue>
                                            {hotelRating || 0}
                                        </RatingValue>
                                        <StyledRating
                                            name="half-rating"
                                            precision={0.5}
                                            value={hotelRating}
                                            readOnly
                                        />
                                    </RatingWrapper>
                                    <ReviewCount>
                                        {reviews.length} Reviews
                                    </ReviewCount>
                                </GuestReviews>

                                <Features>
                                    <CheckboxContainer>
                                        {features.wifi && (
                                            <CheckboxLabel
                                                checked={features.wifi}
                                            >
                                                <IconWrapper>
                                                    <FaWifi size={24} />
                                                </IconWrapper>
                                                WiFi
                                            </CheckboxLabel>
                                        )}
                                        {features.ac && (
                                            <CheckboxLabel
                                                checked={features.ac}
                                            >
                                                <IconWrapper>
                                                    <FaSnowflake size={24} />
                                                </IconWrapper>
                                                AC
                                            </CheckboxLabel>
                                        )}
                                        {features.breakfast && (
                                            <CheckboxLabel
                                                checked={features.breakfast}
                                            >
                                                <IconWrapper>
                                                    <FaCoffee size={24} />
                                                </IconWrapper>
                                                Breakfast
                                            </CheckboxLabel>
                                        )}
                                        {features.parking && (
                                            <CheckboxLabel
                                                checked={features.parking}
                                            >
                                                <IconWrapper>
                                                    <FaParking size={24} />
                                                </IconWrapper>
                                                Parking
                                            </CheckboxLabel>
                                        )}
                                        {features.kitchen && (
                                            <CheckboxLabel
                                                checked={features.kitchen}
                                            >
                                                <IconWrapper>
                                                    <FaUtensils size={24} />
                                                </IconWrapper>
                                                Kitchen
                                            </CheckboxLabel>
                                        )}
                                        {features.gym && (
                                            <CheckboxLabel
                                                checked={features.gym}
                                            >
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
                                    <p>City: {hotel.city}</p>
                                </City>
                                <State>
                                    <p>State: {hotel.state}</p>
                                </State>
                                <PinCode>
                                    <p>Pin Code: {hotel.pinCode}</p>
                                </PinCode>
                            </Left>
                            <Right>
                                <PriceSection>
                                    <p>
                                        <DiscountedPrice>
                                            ₹{" "}
                                            {typeof hotel.price === "number"
                                                ? hotel.price.toLocaleString(
                                                    "en-IN"
                                                )
                                                : "N/A"}
                                        </DiscountedPrice>{" "}
                                        per night
                                    </p>

                                    <p>
                                        Max guest per room : {hotel.maxGuests}
                                    </p>
                                    <button onClick={handleBookClick}>
                                        Reserve
                                    </button>
                                    {showPopup && (
                                        <PopupOverlay
                                            onClick={handlePopupClose}
                                        >
                                            <PopupContent
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                style={{ zIndex: "100" }}
                                            >
                                                <PopupHeader>
                                                    <h2>Booking Details</h2>
                                                    <CloseButton
                                                        style={{
                                                            backgroundColor:
                                                                "white",
                                                            color: "black",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            position:
                                                                "relative",
                                                            marginTop: "-25px",
                                                            marginRight:
                                                                "-10px",
                                                            fontSize: "40px",
                                                        }}
                                                        onClick={
                                                            handlePopupClose
                                                        }
                                                    >
                                                        &times;
                                                    </CloseButton>
                                                </PopupHeader>
                                                <Form>
                                                    {guestNames.map(
                                                        (guest, index) => (
                                                            <GuestDetails
                                                                key={index}
                                                            >
                                                                <FormItem>
                                                                    <label>
                                                                        Guest{" "}
                                                                        {index +
                                                                            1}{" "}
                                                                        First
                                                                        Name
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={
                                                                            guest.firstName
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleGuestNameChange(
                                                                                index,
                                                                                "firstName",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        minLength="1"
                                                                        placeholder="Enter first name"
                                                                    />
                                                                </FormItem>
                                                                <FormItem>
                                                                    <label>
                                                                        Guest{" "}
                                                                        {index +
                                                                            1}{" "}
                                                                        Last
                                                                        Name
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={
                                                                            guest.lastName
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleGuestNameChange(
                                                                                index,
                                                                                "lastName",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        minLength="1"
                                                                        placeholder="Enter last name"
                                                                    />
                                                                </FormItem>
                                                                <FormItem>
                                                                    <label>
                                                                        Guest{" "}
                                                                        {index +
                                                                            1}{" "}
                                                                        Phone
                                                                        Number
                                                                    </label>
                                                                    <input
                                                                        type="tel"
                                                                        value={
                                                                            guest.phoneNumber
                                                                        }
                                                                        maxLength="10"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleGuestNameChange(
                                                                                index,
                                                                                "phoneNumber",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        placeholder="Enter phone number"
                                                                    />
                                                                </FormItem>
                                                                {guestNames.length >
                                                                    1 && (
                                                                        <RemoveGuestButton
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleRemoveGuest(
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            Remove
                                                                            Guest
                                                                        </RemoveGuestButton>
                                                                    )}
                                                            </GuestDetails>
                                                        )
                                                    )}
                                                    <AddGuestButton
                                                        type="button"
                                                        onClick={handleAddGuest}
                                                    >
                                                        Add Guest
                                                    </AddGuestButton>
                                                    <DatePickerWrapper>
                                                        <FormItem>
                                                            <label>
                                                                Check-In Date
                                                            </label>
                                                            <DatePicker
                                                                selected={checkInDate}
                                                                onChange={(date) => setCheckInDate(date)}
                                                                placeholderText="Check-In"
                                                                minDate={new Date()} // This disables all dates before today
                                                            />
                                                        </FormItem>
                                                        <FormItem>
                                                            <label>
                                                                Check-Out Date
                                                            </label>
                                                            <DatePicker
                                                                selected={checkOutDate}
                                                                onChange={(date) => setCheckOutDate(date)}
                                                                placeholderText="Select check-out date"
                                                                minDate={checkInDate || new Date()} // This ensures check-out date can't be before check-in date
                                                            />
                                                        </FormItem>
                                                    </DatePickerWrapper>
                                                    <SummarySection>
                                                        <SummaryItem>
                                                            <label>Rooms</label>
                                                            <p>{rooms || 0}</p>
                                                        </SummaryItem>
                                                        <SummaryItem>
                                                            <label>
                                                                Final Price
                                                            </label>
                                                            <p>
                                                                {formatPrice(
                                                                    amount || 0
                                                                )}
                                                            </p>
                                                        </SummaryItem>
                                                    </SummarySection>
                                                    <PayButton
                                                        type="submit"
                                                        onClick={(e) => handlePay(e)}
                                                    >
                                                        Proceed to Payment
                                                    </PayButton>
                                                </Form>
                                            </PopupContent>
                                        </PopupOverlay>
                                    )}
                                </PriceSection>
                            </Right>
                        </Details>
                        <div
                            className="max-w-full mx-auto p-6 md:p-10 bg-slate-50 rounded-2xl shadow-md max-md:mt-6"
                            id="comment-section"
                        >
                            {/* Comment Input Area */}
                            <div className="mb-10">
                                <h2 className="text-2xl font-bold text-slate-800 mb-8">
                                    Write a Review
                                </h2>

                                <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-shrink-0">
                                            <p className="text-sm text-slate-600 mb-2 z-[-10]">
                                                Your Rating
                                            </p>
                                            <div
                                                style={{
                                                    position: "relative",
                                                    zIndex: showPopup ? "-1" : "0",
                                                }}
                                            >
                                                <Rating
                                                    name="half-rating"
                                                    defaultValue={0}
                                                    precision={0.5}
                                                    onChange={(e) =>
                                                        setComment({
                                                            ...comment,
                                                            rating: e.target
                                                                .value,
                                                        })
                                                    }
                                                    value={comment.rating}
                                                    size="large"
                                                    className="text-green-600 relative z-0"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex-grow w-full space-y-4">
                                            <textarea
                                                className="w-full px-4 py-3 h-32 text-slate-700 bg-slate-50 border border-slate-200 
                        rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none 
                        transition-all duration-200 placeholder-slate-400"
                                                onChange={(e) =>
                                                    setComment({
                                                        ...comment,
                                                        message: e.target.value,
                                                    })
                                                }
                                                value={comment.message}
                                                placeholder="Share your experience with this product..."
                                            />

                                            <button
                                                onClick={commentHandler}
                                                className="px-6 py-2.5 bg-green-600 text-white font-medium text-sm
                        rounded-lg hover:bg-green-700 transition-all duration-200 
                        hover:shadow-md active:scale-95 z-0"
                                            >
                                                Submit Review
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews List */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-slate-800">
                                        Customer Reviews
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {reviews?.map((review, index) => (
                                        <div
                                            key={index}
                                            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md 
                    transition-all duration-200"
                                        >
                                            <div className="flex items-start gap-4 mb-4">
                                                <Avatar
                                                    src={review.user.avatar}
                                                    className="w-20 h-10 rounded-full ring-2 ring-slate-100"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-semibold text-slate-900">
                                                            {
                                                                review.user
                                                                    .username
                                                            }
                                                        </h4>
                                                        {user &&
                                                            user._id ===
                                                            review.user
                                                                ._id && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteReview(
                                                                            review._id
                                                                        )
                                                                    }
                                                                    className="p-1.5 text-slate-400 hover:text-red-500 
                                        opacity-0 group-hover:opacity-100 transition-all duration-200 z-0"
                                                                >
                                                                    <MdDelete
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                            )}
                                                    </div>
                                                    <Rating
                                                        name="half-rating-read"
                                                        defaultValue={0}
                                                        precision={0.5}
                                                        value={review.rating}
                                                        readOnly
                                                        size="small"
                                                        className={`text-green-600 relative ${showPopup && "z-[-1]"}`}
                                                    />
                                                </div>
                                            </div>

                                            <p className="text-slate-600 text-sm leading-relaxed">
                                                {review.message}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </>
    );
};

export default HotelDetails;

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

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
    animation: ${fadeIn} 2.5s ease forwards;
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
        height: 500px;
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
    animation: ${fadeIn} 0.5s ease forwards;
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
    color: #cd7f32;

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
    margin-top: 4px;
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

const PinCode = styled.div`
    font-size: 18px;
    color: #333;
`;

const Right = styled.div`
    animation: ${fadeIn} 0.5s ease forwards;
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

const Avatar = styled.img`
    border-radius: 50%;
    height: 80px;
    margin-right: 10px;
`;

const slideIn = keyframes`
  from { 
    opacity: 0;
    transform: translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const PopupOverlay = styled.div`
    position: fixed;
    width: 100vw !important;
    height: 100vh !important;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    animation: ${fadeIn} 0.3s ease-out;
`;

const PopupContent = styled.div`
    position: relative;
    z-index: 1000;
    margin-top: 5rem;
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    animation: ${slideIn} 0.4s ease-out;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
        width: 0px;
        background: transparent;
    }
`;

const PopupHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 1rem;

    h2 {
        font-size: 1.75rem;
        color: #2d3748;
        margin: 0;
        font-weight: 600;
    }
`;

const CloseButton = styled.button`
    background-color: transparent;
    border: none;
    color: #718096;
    font-size: 1.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;

    &:hover {
        background-color: #f7fafc;
        color: #2d3748;
        transform: rotate(90deg);
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const GuestDetails = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.25rem;
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 0.75rem;
    margin-bottom: 0.75rem;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        transform: translateY(-2px);
    }
`;

const FormItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
        font-weight: 600;
        color: #4a5568;
        font-size: 0.875rem;
        letter-spacing: 0.025em;
    }

    input,
    .react-datepicker-wrapper {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 0.2s ease;

        &:focus {
            outline: none;
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.25);
        }

        &:hover {
            border-color: #cbd5e0;
        }
    }
`;

const buttonBase = styled.button`
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    font-weight: 600;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.025em;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    &:active {
        transform: translateY(0);
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
    }
`;

const AddGuestButton = styled(buttonBase)`
    background-color: #48bb78;
    align-self: flex-start;

    &:hover {
        background-color: #38a169;
    }
`;

const PayButton = styled(buttonBase)`
    background-color: #4299e1;
    align-self: center;
    width: 200px;

    &:hover {
        background-color: #3182ce;
    }
`;

const RemoveGuestButton = styled(buttonBase)`
    background-color: #f56565;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;

    &:hover {
        background-color: #e53e3e;
    }
`;

const DatePickerWrapper = styled.div`
    display: flex;
    gap: 1.25rem;
    margin-bottom: 1.25rem;

    @media (max-width: 640px) {
        flex-direction: column;
    }
`;

const SummarySection = styled.div`
    background: linear-gradient(135deg, #cd7f32, #daa520);
    padding: 1.5rem;
    border-radius: 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SummaryItem = styled.div`
    text-align: center;
    padding: 0.5rem 1rem;

    label {
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.875rem;
        display: block;
        margin-bottom: 0.375rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    p {
        font-size: 1.25rem;
        font-weight: 700;
        color: white;
        margin: 0;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
`;
