import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import googlebutt from "./assets/googlesignup.png";

const Login = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (emailOrUsername && password) {
      // Perform login logic here (e.g., API call)
      navigate("/");
    } else {
      alert("All fields are required");
    }
  };

  return (
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
          <OrText>or</OrText>
          <GoogleButton>
            <GoogleImage src={googlebutt} alt="Signup with Google" />
          </GoogleButton>
        </Form>
      </Card>
    </Wrapper>
  );
};

export default Login;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 85vh;
  background-color: #1a1a1a;
`;

const Card = styled.div`
  background-color: #333;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  border: 1px solid #555;
  border-radius: 5px;
  background-color: #444;
  color: #fff;
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
  background-color: #9b59b6;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const OrText = styled.div`
  margin: 20px 0;
  color: #999;
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
