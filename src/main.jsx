import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Router, RouterProvider, createBrowserRouter } from "react-router-dom";
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
import CreatePlace from "./CreatePlace.jsx";

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
        path: "/hotel",
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
        path: "/createPlace",
        element: <CreatePlace />,
      },
      {
        path: "*",
        element: <Notfound />,
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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
