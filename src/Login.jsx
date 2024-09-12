import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import googlebutt from "./assets/googlesignup.png";
import Navbar from "./Navbar";
import axios from "./utils/axios";

const Login = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailOrUsername || !password) {
      alert("All fields are required");
      return;
    } 


    try {
      const response = await axios.post("/user/login", {
        identity: emailOrUsername,
        password,
      },
      {
        withCredentials: true, // Important: This sends cookies with the request
      }
    );
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <Wrapper>
        <Card>
          <Form onSubmit={handleLogin}>
            <Input
              type="text"
              placeholder="email or username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <LoginButton type="submit">
              <span className="span-mother">
                <span>L</span>
                <span>o</span>
                <span>g</span>
                <span>i</span>
                <span>n</span>
              </span>
              <span className="span-mother2">
                <span>L</span>
                <span>o</span>
                <span>g</span>
                <span>i</span>
                <span>n</span>
              </span>
            </LoginButton>
            <ForgotPasswordButton onClick={() => navigate("/forgotPassword")}>
              Forgot Password?
            </ForgotPasswordButton>
            <OrText>or</OrText>
            <button onClick={() => { navigate("/signup")}} className="text-black">New User ? Sign Up</button>
          </Form>
        </Card>
      </Wrapper>
    </>
  );
};

export default Login;

const Wrapper = styled.div`
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 92vh;
`;

const Card = styled.div`
  background-color: #d4f3c2;
  padding: 40px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  margin: 20px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  color: #333;
  font-size: 16px;

  &::placeholder {
    color: #999;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;


const LoginButton = styled.button`
  padding: 10px;
  background-color: #90ee90;
  border: solid 0.5px green;
  border-radius: 5px;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 42.66px;

  &:hover {
    background-color: #057807;
    color: #fff;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }

  .span-mother, .span-mother2 {
    display: flex;
    position: absolute;
  }

  .span-mother {
    overflow: hidden;
  }

  &:hover .span-mother {
    position: absolute;
  }

  &:hover .span-mother span {
    transform: translateY(1.2em);
  }

  .span-mother span:nth-child(1) {
    transition: 0.2s;
  }

  .span-mother span:nth-child(2) {
    transition: 0.3s;
  }

  .span-mother span:nth-child(3) {
    transition: 0.4s;
  }

  .span-mother span:nth-child(4) {
    transition: 0.5s;
  }

  .span-mother span:nth-child(5) {
    transition: 0.6s;
  }

  .span-mother span:nth-child(6) {
    transition: 0.7s;
  }

  .span-mother2 {
    overflow: hidden;
  }

  .span-mother2 span {
    transform: translateY(-2em); /* Increased value */
  }

  &:hover .span-mother2 span {
    transform: translateY(0);
  }

  .span-mother2 span {
    transition: 0.2s;
  }

  .span-mother2 span:nth-child(2) {
    transition: 0.3s;
  }

  .span-mother2 span:nth-child(3) {
    transition: 0.4s;
  }

  .span-mother2 span:nth-child(4) {
    transition: 0.5s;
  }

  .span-mother2 span:nth-child(5) {
    transition: 0.6s;
  }

  .span-mother2 span:nth-child(6) {
    transition: 0.7s;
  }
`;

const ForgotPasswordButton = styled.button`
  padding: 10px;
  border-radius: 5px;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const OrText = styled.div`
  margin: 10px 0;
  color: #333;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
