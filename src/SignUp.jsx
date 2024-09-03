import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";
import axios from "./utils/axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [isFileSelected, setIsFileSelected] = useState(false);
  const avatarRef = useRef(null);

  const handleSignUp = async (e) =>{
    e.preventDefault();

    if (!username || !email || !password || !avatar || !fullname || !phone){
      alert("All fields are required");
      return;
    }

    if(phone.length != 10){
      alert("Invalid phone number");
      return;
    }
    let url;
    try {
      const formdata = new FormData();
      formdata.append("file", avatar);
      formdata.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
      formdata.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formdata,
      );

      url = response.data.secure_url;

    } catch (error) {
      console.error("error while uploading the image");
      return ;
    }

    try {
      const response = await axios.post("/user/register", {
        username,
        email,
        password,
        avatar:url,
        fullName:fullname,
        phoneNumber:phone,
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  const [showAvatar, setShowAvatar] = useState(null);
  const showAvatarhandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShowAvatar(URL.createObjectURL(file));
      setIsFileSelected(true);
    } else {
      setIsFileSelected(false);
    }
  };


  return (
    <>
      <Navbar />
      <Wrapper>
        <Card>
          <Avatar onClick={() => {
            avatarRef.current.click();
          }} >
            {avatar ? (
              <img
                src={showAvatar}
                alt="Avatar"
                style={{ width: "100%", height: "100%", borderRadius: "50%" }}
              />
            ) : (
              <AvatarPlaceholder  />
            )}
            {!isFileSelected && ( 
              <UploadLabel htmlFor="avatarUpload">Upload</UploadLabel>
            )}
            <UploadInput
              ref={avatarRef}
              id="avatarUpload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setAvatar(e.target.files[0])
                showAvatarhandler(e);
              }}
            />
          </Avatar>
          <Form onSubmit={handleSignUp}>
          <Input
              type="text"
              placeholder="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
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
              type="tel"
              placeholder="phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <SignUpButton type="submit">
              <span className="span-mother">
                <span>S</span>
                <span>i</span>
                <span>g</span>
                <span>n</span>
                <span> </span>
                <span>U</span>
                <span>p</span>
              </span>
              <span className="span-mother2">
                <span>S</span>
                <span>i</span>
                <span>g</span>
                <span>n</span>
                <span> </span>
                <span>U</span>
                <span>p</span>
              </span>
            </SignUpButton>
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

  .span-mother span:nth-child(7) {
    transition: 0.8s;
  }

  .span-mother2 {
    overflow: hidden;
  }

  .span-mother2 span {
    transform: translateY(-2em); /* Adjusted value */
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
  .span-mother2 span:nth-child(7) {
    transition: 0.8s;
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
  cursor: pointer;
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
