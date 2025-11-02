import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaRegFileAlt, FaUserShield, FaCog } from "react-icons/fa";

const AdminBottomNav = () => (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-auto z-50">
    <div className="flex gap-6 justify-center items-center">
      <Link
        to="/admin"
        className="w-[120px] h-[48px] rounded-2xl flex flex-col justify-center items-center shadow-xl font-bold text-white text-base transition-transform duration-300 transform hover:scale-105"
        style={{ background: "linear-gradient(135deg, #f97316, #f43f5e 60%, #6366f1)" }}
      >
        <FaHome size={20} className="mb-0.5" />
        Dashboard
      </Link>
      <Link
        to="/admin/complaints"
        className="w-[120px] h-[48px] rounded-2xl flex flex-col justify-center items-center shadow-xl font-bold text-white text-base transition-transform duration-300 transform hover:scale-105"
        style={{ background: "linear-gradient(135deg, #fbbf24, #ec4899 60%, #3b82f6)" }}
      >
        <FaRegFileAlt size={20} className="mb-0.5" />
        Complaints
      </Link>
      <Link
        to="/admin/users"
        className="w-[120px] h-[48px] rounded-2xl flex flex-col justify-center items-center shadow-xl font-bold text-white text-base transition-transform duration-300 transform hover:scale-105"
        style={{ background: "linear-gradient(135deg, #10b981, #06b6d4 60%, #8b5cf6)" }}
      >
        <FaUserShield size={20} className="mb-0.5" />
        Users
      </Link>
      <Link
        to="/admin/settings"
        className="w-[120px] h-[48px] rounded-2xl flex flex-col justify-center items-center shadow-xl font-bold text-white text-base transition-transform duration-300 transform hover:scale-105"
        style={{ background: "linear-gradient(135deg, #a21caf, #f59e42 60%, #f472b6)" }}
      >
        <FaCog size={20} className="mb-0.5" />
        Settings
      </Link>
    </div>
  </div>
);

export default AdminBottomNav;
