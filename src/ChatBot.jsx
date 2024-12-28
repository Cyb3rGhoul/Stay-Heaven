import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, redirect, useNavigate } from "react-router-dom";
import {
    MessageSquare,
    X,
    ChevronUp,
    Send,
    Home,
    Hotel,
    Calendar,
    HeartHandshake,
    Sparkles,
    Map,
    HelpCircle,
    Bot as BotIcon,
    User as UserIcon,
    Gift,
    Bell,
    Compass,
    Lock,
} from "lucide-react";
import axios from "./utils/axios";
import toast from "react-hot-toast";
import useHandleErr from "./utils/useHandleErr";
import socket from "./utils/socket";

const ChatBot = () => {
    const handleError = useHandleErr();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const navigate = useNavigate();
    const [showInitialNotification, setShowInitialNotification] =
        useState(true);
    const messagesEndRef = useRef(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const chatContainerRef = useRef(null);
    const [user, setUser] = useState(
        useSelector((state) => state.user.userData)
    );
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const userData = useSelector((state) => state.user.userData);

    const aiName = "SAGE";
    const aiTagline = "Smart Accommodation Guide & Expert";

    // const quickReplies = [
    //   { id: 1, text: "Luxury Hotels", icon: <Hotel className="w-4 h-4" /> },
    //   { id: 2, text: "Today's Deals", icon: <Gift className="w-4 h-4" /> },
    //   { id: 3, text: "Trip Planning", icon: <Calendar className="w-4 h-4" /> },
    // ];

    // const menuOptions = [
    //   {
    //     id: 1,
    //     text: "Find Hotels",
    //     icon: <Compass className="w-4 h-4" />,
    //     response: "I'd love to help you find the perfect hotel! Could you tell me your destination and preferred dates?"
    //   },
    //   {
    //     id: 2,
    //     text: "Special Offers",
    //     icon: <Sparkles className="w-4 h-4" />,
    //     response: "Let me show you our exclusive deals and special packages!"
    //   },
    //   {
    //     id: 3,
    //     text: "Concierge",
    //     icon: <HeartHandshake className="w-4 h-4" />,
    //     response: "As your personal concierge, I can help with special requests and travel arrangements."
    //   },
    //   {
    //     id: 4,
    //     text: "Travel Guide",
    //     icon: <Map className="w-4 h-4" />,
    //     response: "I can provide personalized recommendations and insights for any destination."
    //   },
    // ];

    useEffect(() => {
        const timer = setTimeout(() => {
            if (showInitialNotification && !isOpen) {
                const notification =
                    document.getElementById("chat-notification");
                notification?.classList.add("animate-bounce");
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [showInitialNotification]);

    const LoginMessage = () => {
        const [showMessage, setShowMessage] = useState(false);
        const [showButton, setShowButton] = useState(false);

        useEffect(() => {
            setTimeout(() => setShowMessage(true), 1000);
            setTimeout(() => setShowButton(true), 2000);
        }, []);

        return (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50 to-white">
                <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                        <BotIcon className="w-5 h-5 text-white" />
                    </div>
                    {!showMessage && (
                        <div className="flex space-x-1 p-3 bg-white rounded-xl w-16 animate-pulse">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                    )}
                    {showMessage && (
                        <div className="bg-white shadow-sm text-gray-800 border border-green-100/50 p-4 rounded-2xl max-w-[80%] animate-fadeIn">
                            <p className="mb-2">
                                Hello! I'm SAGE, your Smart Accommodation Guide
                                & Expert. 🌟
                            </p>
                            <p className="mb-2">
                                To provide you with personalized travel
                                recommendations and exclusive deals, I'll need
                                you to log in first.
                            </p>
                            {showButton && (
                                <div className="mt-4 flex justify-center">
                                    <a
                                        href="/login"
                                        className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2 animate-fadeIn"
                                    >
                                        <Lock className="w-4 h-4" />
                                        <span>Login to Continue</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    useEffect(() => {
        // if (isOpen && messages.length === 0) {
        //   simulateResponse(`Welcome to Stay Heaven! I'm ${aiName} (${aiTagline}), your dedicated travel assistant.\n\n` +
        //     "I'm here to help you with:\n" +
        //     "🏨 Finding your perfect accommodation\n" +
        //     "✨ Exclusive deals and offers\n" +
        //     "🗺️ Destination guides and recommendations\n" +
        //     "🎯 Personalized travel planning\n\n" +
        //     "How may I assist you today?");
        // }
        if (isOpen) {
            setShowInitialNotification(false);
        }
    }, [isOpen]);

    // ... (keeping the existing utility functions)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleScroll = (e) => {
        setShowScrollTop(e.target.scrollTop > 200);
    };

    const scrollToTop = () => {
        chatContainerRef.current?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const simulateResponse = (text) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages((prev) => [...prev, { type: "bot", text }]);
            setIsTyping(false);
        }, 1000);
    };

    const sendMessage = async (message) => {
        try {
            const response = await axios.post(
                "/chatbot/message",
                { message },
                { withCredentials: true }
            );

            let plainTextResponse = response.data.data
                .replace(/\*\*/g, "") // Remove asterisks
                .replace(/::/g, "") // Remove colons
                .replace(/<|>/g, "") // Remove angle brackets

            simulateResponse(plainTextResponse);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        setMessages((prev) => [...prev, { type: "user", text: inputMessage }]);
        setInputMessage("");

        sendMessage(inputMessage);
    };

    const handleQuickReply = (reply) => {
        setMessages((prev) => [...prev, { type: "user", text: reply.text }]);
        simulateResponse(
            `I'll help you explore ${reply.text.toLowerCase()}. What specific features are you looking for?`
        );
    };

    const handleMenuOption = (option) => {
        setMessages((prev) => [...prev, { type: "user", text: option.text }]);
        simulateResponse(option.response);
    };

    function generateUniqueId() {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let uniqueId = "";
        for (let i = 0; i < 10; i++) {
            uniqueId += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        return uniqueId;
    }
    const [totalDays, setTotalDays] = useState(0);
    function setData(checkInDate, checkOutDate, rooms) {
        let days = getDifferenceInDays(
            new Date(checkInDate),
            new Date(checkOutDate)
        );
        if (days == 0) days = 1;
        setTotalDays(days);
    }
    function getDifferenceInDays(date1, date2) {
        const dateObj1 = new Date(date1);
        const dateObj2 = new Date(date2);

        const diffInMs = Math.abs(dateObj2 - dateObj1);

        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        return diffInDays;
    }

    function parseDate(dateString) {
        const [day, month, year] = dateString.split("/").map(Number);
        return new Date(year, month - 1, day); // month is zero-indexed in JavaScript Date
    }

    function getDifferenceInDaysFormatted(date1, date2) {
        const dateObj1 = parseDate(date1);
        const dateObj2 = parseDate(date2);

        const diffInMs = Math.abs(dateObj2 - dateObj1);
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        return diffInDays;
    }
    const handlePay = async (
        checkInDate,
        checkOutDate,
        guestNames,
        rooms,
        totalDays,
        hotelId
    ) => {
        try {
            guestNames = guestNames.map((guests) => {
                if (guests.name.indexOf(" ") > -1) {
                    let firstName = guests.name.split(" ")[0];
                    let lastName = guests.name.split(" ")[1];
                    return {
                        firstName,
                        lastName,
                        phoneNumber: guests.phoneNumber,
                    };
                }
                return {
                    firstName: guests.name,
                    lastName: ".",
                    phoneNumber: guests.phoneNumber,
                };
            });
            const uniqueId = generateUniqueId();
            const {
                data: {
                    data: { order },
                },
            } = await axios.post(
                `/payment/checkout/${uniqueId}`,
                {
                    rooms,
                    days: totalDays,
                    hotelId,
                },
                { withCredentials: true }
            );
            const {
                data: {
                    data: { key },
                },
            } = await axios.post(
                `/payment/getkey/${uniqueId}`,
                { userId: user._id, guestNames, checkInDate, checkOutDate },
                { withCredentials: true }
            );

            var options = {
                key,
                amount: order.amount,
                currency: "INR",
                name: "Stay Heaven",
                image: "https://res.cloudinary.com/djsdjtkyu/image/upload/v1725702771/cuktnsvqx7fstqfsxb4p.png",
                order_id: order.id,
                callback_url:
                    import.meta.env.VITE_BACKEND_URL +
                    `/payment/paymentverification/${uniqueId}`,
                modal: {
                    ondismiss: function () {
                        window.location.href = "/fail";
                    },
                },
                prefill: {
                    name: user.fullName,
                    email: user.email,
                    contact: user.phoneNumber,
                },

                theme: {
                    color: "#4CAF50",
                },
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (e) {
            handleError(e);
        }
    };

    useEffect(() => {
        socket.on("call_from_chatbot", (data) => {
            let totalDays = getDifferenceInDaysFormatted(
                data.checkindate,
                data.checkoutdate
            );
            // if (typeof data.guestdetails === "object") {
            //     data.guestdetails = [data.guestdetails];
            // }
            handlePay(
                data.checkindate,
                data.checkoutdate,
                data.guestdetails,
                data.rooms,
                totalDays,
                data.id
            );
        });

        return () => {
            socket.off("call_from_chatbot");
        };
    }, []);
    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Initial Notification */}
            {showInitialNotification && !isOpen && (
                <div
                    id="chat-notification"
                    className="absolute bottom-20 right-0 bg-white p-4 rounded-lg shadow-lg mb-4 w-72 transform transition-all duration-300"
                >
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                                <BotIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                                {aiName} at your service!
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Let me help you plan your perfect stay.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowInitialNotification(false)}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-500"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${
                    isOpen ? "hidden" : "flex"
                } items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 group relative`}
            >
                <MessageSquare className="w-7 h-7 group-hover:scale-110 transition-transform" />
                {showInitialNotification && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-pulse" />
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-4 right-4 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col animate-slideIn">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-t-2xl">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <BotIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">
                                    {aiName}
                                </h3>
                                <p className="text-green-50 text-xs">
                                    {aiTagline}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {isLoggedIn ? (
                        <>
                            <div
                                ref={chatContainerRef}
                                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50 to-white"
                                onScroll={handleScroll}
                            >
                                {/* Menu Options */}
                                {/* <div className="grid grid-cols-2 gap-2 mb-4">
                  {menuOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleMenuOption(option)}
                      className="p-3 text-sm bg-white rounded-xl hover:bg-green-50 transition-all duration-300 text-gray-700 shadow-sm hover:shadow-md flex items-center space-x-2 border border-green-100/50"
                    >
                      <span className="text-emerald-600">{option.icon}</span>
                      <span>{option.text}</span>
                    </button>
                  ))}
                </div> */}

                                {/* Messages */}
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${
                                            message.type === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        <div className="flex items-start space-x-2 max-w-[80%]">
                                            {message.type === "bot" && (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                                                    <BotIcon className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                            <div
                                                className={`p-3 rounded-2xl ${
                                                    message.type === "user"
                                                        ? "bg-gradient-to-r from-emerald-500 to-green-400 text-white"
                                                        : "bg-white shadow-sm text-gray-800 border border-green-100/50"
                                                } animate-fadeIn whitespace-pre-line`}
                                            >
                                                {message.text}
                                            </div>
                                            {message.type === "user" && (
                                                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                                                    <UserIcon className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                                            <BotIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex space-x-1 p-3 bg-white rounded-xl w-16 animate-pulse">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Replies */}
                            {/* <div className="p-2 border-t bg-white">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {quickReplies.map(reply => (
                    <button
                      key={reply.id}
                      onClick={() => handleQuickReply(reply)}
                      className="flex-shrink-0 px-4 py-2 bg-green-50 rounded-full text-sm hover:bg-green-100 transition-all duration-300 shadow-sm hover:shadow flex items-center space-x-2 text-emerald-700"
                    >
                      <span className="text-emerald-600">{reply.icon}</span>
                      <span>{reply.text}</span>
                    </button>
                  ))}
                </div>
              </div> */}

                            {/* Input Area */}
                            <div className="p-4 border-t bg-white rounded-b-2xl">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) =>
                                            setInputMessage(e.target.value)
                                        }
                                        onKeyPress={(e) =>
                                            e.key === "Enter" &&
                                            handleSendMessage()
                                        }
                                        placeholder="Ask me anything about your stay..."
                                        className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/50"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputMessage.trim()}
                                        className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <LoginMessage />
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatBot;
