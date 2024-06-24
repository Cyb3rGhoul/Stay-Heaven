import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  const handleSignUp = (e) => {
    e.preventDefault();
    if (username && email && password) {
      // Perform signup logic here (e.g., API call)
      navigate("/");
    } else {
      alert("All fields are required");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <Navbar />
      <Wrapper>
        <Card>
          <Avatar>
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                style={{ width: "100%", height: "100%", borderRadius: "50%" }}
              />
            ) : (
              <AvatarPlaceholder />
            )}
            <UploadLabel htmlFor="avatarUpload">Upload</UploadLabel>
            <UploadInput
              id="avatarUpload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </Avatar>
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
            <SignUpButton type="submit">Sign Up</SignUpButton>
            <LoginLink to="/login">Already have an account? Login</LoginLink>
          </Form>
        </Card>
      </Wrapper>
    </>
  );
};

export default SignUp;

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

const SignUpButton = styled.button`
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

const LoginLink = styled(Link)`
  margin-top: 20px;
  color: #333;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Avatar = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  background-color: #555;
  border-radius: 50%;
  margin: 0 auto 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ccc;
  border-radius: 50%;
`;

const UploadLabel = styled.label`
  position: absolute;
  margin: 0 auto;
  color: #000;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
`;

const UploadInput = styled.input`
  display: none;
`;
