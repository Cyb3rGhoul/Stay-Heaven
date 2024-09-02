import React, { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import Preloader from "./Preloader";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useDispatch } from 'react-redux'
import axios from './utils/axios.jsx'
import { toggleLogin } from "./app/reducers/userSlice.jsx";

const App = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigationType = useNavigationType();
  const dispatch = useDispatch();

  const getUser = async () => {
    const user = await axios.get("/user/current-user",{
      withCredentials: true, // Important: This sends cookies with the request
    })
    console.log("user: ", user)
    if(user) {
      dispatch(toggleLogin(true))
    } else {
      dispatch(toggleLogin(false))
    }
  }

  useEffect(() => {
    getUser()
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (navigationType !== "POP") {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 700);
      return () => clearTimeout(timer);
    }
  }, [location, navigationType]);

  return (

    <div className="h-screen scrollbar scrollbar-thumb-rounded relative">
      <GlobalStyles />
      {loading && <Preloader />}
      {!loading && (
        <>
          <Navbar />
          <main>
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App; 