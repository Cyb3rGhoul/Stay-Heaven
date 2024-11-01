import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
    Mail,
    Lock,
    User,
    Phone,
    ArrowRight,
    Eye,
    EyeOff,
    Camera,
} from "lucide-react";
import axios from "./utils/axios";
import useHandleErr from "./utils/useHandleErr";
import { TbPasswordMobilePhone } from "react-icons/tb";
import toast from "react-hot-toast";
import Preloader from "./Preloader";

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        fullname: "",
        phone: "",
    });
    const [avatar, setAvatar] = useState(null);
    const [showAvatar, setShowAvatar] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const avatarRef = useRef(null);
    const handleError = useHandleErr();
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpEntered, setOtpEntered] = useState("");
    const [loading, setLoading] = useState(false);
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setShowAvatar(URL.createObjectURL(file));
            setIsFileSelected(true);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const sendOTP = async () => {
        if (!formData.email) {
            toast.error("Please enter email");
            return;
        }
        try {
            const response = await axios.post("/user/send-otp", {
                email: formData.email,
            });
            if (response.data.statusCode === 200) {
                setOtp(response.data.data.otp);
                toast.success("OTP sent successfully");
            }
        } catch (error) {
            handleError(error);
        }
    };

    const verifyOTP = async () => {
        if (otpEntered != otp) {
            toast.error("OTP entered is incorrect");
            return;
        }
        setOtpVerified(true);
        toast.success("OTP verified successfully");
    };

    const validateForm = () => {
        if (!avatar) {
            toast.error("Please upload a profile picture");
            return false;
        }

        if (!formData.fullname.trim()) {
            toast.error("Please enter your full name");
            return false;
        }

        if (!formData.username.trim()) {
            toast.error("Please enter a username");
            return false;
        }

        if (!formData.email.trim()) {
            toast.error("Please enter your email address");
            return false;
        }

        if (!otpVerified) {
            toast.error("Please verify your email with OTP");
            return false;
        }

        if (!formData.phone.trim()) {
            toast.error("Please enter your phone number");
            return false;
        }

        if (!formData.password) {
            toast.error("Please enter a password");
            return false;
        }

        // Basic password strength validation
        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return false;
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        // Basic phone number validation (assuming 10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error("Please enter a valid 10-digit phone number");
            return false;
        }

        return true;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        setLoading(true);
        setIsLoading(true);

        try {
            const formdata = new FormData();
            formdata.append("file", avatar);
            formdata.append(
                "upload_preset",
                import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
            );
            formdata.append(
                "cloud_name",
                import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
            );

            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${
                    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
                }/image/upload`,
                formdata
            );

            const avatarUrl = response.data.secure_url;

            await axios.post("/user/register", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                avatar: avatarUrl,
                fullName: formData.fullname,
                phoneNumber: formData.phone,
            });

            toast.success("Account created successfully!");
            navigate("/login");
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    };

    return loading ? (
        <Preloader />
    ) : (
        <PageWrapper>
            <SignUpCard>
                <CardHeader>
                    <Title>Create Account</Title>
                </CardHeader>

                <AvatarWrapper onClick={() => avatarRef.current.click()}>
                    {showAvatar ? (
                        <AvatarImage src={showAvatar} alt="Profile" />
                    ) : (
                        <AvatarPlaceholder>
                            <Camera size={24} color="#666" />
                        </AvatarPlaceholder>
                    )}
                    <AvatarOverlay>
                        <span>Upload Photo</span>
                    </AvatarOverlay>
                    <HiddenInput
                        ref={avatarRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                </AvatarWrapper>

                <Form onSubmit={handleSignUp}>
                    <InputGroup>
                        <InputWrapper>
                            <IconWrapper>
                                <User size={20} color="#666" />
                            </IconWrapper>
                            <Input
                                type="text"
                                name="fullname"
                                placeholder="Full Name"
                                value={formData.fullname}
                                onChange={handleInputChange}
                            />
                        </InputWrapper>
                    </InputGroup>

                    <InputGroup>
                        <InputWrapper>
                            <IconWrapper>
                                <User size={20} color="#666" />
                            </IconWrapper>
                            <Input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        </InputWrapper>
                    </InputGroup>

                    <div className="flex justify-between">
                        <InputGroup className="w-4/6">
                            <InputWrapper>
                                <IconWrapper>
                                    <Mail size={20} color="#666" />
                                </IconWrapper>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </InputWrapper>
                        </InputGroup>

                        <div
                            onClick={sendOTP}
                            className="btn max-sm:scale-75 bg-green-500 text-white hover:bg-green-600"
                        >
                            Send OTP
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <InputGroup className="w-4/6">
                            <InputWrapper>
                                <IconWrapper>
                                    <TbPasswordMobilePhone
                                        size={20}
                                        color="#666"
                                    />
                                </IconWrapper>
                                <Input
                                    type="text"
                                    name="email-otp"
                                    placeholder="Enter OTP"
                                    onChange={(e) =>
                                        setOtpEntered(e.target.value)
                                    }
                                />
                            </InputWrapper>
                        </InputGroup>
                        <div
                            onClick={verifyOTP}
                            className="btn max-sm:scale-75 bg-green-500 text-white hover:bg-green-600"
                        >
                            Verify
                        </div>
                    </div>
                    <InputGroup>
                        <InputWrapper>
                            <IconWrapper>
                                <Phone size={20} color="#666" />
                            </IconWrapper>
                            <Input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </InputWrapper>
                    </InputGroup>

                    <InputGroup>
                        <InputWrapper>
                            <IconWrapper>
                                <Lock size={20} color="#666" />
                            </IconWrapper>
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <EyeButton
                                type="button"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <Eye size={20} color="#666" />
                                ) : (
                                    <EyeOff size={20} color="#666" />
                                )}
                            </EyeButton>
                        </InputWrapper>
                    </InputGroup>

                    <SignUpButton type="submit" disabled={isLoading}>
                        <span>Create Account</span>
                        <ArrowIconWrapper>
                            <ArrowRight size={20} />
                        </ArrowIconWrapper>
                    </SignUpButton>

                    <Divider>
                        <DividerLine />
                        <DividerText>or</DividerText>
                        <DividerLine />
                    </Divider>

                    <LoginLink type="button" onClick={() => navigate("/login")}>
                        <span>Already have an account? Sign In</span>
                    </LoginLink>
                </Form>
            </SignUpCard>
        </PageWrapper>
    );
};

export default SignUp;

// Animations
const bounceX = keyframes`
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(3px); }
`;

const scaleUp = keyframes`
    0% { transform: scale(1); }
    100% { transform: scale(1.02); }
`;

// Styled Components
const PageWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%);
`;

const SignUpCard = styled.div`
    width: 100%;
    max-width: 28rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 2rem;
    transition: transform 0.3s ease;
`;

const CardHeader = styled.div`
    text-align: center;
    margin-bottom: 1rem;
`;

const Title = styled.h2`
    color: #166534;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
`;

const AvatarWrapper = styled.div`
    width: 100px;
    height: 100px;
    margin: 0 auto 2rem;
    position: relative;
    cursor: pointer;
    border-radius: 50%;
    overflow: hidden;
`;

const AvatarImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const AvatarPlaceholder = styled.div`
    width: 100%;
    height: 100%;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const AvatarOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
    color: white;
    font-size: 0.875rem;

    ${AvatarWrapper}:hover & {
        opacity: 1;
    }
`;

const HiddenInput = styled.input`
    display: none;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const InputWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const IconWrapper = styled.div`
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.2s ease;
    background: rgba(255, 255, 255, 0.9);
    padding-right: ${(props) => (props.type === "password" ? "3rem" : "1rem")};

    &:focus {
        outline: none;
        border-color: #22c55e;
        box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
        background: white;
    }

    &:hover {
        background: white;
    }
`;

const EyeButton = styled.button`
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.7;
    }

    &:focus {
        outline: none;
    }
`;

const SignUpButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: #22c55e;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #16a34a;
    }

    &:active {
        transform: scale(0.98);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ArrowIconWrapper = styled.span`
    animation: ${bounceX} 1s infinite;
`;

const Divider = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 0.25rem 0;
`;

const DividerLine = styled.div`
    flex: 1;
    height: 1px;
    background: #e5e7eb;
`;

const DividerText = styled.span`
    color: #666;
    font-size: 0.875rem;
`;

const LoginLink = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #16a34a;

    &:hover {
        background: #f9fafb;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
`;
