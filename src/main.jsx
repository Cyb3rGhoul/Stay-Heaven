import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Home.jsx";
import SignUp from "./SignUp.jsx";
import Login from "./Login.jsx";
import Search from "./Search.jsx";
import HotelDetails from "./HotelDetails.jsx";
import Profile from "./Profile.jsx";
import PaymentS from "./PaymentS.jsx";
import PaymentF from "./PaymentF.jsx";
import Notfound from "./Notfound.jsx";
import ForgotPassword from "./ForgotPage.jsx";
import PreviousBookings from "./PreviousBookings.jsx";
import Admin from "./Admin.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminRequests from "./AdminRequests.jsx";
import AdminHotels from "./AdminHotels";
import SellerFormPage from "./SellerAuth.jsx";
import AdminUser from "./AdminUser.jsx";
import AdminBookings from "./AdminBookings.jsx";
import ResetPassword from "./ResetPassword.jsx";
import { store } from "./app/store";
import { Provider, useDispatch } from "react-redux";
import { setUser, toggleLogin } from "./app/reducers/userSlice.jsx";
import axios from "./utils/axios.jsx";
import Seller from "./Seller.jsx";
import SellerDashboard from "./SellerDashboard.jsx";
import CreateHotel from "./CreateHotel.jsx";
import SellerHotels from "./SellerHotels.jsx";
import SellerRequests from "./SellerRequests.jsx";
import SellerBookings from "./SellerBookings.jsx";
import AdminHotelDeleteRequests from "./AdminHotelDeleteRequests.jsx";
import BecomeSellerRequests from "./BecomeSellerRequests.jsx";
import { Toaster } from "react-hot-toast";
import useHandleErr from "./utils/useHandleErr";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/search",
                element: <Search />,
            },
            {
                path: "/hotel/:id",
                element: <HotelDetails />,
            },
            {
                path: "/profile",
                element: <Profile />,
            },
            {
                path: "/success",
                element: <PaymentS />,
            },
            {
                path: "/fail",
                element: <PaymentF />,
            },
            {
                path: "/previousBookings",
                element: <PreviousBookings />,
            },
            {
                path: "/sellerForm",
                element: <SellerFormPage />,
            },
            {
                path: "*",
                element: <Notfound />,
            },
            {
                path: "/admin",
                element: <Admin />,
                children: [
                    {
                        path: "dashboard",
                        element: <AdminDashboard />,
                    },
                    {
                        path: "hotel-requests",
                        element: <AdminRequests />,
                    },
                    {
                        path: "hotels",
                        element: <AdminHotels />,
                    },
                    {
                        path: "hotels-delete-request",
                        element: <AdminHotelDeleteRequests />
                    },
                    {
                        path: "users",
                        element: <AdminUser />,
                    },
                    {
                        path: "become-seller",
                        element: <BecomeSellerRequests />
                    },
                    {
                        path: "bookings",
                        element: <AdminBookings />,
                    },
                ],
            },
            {
                path: "/seller",
                element: <Seller />,
                children: [
                    {
                        path: "dashboard",
                        element: <SellerDashboard />,
                    },
                    {
                        path: "requests",
                        element: <CreateHotel />,
                    },
                    {
                        path: "order-requests",
                        element: <SellerRequests />,
                    },
                    {
                        path: "hotels",
                        element: <SellerHotels />,
                    },
                    {
                        path: "bookings",
                        element: <SellerBookings />,
                    },
                ],
            },
        ],
    },
    {
        path: "/signup",
        element: <SignUp />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/forgotPassword",
        element: <ForgotPassword />,
    },
    {
        path: "/resetPassword/:id/:token",
        element: <ResetPassword />,
    },
]);

function Base() {
    const dispatch = useDispatch();
    const getUser = async () => {
        try {
            const user = await axios.get("/user/current-user", {
                withCredentials: true,
            });
            if (user) {
                dispatch(toggleLogin(true));
                dispatch(setUser(user.data.data));
            } else {
                dispatch(toggleLogin(false));
                dispatch(setUser({}));
            }
        } catch (error) {
           console.log("")
        }
    };

    useEffect(() => {
        getUser();
    }, []);
    return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <Base />
        <Toaster
                toastOptions={{
                    success: {
                        style: {
                            color: "green",
                            background: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        },
                    },
                    error: {
                        style: {
                            color: "red",
                            background: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        },
                    },
                }}
                position="top-center"
                reverseOrder={false}
            />
    </Provider>
);
