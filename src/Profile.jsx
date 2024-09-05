import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import axios from './utils/axios';
import { useNavigate } from "react-router-dom";
import { setUser } from "./app/reducers/userSlice";
import "./Profile.css";

const Profile = () => {
  const [userdetail, setUserdetail] = useState(useSelector((state) => state.userData));
  const [selectedImage, setSelectedImage] = useState(userdetail.avatar);
  const [name, setName] = useState(userdetail.fullName);
  const [email, setEmail] = useState(userdetail.email);
  const [phone, setPhone] = useState(userdetail.phoneNumber);
  const [username, setUsername] = useState(userdetail.username);
  const [file,setfile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpdateProfile = async () => {
    if (!username || !email || !selectedImage || !name || !phone){
      alert("All fields are required");
      return;
    }

    if(phone.length != 10){
      alert("Invalid phone number");
      return;
    }
    let url;
    if(file != null){
      try {
        const formdata = new FormData();
        formdata.append("file", file);
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
    }

    try {
      const response = await axios.post("/user/update-account-details", {
        username,
        email,
        fullName:name,
        phoneNumber:phone,
        avatar: url ?  url : selectedImage,
      },
      {
        withCredentials: true,
      });
      dispatch(setUser(response.data.data));
      navigate("/profile");
    } catch (error) {
      console.error(error);
    }

  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
      setfile(e.target.files[0]);
    }
  };


  return (
    <>
      <Container>
        <StyledProfileSection className="container">
          <AvatarContainer>
            <Avatar src={selectedImage} alt="" />
            <ImageUpload
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <UploadLabel htmlFor="imageUpload">Change Image</UploadLabel>
          </AvatarContainer>
          <ProfileForm>
            <Title>Profile Section</Title>
            <Label>Name</Label>
            <Input type="text" defaultValue={name} onChange={(e) => setName(e.target.value)} />
            <Label>Email Address</Label>
            <Input type="email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
            <Label>Username</Label>
            <Input type="text" defaultValue={username} onChange={(e) => setUsername(e.target.value)} />
            <Label>Phone Number</Label>
            <Input type="tel" defaultValue={phone} onChange={(e) => setPhone(e.target.value)} />
            <UpdateButton onClick={handleUpdateProfile}>
              Update Profile
            </UpdateButton>
          </ProfileForm>
        </StyledProfileSection>
      </Container>
    </>
  );
};

export default Profile;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
  background-color: #f0f0f0;
  padding: 20px;
`;

const StyledProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #d4f3c2;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  @media (min-width: 768px) {
    flex-direction: column;
  }
`;

const Title = styled.h2`
  color: #2a9d8f;
  margin-bottom: 20px;
`;

const ProfileForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const UpdateButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #2a9d8f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UploadLabel = styled.label`
  background-color: #2a9d8f;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
`;

const ImageUpload = styled.input`
  display: none;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #2a9d8f;
  @media (min-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;
