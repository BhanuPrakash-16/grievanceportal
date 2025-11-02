// components/OfficerProfile.jsx
import React from "react";
import OfficerNavbar from "./OfficerNavbar";

// This should be dynamically fetched! Demo static info for UI
const officerInfo = {
  name: "Officer Sarah Mitchell",
  id: "OFF12345",
  dept: "Public Works",
  email: "officer.mitchell@civic.gov"
};

export default function OfficerProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pb-12">
      <OfficerNavbar />
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8 mt-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img src="https://i.pravatar.cc/120" alt="Officer" className="rounded-full w-32 h-32 border-4 shadow" />
          <div>
            <h1 className="text-3xl font-bold text-purple-800 mb-1">{officerInfo.name}</h1>
            <div className="flex items-center text-gray-700 mb-2">
              <span className="font-bold text-lg mr-2">#{officerInfo.id}</span>
            </div>
            <div className="mb-2"><span className="font-semibold">Department:</span> {officerInfo.dept}</div>
            <div className="mb-4"><span className="font-semibold">Email:</span> {officerInfo.email}</div>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 transition">Change Password</button>
              <button className="bg-gray-200 text-gray-900 px-4 py-2 rounded font-semibold hover:bg-pink-300 transition">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
