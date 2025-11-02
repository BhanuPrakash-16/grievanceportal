// components/OfficerNavbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function OfficerNavbar() {
  const location = useLocation();
  const navItems = [
    { path: "/officerdashboard", label: "Dashboard" },
    { path: "/officercomplaints", label: "Complaints" },
    { path: "/officerprofile", label: "Profile" },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-800 via-pink-700 to-indigo-900 py-4 px-8 flex items-center justify-between">
      <div className="text-2xl font-bold text-white drop-shadow">Officer Dashboard</div>
      <div className="flex space-x-8 items-center">
        {navItems.map(item => 
          <Link key={item.path}
            to={item.path}
            className={`font-semibold ${location.pathname === item.path ? "text-yellow-400 underline" : "text-white hover:text-yellow-300"}`}>
            {item.label}
          </Link>
        )}
        <button
          onClick={()=>window.location.replace("/login")}
          className="ml-6 text-pink-200 font-semibold px-4 py-1 rounded hover:bg-pink-600 hover:text-white transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
