// useHandleErr.js
import { useNavigate } from "react-router-dom";

export default function useHandleErr() {
    const navigate = useNavigate();

    const handleError = (error) => {
        console.log("error: ", error);
        if (error?.response?.data?.message === "jwt expired") {
            navigate("/login");
        } else {
            alert("Some other error");
        }
    };

    return handleError; 
}
