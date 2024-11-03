import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from './Navbar';
import { FiGrid, FiPlusCircle, FiClipboard, FiHome, FiCalendar } from 'react-icons/fi';

const navItems = [
  { path: '/seller/dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { path: '/seller/requests', label: 'Create Hotel', icon: <FiPlusCircle /> },
  { path: '/seller/order-requests', label: 'Pending Order Requests', icon: <FiClipboard /> },
  { path: '/seller/hotels', label: 'Hotels', icon: <FiHome /> },
  { path: '/seller/bookings', label: 'Bookings', icon: <FiCalendar /> },
];

const SellerNavbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1100);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <>
      <Navbar />
      <div className={`fixed z-[3] top-[8vh] left-0 h-[92vh] bg-white shadow-2xl transition-all duration-300 ${isMobile ? 'w-20 pl-3 pr-1' : 'w-1/5'}`}>
        <div className={`flex flex-col justify-evenly h-full p-2 ${isMobile ? 'items-center' : 'p-4 space-y-4'}`}>
          {navItems?.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center ${isMobile ? 'justify-center' : 'gap-4'} hover:bg-gradient-to-r from-green-400 to-green-600 hover:text-white transition-all duration-500 ${isMobile ? 'p-2' : 'px-4 py-3'} rounded-lg shadow-md ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500 to-green-700 text-white'
                    : 'bg-gray-100'
                }`
              }
              title={item.label}
            >
              <div className={`${isMobile ? 'p-2' : 'p-3'} bg-green-600/20 rounded-lg backdrop-blur-lg shadow-lg`}>
              {item.icon}
              </div>
              {!isMobile && <h2 className="text-lg font-semibold">{item.label}</h2>}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default SellerNavbar;