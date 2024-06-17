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
  <div className="h-[35vh] bg-red-200">
    <div className="flex p-5 items-center justify-center">
      <div>
        <img src={logo} alt="StayHeaven Logo" />
        <p>
          StayHeaven is a hotel house booking and renting. add other relevent
          information here.
        </p>
      </div>
      <div>
        <div>
          <div>
            <h4>Support</h4>
            <a href="#help-centre">Help Centre</a>
            <a href="#aircover">AirCover</a>
            <a href="#anti-discrimination">Anti-discrimination</a>
            <a href="#disability-support">Disability support</a>
            <a href="#cancellation-options">Cancellation options</a>
            <a href="#report-concern">Report neighbourhood concern</a>
          </div>
        </div>
      </div>
      <div>
        <div>
          <a
            href="https://instagram.com/stayheaven"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
          <a
            href="https://twitter.com/stayheaven"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
          <a
            href="https://linkedin.com/company/stayheaven"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedin} size="2x" />
          </a>
          <a
            href="mailto:support@stayheaven.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faEnvelope} size="2x" />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
