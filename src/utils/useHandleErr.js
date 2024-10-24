// useHandleErr.js
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function useHandleErr() {
    const navigate = useNavigate();

    const handleError = (error) => {
        const err = error?.response?.data?.message;
        if (err === "jwt expired") {
            navigate("/login");
        } else if(err === "Hotel not found"){
           toast.error("Error Occured, Try Again!")
           //edit hotel
        } else if(err === "User not found" || err === "Order not found"){
            toast.error("Error Occurred. Try Again!")
        }else if(err === "User not found - Username not found") {
            toast.error("Username not found");
        } 
        else if(err === "User not found - Username / Email not found") {
            toast.error("Username / Email not found");
        } 
        else if(err === "Unauthorized request") {
            navigate("/login")
        }else if(err === "Owner not found") {
           toast.error("Error in payment, Try Again!")
        } else if(err === "Something went wrong while creating hotel") {
            toast.error("Something went wrong while creating hotel, Try Again!")
        } else if(err === "Something went wrong while generating access token") {
            toast.error("Error Logging in, Try Again!")
        } else if(err === "Something went wrong while registering user") {
           toast.error("Something went wrong while registering user, Try Again!.")
        }   else if(err === "Invalid old password" 
            || err === "Passwords do not match" 
            || err === "Username is required" 
            || err === "Password must be at least 8 characters"
            || err === "All fields are required"
            || err === "Invalid password"
            || err === "Username or Email is required"
            || err === "User with this username already exists"
            || err === "User with this email already exists"
            || err === "User with this phone number already exists"
            || err === "Phone number must be 10 digits"
        ) {
           toast.error(err)
        }  else if(err === "error sending mail") {
            toast.error("Could not send email. Please Try Again!")
        } 
        else if(err === "password is required") {
            toast.error("Password is required")
        } 
        else if(err === "Invalid token") {
            toast.error("Reset Password Link Expired")
        }
    };

    return handleError; 
}
