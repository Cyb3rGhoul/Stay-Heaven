import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from './Navbar';
import dashboard from './assets/adminnav/dashboard.png';
import requests from './assets/adminnav/requests.png';
import hotels from './assets/adminnav/hotel.png';
import users from './assets/adminnav/users.png';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: dashboard },
  { path: '/admin/requests', label: 'Requests', icon: requests },
  { path: '/admin/hotels', label: 'Hotels', icon: hotels },
  { path: '/admin/users', label: 'Users', icon: users },
  { path: '/admin/Bookings', label: 'Bookings', icon: users },
];

const AdminNavbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <>
      <Navbar />
      <div className={`fixed top-[8vh] left-0 h-[92vh] bg-white shadow-xl transition-all duration-300 ${isMobile ? 'w-20 pl-3 pr-1' : 'w-1/5'}`}>
        <div className={`flex flex-col justify-evenly h-full p-2 ${isMobile ? 'items-center' : 'p-4 space-y-4'}`}>
          {navItems.map((item) => (
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
              <img className={`${isMobile ? 'h-4' : 'h-6'} w-6`} src={item.icon} alt={item.label} />
              </div>
              {!isMobile && <h2 className="text-lg font-semibold">{item.label}</h2>}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;