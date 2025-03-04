import React from "react";
import "./payment.css";
import { Link } from "react-router-dom";

const PaymentF = () => {
    return (
        <div className="row justify-content-center h-[60vh] _failed">
            <div className="col-md-5 pt-[15vh] ">
                <div className="message-box _success ">
                    <i className="fa fa-times-circle" aria-hidden="true"></i>
                    <h2> Your payment failed </h2>
                    <p> Try again later</p>
                    <Link to="/">
                        <button className="button1">
                            <span className="button_top"> Home</span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentF;
