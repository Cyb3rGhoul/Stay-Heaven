import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    if (username && email && password) {
      // Perform signup logic here (e.g., API call)
      navigate("/");
    } else {
      alert("All fields are required");
    }
  };

  return (
    <Wrapper>
      <Card>
        <Avatar />
        <Form onSubmit={handleSignUp}>
          <Input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SignUpButton type="submit">sign up</SignUpButton>
          <LoginLink to="/login">Already have an account? Login</LoginLink>
        </Form>
      </Card>
    </Wrapper>
  );
};

export default SignUp;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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

const SignUpButton = styled.button`
  padding: 10px;
  background-color: #9b59b6;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #8e44ad;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const LoginLink = styled(Link)`
  margin-top: 20px;
  color: #9b59b6;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background-color: #555;
  border-radius: 50%;
  margin: 0 auto 20px auto;
`;