import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";
import axios from "./utils/axios.jsx";
import useHandleErr from "./utils/useHandleErr";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const handleError = useHandleErr()
  const handleEmailPhoneSubmit = async (e) => {
    e.preventDefault();
    if(!username) {
      alert("Please enter username");
      return;
    } 

    try {
      const response = await axios.post("/user/forgot-password", {username}, {withCredentials: true});
    if(response.data.status === 200) {
      alert("Password reset link sent to your email");
      navigate("/login");
    }
    } catch (error) {
      handleError(error)
    }

  };


  return (
    <>
      <Navbar />
      <Wrapper>
        <Card>
          <Form onSubmit={handleEmailPhoneSubmit}>
            <Input
              type="name"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <SubmitButton type="submit">Submit</SubmitButton>
          </Form>
        </Card>
      </Wrapper>
    </>
  );
};

export default ForgotPassword;

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
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
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
  border: 1px solid #cecece;
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

const SubmitButton = styled.button`
  padding: 10px;
  background-color: #90ee90;
  border: solid 0.5px green;
  margin-top: 10px;
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

const OtpForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const OtpInput = styled.input`
  width: 40px;
  height: 40px;
  margin: 5px;
  text-align: center;
  font-size: 24px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
    rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
  background-color: #fff;
  color: #333;

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 20px;
  }
`;

