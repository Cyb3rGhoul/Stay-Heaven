// useHandleErr.js
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function useHandleErr() {
    const navigate = useNavigate();

    const handleError = (error) => {
        const err = error?.response?.data?.message;
        if (err === "jwt expired") {
            navigate("/login");
            // toast.error("Hello World")
        } else if(err === "Hotel not found"){
            // in approve hotel admin controller
            // also delete comment controller
            // checkout payment controller
            // edit hotel controller
            // get hotel details controller
            // delete request controller (hotel)
            // undo delete request controller (hotel)
        } else if(err === "User not found"){
            // in admin controller
            // login controller
            // forgot password
            // reset password
        } else if(err === "Unauthorized request") {
            //create comment controller
            //create hotel controller
            // my previous booking controller
            // my created places controller
            // get current user controller
            // get seller data
        } else if(err === "All fields are required") {
            //create comment controller
            //create hotel controller
            //edit hotel controller
            //register user controller
            // update account details controller
            // get seller data
        } else if(err === "Owner not found") {
            //payment verification route
        } else if(err === "You cannot create a hotel") {
            //create hotel controller
        } else if(err === "Something went wrong while creating hotel") {
            //create hotel controller
        } else if(err === "Something went wrong while generating access and refresh token") {
            // generate access and refresh token controller
        } else if(err === "Phone number must be 10 digits") {
            //register user controller
        } else if(err === "User with email or username or phone number already exists") {
            //register user controller
        } else if(err === "Something went wrong while registering user") {
            //register user controller
        } else if(err === "Username or Email is required") {
            //login user controller
        } else if(err === "Invalid password") {
            //login user controller
        } else if(err === "Passwords do not match") {
            // change password controller
        } else if(err === "Invalid old password") {
            // change password controller
        } else if(err === "Username is required") {
            // forgot password controller
        } else if(err === "error sending mail") {
            // forgot password controller
        } else if(err === "password is required") {
            // reset password controller
        } else if(err === "Invalid token") {
            // reset password controller
        } else if(err === "Order not found") {
            // approve order controller
        }
    };

    return handleError; 
}
