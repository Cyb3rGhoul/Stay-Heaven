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
  <FooterContainer>
    <FooterContent>
      <LogoContainer>
        <img src={logo} alt="StayHeaven Logo" />
        <p>
          StayHeaven is a hotel house booking and renting. add other relevent
          information here.
        </p>
      </LogoContainer>
      <MiddlePart>
        <FooterLinks>
          <FooterColumn>
            <h4>Support</h4>
            <a href="#help-centre">Help Centre</a>
            <a href="#aircover">AirCover</a>
            <a href="#anti-discrimination">Anti-discrimination</a>
            <a href="#disability-support">Disability support</a>
            <a href="#cancellation-options">Cancellation options</a>
            <a href="#report-concern">Report neighbourhood concern</a>
          </FooterColumn>
        </FooterLinks>
      </MiddlePart>
      <ThirdPart>
        <SocialsContainer>
          <SocialLink
            href="https://instagram.com/stayheaven"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </SocialLink>
          <SocialLink
            href="https://twitter.com/stayheaven"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </SocialLink>
          <SocialLink
            href="https://linkedin.com/company/stayheaven"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedin} size="2x" />
          </SocialLink>
          <SocialLink
            href="mailto:support@stayheaven.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faEnvelope} size="2x" />
          </SocialLink>
        </SocialsContainer>
      </ThirdPart>
    </FooterContent>
  </FooterContainer>
);

export default Footer;

const FooterContainer = styled.footer`
  background: #f8f9fa; /* Light grey background */
  color: #333;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); /* Add box shadow */
  border-top: 1px solid #e0e0e0; /* Add top border for inner differentiation */
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr 1fr;
    align-items: start;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  @media (min-width: 768px) {
    align-items: flex-start;
    text-align: left;
    p {
      display: hidden;
    }
  }
  img {
    max-width: 150px;
    height: auto;
  }
  p {
    margin-top: 10px;
    color: #666;
  }
`;

const MiddlePart = styled.div`
  flex: 2;
  text-align: left;
  display: flex;
  justify-content: center;
  gap: 20px;
  @media (min-width: 768px) {
    justify-content: center;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (min-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start; /* Add this line */
  }
`;

const FooterColumn = styled.div`
  h4 {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
  }
  a {
    display: block;
    color: #333;
    margin-bottom: 5px;
    text-decoration: none;
    &:hover {
      color: #04af70;
    }
  }
`;

const ThirdPart = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  @media (min-width: 768px) {
    align-items: flex-end;
  }
`;

const SocialsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  @media (max-width: 768px) {
    flex-direction: row;
  }
`;

const SocialLink = styled.a`
  color: #333;
  transition: color 0.3s;
  &:hover {
    color: #04af70;
  }
`;
