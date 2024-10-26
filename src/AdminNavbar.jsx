import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from './Navbar';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Building2, 
  Trash2,
  Users,
  UserPlus,
  CalendarCheck
} from 'lucide-react';

const navItems = [
  { 
    path: '/admin/dashboard', 
    label: 'Dashboard', 
    icon: <LayoutDashboard className="w-6 h-6" /> // Dashboard layout icon
  },
  { 
    path: '/admin/hotel-requests', 
    label: 'Hotel Requests', 
    icon: <ClipboardCheck className="w-6 h-6" /> // Checklist icon for requests
  },
  { 
    path: '/admin/hotels', 
    label: 'Hotels', 
    icon: <Building2 className="w-6 h-6" /> // Building icon for hotels
  },
  { 
    path: '/admin/hotels-delete-request', 
    label: 'Hotel Delete Request', 
    icon: <Trash2 className="w-6 h-6" /> // Trash icon for deletion requests
  },
  { 
    path: '/admin/users', 
    label: 'Users', 
    icon: <Users className="w-6 h-6" /> // Multiple users icon
  },
  { 
    path: '/admin/become-seller', 
    label: 'Seller Requests', 
    icon: <UserPlus className="w-6 h-6" /> // Add user icon for seller requests
  },
  { 
    path: '/admin/Bookings', 
    label: 'Bookings', 
    icon: <CalendarCheck className="w-6 h-6" /> // Calendar with check for bookings
  },
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

export default AdminNavbar;