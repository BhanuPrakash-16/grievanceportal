import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import AdminComplaints from './components/AdminComplints'; // Check filename spelling!
import AdminUsers from './components/AdminUsers';
import AdminSettings from './components/AdminSettings';
import Dashboard from './components/Dashboard';
import Complaints from './components/Complaints';
import Complaintsbox from './components/Complaintsbox';
import Profile from './components/Profile';

// Officer portal pages:
import OfficerDashboard from './components/OfficerDashboard';
import OfficerComplaints from './components/OfficerComplaints';
import OfficerProfile from './components/OfficerProfile';

import './index.css';
import ProtectedRoute from './components/ProtectedRoute';

// Header with visible text
const Header = () => (
  <div id="header" className="w-full h-[60px] bg-gradient-to-r from-purple-800 via-pink-700 to-indigo-900 flex items-center justify-between px-5 border-b-2 border-pink-500">
    <div className="text-xl font-bold text-white drop-shadow-sm">
      Grievance & Feedback Management System
    </div>
    <div className="flex items-center">
      <Link
        to="/login"
        className="text-yellow-200 text-sm font-semibold cursor-pointer hover:text-white hover:underline mr-2"
        style={{ userSelect: 'none' }}
      >
        signIn
      </Link>
      <img
        className="w-6 h-6 cursor-pointer"
        src="user.png"
        alt="Sign In"
        onClick={() => (window.location = '/login')}
      />
    </div>
  </div>
);

// Landing page ("/")
const Landing = () => (
  <>
    <Header />
    <div className="w-full h-[calc(100vh-100px)] flex flex-col items-center justify-center text-center bg-gray-100 px-5">
      <div>
        <div className="text-xl sm:text-2xl font-semibold text-gray-800">
          Welcome to Grievance Portal
        </div>
        <Link to="/login" className="text-2xl sm:text-3xl font-bold text-pink-500 mt-2 block hover:underline">
          Login/Signup
        </Link>
      </div>
    </div>
    <div id="footer" className="w-full h-10 bg-white border-t border-gray-300 flex items-center justify-between px-5 absolute bottom-0">
      <label className="text-xs text-gray-500">copyright @ 2024 All rights reserved</label>
      <div className="flex">
        <img className="w-5 h-5 ml-2 drop-shadow-md" src="facebook.png" alt="Facebook" />
        <img className="w-5 h-5 ml-2 drop-shadow-md" src="linkedin.png" alt="LinkedIn" />
        <img className="w-5 h-5 ml-2 drop-shadow-md" src="twitter.png" alt="Twitter" />
      </div>
    </div>
  </>
);

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div id="container" className="w-full h-full m-0 p-0 font-inter bg-gray-100 text-gray-800 overflow-hidden">
          <Routes>
            {/* Main site routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/complaints" element={<AdminComplaints />} />
            <Route path="/admin/complaints/:id" element={<AdminComplaints />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/mycomplaints" element={<Complaintsbox />} />
            <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
            {/* Officer portal routes */}
            <Route path="/officerdashboard" element={<OfficerDashboard />} />
            <Route path="/officercomplaints" element={<OfficerComplaints />} />
            <Route path="/officerprofile" element={<OfficerProfile />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
