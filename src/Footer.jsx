import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import logo from "./assets/logo.png";
import "./Footer.css";

const Footer = () => (
  <footer className="footer" id="footer">
    <div className="footer-container">
      <div className="footer-section logo-section">
        <img src={logo} alt="StayHeaven Logo" className="footer-logo" />
        <p className="footer-description">
          StayHeaven is an Indian marketplace that connects people looking to book and create hotels. It has revolutionized the travel industry by enabling hosts to offer unique, often cost-effective lodging options to guests in country.
        </p>
      </div>

      <div className="footer-section support-section">
        <h3 className="footer-heading">Support</h3>
        <nav className="footer-nav">
          <a href="#help-centre">Help Centre</a>
          <a href="#aircover">AirCover</a>
          <a href="#anti-discrimination">Anti-discrimination</a>
          <a href="#disability-support">Disability support</a>
          <a href="#cancellation-options">Cancellation options</a>
          <a href="#report-concern">Report neighbourhood concern</a>
        </nav>
      </div>
      
      <div className="footer-section social-section">
        <a href="https://instagram.com/stayheaven" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} size="lg" />
        </a>
        <a href="https://twitter.com/stayheaven" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} size="lg" />
        </a>
        <a href="https://linkedin.com/company/stayheaven" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLinkedin} size="lg" />
        </a>
        <a href="mailto:support@stayheaven.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faEnvelope} size="lg" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;