import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import googlebutt from "./assets/googlesignup.png";
import Navbar from "./Navbar";

const Login = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (emailOrUsername && password) {
      navigate("/");
    } else {
      alert("All fields are required");
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
            <LoginButton type="submit">Login</LoginButton>
            <ForgotPasswordButton onClick={() => navigate("/forgotPassword")}>
              Forgot Password?
            </ForgotPasswordButton>
            <OrText>or</OrText>
            <GoogleButton>
              <GoogleImage src={googlebutt} alt="Signup with Google" />
            </GoogleButton>
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

  &:hover {
    background-color: #057807;
    color: #fff;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
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
  margin: 20px 0;
  color: #333;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const GoogleButton = styled.button`
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 30px;

  &:focus {
    outline: none;
  }
`;

const GoogleImage = styled.img`
  width: 250px;
  height: auto;

  @media (max-width: 768px) {
    width: 200px;
  }
`;
