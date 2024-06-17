import React, { useState } from "react";
import styled from "styled-components";
import profileImage from "./assets/profile.png"; // Replace with actual profile image if available
import randomImage from "./assets/random.jpg"; // Ensure you have a random image in this path

const Profile = () => {
  const [isCreatePlaceOpen, setIsCreatePlaceOpen] = useState(false);

  const toggleCreatePlace = () => {
    setIsCreatePlaceOpen(!isCreatePlaceOpen);
  };

  const handleUpdateProfile = () => {
    alert("Profile updated");
  };

  return (
    <>
      <Container isCreatePlaceOpen={isCreatePlaceOpen}>
        <StyledProfileSection>
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
          <Avatar src={profileImage} alt="Profile Avatar" />
        </StyledProfileSection>
        <Section>
          <SectionHeader>
            <Title>Previous Booking</Title>
          </SectionHeader>
          <ScrollableContainer>
            <BookingCard>
              <Image src={randomImage} alt="Booking" />
              <Description>
                <p>Description</p>
                <p>Guest</p>
                <p>Address</p>
                <p>Amount</p>
              </Description>
            </BookingCard>
            <BookingCard>
              <Image src={randomImage} alt="Booking" />
              <Description>
                <p>Description</p>
                <p>Guest</p>
                <p>Address</p>
                <p>Amount</p>
              </Description>
            </BookingCard>
            {/* Add more BookingCards as needed */}
          </ScrollableContainer>
        </Section>
        <Section>
          <SectionHeader>
            <Title>My Created Places</Title>
            <CreatePlaceButton onClick={toggleCreatePlace}>
              Create Place
            </CreatePlaceButton>
          </SectionHeader>
          <ScrollableContainer>
            <BookingCard>
              <Image src={randomImage} alt="Created Place" />
              <Description>
                <p>Description</p>
                <p>Guest</p>
                <p>Address</p>
                <p>Amount</p>
              </Description>
            </BookingCard>
            <BookingCard>
              <Image src={randomImage} alt="Created Place" />
              <Description>
                <p>Description</p>
                <p>Guest</p>
                <p>Address</p>
                <p>Amount</p>
              </Description>
            </BookingCard>
            {/* Add more BookingCards as needed */}
          </ScrollableContainer>
          {isCreatePlaceOpen && (
            <CreatePlaceFormOverlay>
              <CreatePlaceForm>
                <CloseButton onClick={toggleCreatePlace}>✖</CloseButton>
                <Label>Image</Label>
                <Input type="file" />
                <Label>Title</Label>
                <Input type="text" />
                <Label>Address</Label>
                <Input type="text" />
                <Label>Contact Number</Label>
                <Input type="tel" />
                <Label>Facilities Available</Label>
                <Input type="text" />
                <Label>Amount</Label>
                <Input type="number" />
                <Label>Other Details</Label>
                <Input type="text" />
                <SubmitButton>Submit</SubmitButton>
              </CreatePlaceForm>
            </CreatePlaceFormOverlay>
          )}
        </Section>
      </Container>
    </>
  );
};

export default Profile;


const Container = styled.div`
  padding: 20px;
  background-color: #f0f0f0;
  color: #333;
`;

const StyledProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #d4f3c2;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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
  max-width: 300px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;


const UpdateButton = styled.button`
  width: 100%;
  max-width: 300px;
  padding: 10px;
  background-color: #2a9d8f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
`;

const Avatar = styled.img`
  width: 150px; /* Increased width for larger profile image */
  height: 150px; /* Increased height for larger profile image */
  border-radius: 50%;
  border: 2px solid #2a9d8f;
  @media (min-width: 768px) {
    width: 200px; /* Further increase width for larger screens */
    height: 200px; /* Further increase height for larger screens */
  }
`;

const Section = styled.div`
  margin-top: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ScrollableContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding: 10px;
`;

const BookingCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #fff;
`;

const Image = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const Description = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #333;
`;

const CreatePlaceButton = styled.button`
  padding: 10px;
  background-color: #2a9d8f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CreatePlaceFormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const CreatePlaceForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: #2a9d8f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
`;
