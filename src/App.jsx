import React, { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import Preloader from "./Preloader";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useDispatch } from 'react-redux'
import axios from './utils/axios.jsx'
import { setUser, toggleLogin } from "./app/reducers/userSlice.jsx";

const App = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigationType = useNavigationType();
  const isadminpath = location.pathname.split("/")[1] === "admin";
  const issellerpath = location.pathname.split("/")[1] === "seller";

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
          {!isadminpath && !issellerpath && <Navbar />}
          <main style={{
                fontFamily: "Josefin Sans, sans-serif",
                fontOpticalSizing: "auto",
                fontWeight: 800,
                fontStyle: "normal",
            }}>
            <Outlet />
          </main>
          {!isadminpath && !issellerpath && <Footer />}
        </>
      )}
    </div>
  );
};

export default App; 