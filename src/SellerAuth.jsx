import React from "react";
import styled from "styled-components";

const SellerFormPage = () => {
  return (
    <Container>
      <FormWrapper>
        <Title>Become a Seller</Title>
        <Form>
          <InputField>
            <Input type="text" required />
            <Label>First Name</Label>
          </InputField>
          <InputField>
            <Input type="text" required />
            <Label>Last Name</Label>
          </InputField>
          <InputField>
            <Input type="text" required />
            <Label>Mobile Number</Label>
          </InputField>
          <InputField>
            <Input type="text" required />
            <Label>Address</Label>
          </InputField>
          <div className="mb-4">
            <label className="block text-gray-700">Upload Aadhar Card (Images)</label>
            <input
              type="file"
              accept=".jpg, .jpeg, .png"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Upload Property Paper (Images)</label>
            <input
              type="file"
              accept=".jpg, .jpeg, .png"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              multiple
            />
          </div>
          <SubmitButton>Verify</SubmitButton>
        </Form>
      </FormWrapper>
    </Container>
  );
};

export default SellerFormPage;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f8ff;
  padding: 20px;
`;

const FormWrapper = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #027148;
  text-align: center;
  margin-top: -10px;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputField = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  padding: 0 15px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 6px;
  outline: none;
  background: transparent;
  color: #333;
  transition: border 0.3s;

  &:focus {
    border-color: #05ed98;
  }

  &:focus ~ label,
  &:valid ~ label {
    top: 0;
    left: 15px;
    font-size: 14px;
    background: #fff;
    padding: 0 5px;
    color: #05ed98;
  }
`;

const Label = styled.label`
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  font-size: 16px;
  color: #aaa;
  pointer-events: none;
  transition: 0.3s;
`;

const FileUpload = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FileLabel = styled.label`
  font-size: 16px;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FileInput = styled.input`
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  padding: 12px 20px;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;
