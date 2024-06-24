import React, { useState } from "react";
import styled from "styled-components";
import profileImage from "./assets/profile.png";

const Profile = () => {
  const [selectedImage, setSelectedImage] = useState(profileImage);

  const handleUpdateProfile = () => {
    alert("Profile updated");
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <>
      <Container>
        <StyledProfileSection>
          <AvatarContainer>
            <Avatar src={selectedImage} alt="Profile Avatar" />
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
            <Input type="text" defaultValue="Harry" />
            <Label>Email Address</Label>
            <Input type="email" defaultValue="Kuchbhi@gmail.com" />
            <Label>Phone Number</Label>
            <Input type="tel" defaultValue="9999999999" />
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
