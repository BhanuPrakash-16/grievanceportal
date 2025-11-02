import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaHome, FaPlusSquare, FaRegFileAlt, FaUser,
  FaRegClock, FaCheckCircle, FaSearch
} from "react-icons/fa";
import { getSession } from "./api";

// Complaint status stepper (no change)
function ComplaintStepper({ timeline }) {
  const STEPS = [
    { icon: <FaRegClock />, label: "Complaint Submitted", status: "Complaint Submitted" },
    { icon: <FaSearch />, label: "Under Review", status: "Under Review" },
    { icon: <FaCheckCircle />, label: "Resolved", status: "Resolved" },
  ];
  function getStepData(status) {
    return timeline.find(step => step.status === status);
  }
  return (
    <div className="mb-8">
      {STEPS.map((step, idx) => {
        const data = getStepData(step.status);
        return (
          <div className="flex items-start relative mb-6" key={step.status}>
            <div className="mt-1 z-10">
              <span
                className={`h-7 w-7 flex items-center justify-center rounded-full
                ${step.status === "Resolved"
                  ? "bg-green-100 text-green-600"
                  : step.status === "Under Review"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-700"
                  }`}
              >
                {step.icon}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className="absolute left-3 top-8 w-0.5 h-8 bg-gray-300 z-0"></div>
            )}
            <div className="ml-6">
              <div className="font-semibold">{step.label}</div>
              <div className="text-xs text-gray-500">{data ? data.date : ""}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Complaint detail card (no change)
function ComplaintDetail({ complaint, onBack }) {
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6 mt-8">
      <button
        onClick={onBack}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
      >
        &larr; Back to My Complaints
      </button>
      <div className="mb-4"><span className="text-lg font-bold">Complaint Status</span></div>
      <div className="mb-4 p-6 bg-gray-100 rounded-lg shadow text-center">
        <div className="uppercase text-sm text-gray-500">Status</div>
        <div className="text-2xl font-bold">{complaint.status || "Complaint Submitted"}</div>
      </div>
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        {complaint.category && (
          <span className="inline-block px-3 py-1 rounded-xl bg-yellow-50 text-yellow-600 font-semibold border border-yellow-300 shadow">
            Category: {complaint.category}
          </span>
        )}
        {complaint.priority && (
          <span className={`inline-block px-3 py-1 rounded-xl font-semibold border ${
            complaint.priority === "High"
              ? "bg-red-100 text-red-700 border-red-400"
              : complaint.priority === "Medium"
                ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                : "bg-green-100 text-green-700 border-green-400"
            } shadow`}>
            Priority: {complaint.priority}
          </span>
        )}
      </div>
      <div className="mb-4 font-medium text-blue-600 text-sm">
        Complaint ID: #{complaint.id || "Not Set"}
      </div>
      <ComplaintStepper timeline={complaint.timeline || []} />
      <h3 className="font-bold mb-1">Updates</h3>
      <div>
        {(complaint.timeline || []).slice().reverse().map((ev, i) => (
          <div className="mb-6" key={i}>
            <div className="font-semibold">{ev.comment || ev.status}</div>
            <div className="text-xs text-gray-500">{ev.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Complaintsbox component with auto-detail-open
const Complaintsbox = () => {
  const [username, setUsername] = useState("");
  const [complaintsList, setComplaintsList] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [theme] = useState(localStorage.getItem("appTheme") || "light");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme === "dark" ? "bg-gray-900" : "";
    const crs = getSession("csrid");
    if (!crs) return window.location.replace("/");
    setUsername(getSession("fullname") || "User");
    const complaintsKey = `complaints_${crs}`;
    const stored = window.sessionStorage.getItem(complaintsKey);
    if (stored) setComplaintsList(JSON.parse(stored));
  }, [theme]);

  // Auto-select complaint if coming from dashboard via state
  useEffect(() => {
    if (location.state && location.state.complaintId && complaintsList.length > 0) {
      const idx = complaintsList.findIndex(c => c.id === location.state.complaintId);
      if (idx !== -1) setSelectedIdx(idx);
    }
  }, [location.state, complaintsList]);

  const handleBack = () => setSelectedIdx(null);

  const handleComplaintClick = idx => setSelectedIdx(idx);

  const handleLogout = () => {
    window.sessionStorage.clear();
    window.location.replace("/login");
  };

  return (
    <>
      {/* Fixed Gradient Header */}
      <header className="w-full h-[60px] flex items-center justify-between px-5 sm:px-8 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 shadow fixed top-0 z-10">
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide">
          Grievance Portal
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-white text-sm sm:text-base mr-2">Welcome, {username || "User"}</span>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-pink-400 via-orange-400 to-pink-600 text-white font-semibold px-4 py-2 rounded-full shadow hover:from-pink-500 hover:to-orange-500"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content -- Responsive Center */}
      <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50"} min-h-screen w-full flex justify-center items-center pt-[72px] pb-32`}>
        <div className="w-full flex flex-col items-center justify-center">
          {selectedIdx !== null
            ? (
              <ComplaintDetail
                complaint={complaintsList[selectedIdx]}
                onBack={handleBack}
              />
            )
            : (
              <div
                className="
                  w-full
                  max-w-[355px] xs:max-w-[370px] sm:max-w-[400px]
                  md:max-w-[440px] lg:max-w-[470px] xl:max-w-[500px] 2xl:max-w-[520px]
                  bg-white/90 backdrop-blur-md rounded-3xl shadow-xl flex flex-col
                  p-6 md:p-8 min-h-[420px] my-8 items-center justify-center
                "
              >
                <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center">
                  My Complaints
                </h2>
                {/* Complaint List */}
                <div className="w-full flex flex-col justify-center items-center">
                  {complaintsList.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10 italic text-sm md:text-base">
                      No complaints found.
                    </div>
                  ) : (
                    complaintsList.map((complaint, idx) => (
                      <div
                        key={idx}
                        className="w-full bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleComplaintClick(idx)}
                      >
                        <div className="flex flex-wrap gap-3 items-start">
                          <div>
                            <div className="mb-2 text-sm text-gray-800">
                              <strong className="font-semibold text-blue-500">Subject:</strong>{" "}
                              {complaint.subject}
                            </div>
                            <div className="mb-2 text-sm text-gray-800">
                              <strong className="font-semibold text-blue-500">Status:</strong>{" "}
                              {complaint.status || "Complaint Submitted"}
                            </div>
                            <div className="mb-2 text-sm text-gray-800">
                              <strong className="font-semibold text-blue-500">Submission Type:</strong>{" "}
                              {complaint.submissionType}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {complaint.category && (
                              <span className="inline-block px-3 py-1 rounded-xl bg-yellow-50 text-yellow-600 font-semibold border border-yellow-300 shadow">
                                {complaint.category}
                              </span>
                            )}
                            {complaint.priority && (
                              <span className={`inline-block px-3 py-1 rounded-xl font-semibold border ${
                                complaint.priority === "High"
                                  ? "bg-red-100 text-red-700 border-red-400"
                                  : complaint.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                                    : "bg-green-100 text-green-700 border-green-400"
                                } shadow`}>
                                {complaint.priority}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mb-2 text-sm text-gray-800">
                          <strong className="font-semibold text-blue-500">Description:</strong>{" "}
                          {complaint.description}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          }
        </div>
      </div>

      {/* Centered, Responsive Pill Bottom Navbar */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2
        w-full max-w-[355px] xs:max-w-[370px] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[470px] xl:max-w-[500px] 2xl:max-w-[520px]
        bg-white/95 border border-gray-200 shadow-xl px-4 py-2 z-50 flex justify-between items-center rounded-full pointer-events-auto">
        <a href="/dashboard" className="flex flex-col items-center text-gray-700 hover:text-blue-600 font-semibold transition-all" style={{ minWidth: 65 }}>
          <FaHome className="text-2xl mb-1" />
          <span className="text-xs">Dashboard</span>
        </a>
        <a href="/complaints" className="flex flex-col items-center text-gray-700 hover:text-yellow-500 font-semibold transition-all" style={{ minWidth: 65 }}>
          <FaPlusSquare className="text-2xl mb-1" />
          <span className="text-xs">Submit</span>
        </a>
        <a href="/mycomplaints" className="flex flex-col items-center text-blue-600 font-bold transition-all" style={{ minWidth: 75 }}>
          <FaRegFileAlt className="text-2xl mb-1" />
          <span className="text-xs">My Complaints</span>
        </a>
        <a href="/profile" className="flex flex-col items-center text-gray-700 hover:text-pink-500 font-semibold transition-all" style={{ minWidth: 65 }}>
          <FaUser className="text-2xl mb-1" />
          <span className="text-xs">Profile</span>
        </a>
      </div>
    </>
  );
};

export default Complaintsbox;
