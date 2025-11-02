import React, { useEffect, useState } from 'react';
import {
  FaHome, FaRegFileAlt, FaUser, FaCog
} from 'react-icons/fa';

const NAV = [
  { label: "Dashboard", icon: <FaHome size={20}/>, href: "/dashboard", gradient: "from-orange-400 via-pink-400 to-purple-400" },
  { label: "Complaints", icon: <FaRegFileAlt size={20}/>, href: "/complaints", gradient: "from-yellow-300 via-pink-400 to-purple-400" },
  { label: "Users", icon: <FaUser size={20}/>, href: "/users", gradient: "from-green-400 via-blue-400 to-purple-400" },
  { label: "Settings", icon: <FaCog size={20}/>, href: "/settings", gradient: "from-purple-400 via-pink-400 to-orange-300" }
];

const Navbar = () => {
  const [fullname, setFullname] = useState(null);

  useEffect(() => {
    const storedFullname = localStorage.getItem("fullname");
    if (storedFullname) setFullname(storedFullname);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace('/');
  };

  if (!fullname) return null;

  return (
    <nav className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-white text-xl md:text-2xl font-bold">
            Grievance Portal
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm hidden sm:block">
              Welcome, {fullname}
            </span>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Logout
            </button>
          </div>
        </div>
        {/* Gradient Icon Nav */}
        <div className="flex gap-5 justify-center mt-2 mb-3 flex-wrap">
          {NAV.map(item => (
            <a
              key={item.label}
              href={item.href}
              className={`min-w-[140px] flex items-center justify-center gap-2 text-lg font-bold px-4 py-2 rounded-2xl shadow-md bg-gradient-to-tr ${item.gradient} text-white transition-all hover:scale-105`}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
