erimport React from "react";
import styled from "styled-components";

const MaxGuestsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  label {
    font-size: 18px;
    color: #333;
  }
`;

const GuestInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const GuestButton = styled.button`
  background-color: #4caf50;
  border: 1px solid #4caf50;
  border-radius: 5px;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  padding: 1px 1px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const GuestInput = styled.input`
  width: 50px;
  text-align: center;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const MaxGuests = ({ maxGuests, setMaxGuests }) => {
  const handleIncrement = () => {
    if (maxGuests < 10) {
      setMaxGuests(maxGuests + 1);
    }
  };

  const handleDecrement = () => {
    if (maxGuests > 1) {
      setMaxGuests(maxGuests - 1);
    }
  };

  return (
    <MaxGuestsContainer>
      <label>Max Guests:</label>
      <GuestInputContainer>
        <GuestButton onClick={handleDecrement}>-</GuestButton>
        <GuestInput type="number" value={maxGuests} readOnly />
        <GuestButton onClick={handleIncrement}>+</GuestButton>
      </GuestInputContainer>
    </MaxGuestsContainer>
  );
};

export default MaxGuests;
