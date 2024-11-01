import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import axios from "./utils/axios";
import useHandleErr from "./utils/useHandleErr";
import { useDispatch } from "react-redux";
import { setUser, toggleLogin } from "./app/reducers/userSlice";
import Preloader from "./Preloader";

const Login = () => {
    const navigate = useNavigate();
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const handleError = useHandleErr();
    const dispatch = useDispatch();
    const getUser = async () => {
        try {
            const user = await axios.get("/user/current-user", {
                withCredentials: true,
            });
            if (user) {
                dispatch(toggleLogin(true));
                dispatch(setUser(user.data.data));
            } else {
                dispatch(toggleLogin(false));
                dispatch(setUser({}));
            }
        } catch (error) {
            console.log("");
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoading(true);
        let flag = false;
        try {
            await axios.post(
                "/user/login",
                {
                    identity: emailOrUsername,
                    password,
                },
                {
                    withCredentials: true,
                }
            );
            await getUser();
        } catch (error) {
            handleError(error);
            flag = true;
        } finally {
            setIsLoading(false);
            setLoading(false);
            if (!flag) window.location.href = "/";
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return loading ? (
        <Preloader />
    ) : (
        <PageWrapper>
            <LoginCard>
                <CardHeader>
                    <Title>Welcome Back</Title>
                    <Subtitle>Sign in to your account</Subtitle>
                </CardHeader>
                <Form onSubmit={handleLogin}>
                    <InputGroup>
                        <InputWrapper>
                            <IconWrapper>
                                <Mail size={20} color="#666" />
                            </IconWrapper>
                            <Input
                                type="text"
                                placeholder="Email or Username"
                                value={emailOrUsername}
                                onChange={(e) =>
                                    setEmailOrUsername(e.target.value)
                                }
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
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <EyeButton
                                type="button"
                                onClick={togglePasswordVisibility}
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <Eye size={20} color="#666" />
                                ) : (
                                    <EyeOff size={20} color="#666" />
                                )}
                            </EyeButton>
                        </InputWrapper>
                    </InputGroup>

                    <LoginButton type="submit" disabled={isLoading}>
                        <span>Sign In</span>
                        <ArrowIconWrapper>
                            <ArrowRight size={20} />
                        </ArrowIconWrapper>
                    </LoginButton>

                    <LinksContainer>
                        <LinkButton onClick={() => navigate("/forgotPassword")}>
                            Forgot Password?
                        </LinkButton>
                    </LinksContainer>

                    <Divider>
                        <DividerLine />
                        <DividerText>or continue with</DividerText>
                        <DividerLine />
                    </Divider>

                    <GoogleButton
                        type="button"
                        onClick={() => navigate("/signup")}
                    >
                        <span>Creating your new account</span>
                    </GoogleButton>
                </Form>
            </LoginCard>
        </PageWrapper>
    );
};

export default Login;

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

const LoginCard = styled.div`
    width: 100%;
    max-width: 28rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 2rem;
    transition: transform 0.3s ease;

    &:hover {
        animation: ${scaleUp} 0.3s ease forwards;
    }
`;

const CardHeader = styled.div`
    text-align: center;
    margin-bottom: 2rem;
`;

const Title = styled.h2`
    color: #166534;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
    color: #666;
    font-size: 0.875rem;
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
    padding-right: 3rem;

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

const LoginButton = styled.button`
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

const LinksContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const LinkButton = styled.button`
    color: #16a34a;
    font-size: 0.875rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
        color: #166534;
    }
`;

const Divider = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem 0;
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

const GoogleButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1rem;
    color: green;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #f9fafb;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
`;
