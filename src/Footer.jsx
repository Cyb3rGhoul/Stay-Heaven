import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"; // Updated import
import logo from "./assets/logo.png";

const Footer = () => (
  <div className="  ">
    <div className="flex p-10 px-10 min-[1500px]:px-40 min-[1500px]:pr-60  flex-col lg:flex-row  justify-between h-full">

      <div className=" lg:w-[28%] w-full flex flex-col gap-4 text-justify">
        <img src={logo} alt="StayHeaven Logo"  className="h-16 w-80 m-auto lg:m-0"/>
        <div className="">
          StayHeaven is an Indian marketplace that connects people looking to book and create hotels. It has revolutionized the travel industry by enabling hosts to offer unique, often cost-effective lodging options to guests in country.
        </div>
      </div>

      <div className=" h-full mt-10 lg:mt-0 text-center lg:text-left">
        <div className="h-full">
          <div className="h-full">
            <div className="text-2xl font-bold">Support</div>
            <div className="flex flex-col mt-5 text-lg justify-around h-[90%]">
            <a className="hover:text-[#04af70]" href="#help-centre">Help Centre</a>
            <a className="hover:text-[#04af70]" href="#aircover">AirCover</a>
            <a className="hover:text-[#04af70]" href="#anti-discrimination">Anti-discrimination</a>
            <a className="hover:text-[#04af70]" href="#disability-support">Disability support</a>
            <a className="hover:text-[#04af70]" href="#cancellation-options">Cancellation options</a>
            <a className="hover:text-[#04af70]" href="#report-concern">Report neighbourhood concern</a>
            </div>
          </div>
        </div>
      </div>
      
        <div className="flex gap-0 lg:gap-6 flex-row mt-10 lg:mt-0 lg:flex-col items-center justify-between  text-2xl h-full">
          <a
          className="hover:text-[#04af70]"
            href="https://instagram.com/stayheaven"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
          <a
          className="hover:text-[#04af70]"
            href="https://twitter.com/stayheaven"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
          <a
          className="hover:text-[#04af70]"
            href="https://linkedin.com/company/stayheaven"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedin} size="2x" />
          </a>
          <a
          className="hover:text-[#04af70]"
            href="mailto:support@stayheaven.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faEnvelope} size="2x" />
          </a>
        </div>
      
    </div>
  </div>
);

export default Footer;
