// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from './api';
import {
  FaHome,
  FaPlusSquare,
  FaRegFileAlt,
  FaUser,
} from 'react-icons/fa';

const DashboardNavbar = () => (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-white/95 border border-gray-200 shadow-xl flex items-center justify-between px-2 xs:px-4 sm:px-7 py-2 rounded-full w-full max-w-[97vw] sm:max-w-[480px] md:max-w-[500px] z-50 pointer-events-auto">
    <a href="/dashboard" className="flex flex-col items-center text-blue-600 font-bold transition-all w-1/4">
      <FaHome className="text-xl sm:text-2xl mb-1" />
      <span className="text-xs sm:text-sm">Dashboard</span>
    </a>
    <a href="/complaints" className="flex flex-col items-center text-gray-700 hover:text-yellow-500 font-semibold transition-all w-1/4">
      <FaPlusSquare className="text-xl sm:text-2xl mb-1" />
      <span className="text-xs sm:text-sm">Submit</span>
    </a>
    <a href="/mycomplaints" className="flex flex-col items-center text-gray-700 hover:text-blue-600 font-semibold transition-all relative w-1/4">
      <FaRegFileAlt className="text-xl sm:text-2xl mb-1" />
      <span className="absolute top-0 right-7 h-2 w-2 bg-gray-500 rounded-full border-2 border-white"></span>
      <span className="text-xs sm:text-sm">My Complaints</span>
    </a>
    <a href="/profile" className="flex flex-col items-center text-gray-700 hover:text-pink-500 font-semibold transition-all w-1/4">
      <FaUser className="text-xl sm:text-2xl mb-1" />
      <span className="text-xs sm:text-sm">Profile</span>
    </a>
  </div>
);

function getLatestStatus(complaint) {
  if (complaint.timeline && complaint.timeline.length > 0)
    return complaint.timeline[complaint.timeline.length - 1].status || complaint.status || 'Complaint Submitted';
  return complaint.status || 'Complaint Submitted';
}

const DashboardHeader = ({ username, handleLogout }) => (
  <header className="w-full h-[60px] flex items-center justify-between px-4 sm:px-6 md:px-8 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 shadow fixed top-0 z-10">
    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide">
      Grievance Portal
    </div>
    <div className="flex items-center space-x-2 sm:space-x-3">
      <span className="text-white text-xs sm:text-sm md:text-base mr-2">
        Welcome, {username || "User"}
      </span>
      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-pink-400 via-orange-400 to-pink-600 text-white font-semibold px-3 sm:px-4 py-2 rounded-full shadow hover:from-pink-500 hover:to-orange-500"
      >
        Logout
      </button>
    </div>
  </header>
);

const Dashboard = () => {
  const [username, setUsername] = useState("User");
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [openCount, setOpenCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [avgTime, setAvgTime] = useState(0);

  // THEME
  const [theme] = useState(localStorage.getItem("appTheme") || "light");
  useEffect(() => {
    document.body.className = theme === "dark" ? "bg-gray-900" : "";
  }, [theme]);

  // Load complaints from session storage
  useEffect(() => {
    const name = getSession('username') || "User";
    setUsername(name);
    const csrid = getSession("csrid");
    if (csrid) {
      const complaintsKey = `complaints_${csrid}`;
      const stored = window.sessionStorage.getItem(complaintsKey);
      if (stored) {
        const complaints = JSON.parse(stored);
        let open = 0, resolved = 0, resolveTimes = [];
        complaints.forEach(complaint => {
          const latestStatus = getLatestStatus(complaint);
          if (latestStatus === "Resolved") {
            resolved += 1;
          } else {
            open += 1;
          }
        });
        setOpenCount(open);
        setResolvedCount(resolved);
        setAvgTime(resolveTimes.length > 0 ? (resolveTimes.reduce((s, x) => s + x, 0) / resolveTimes.length).toFixed(1) : 0);
        const sorted = complaints.slice().sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 3);
        setRecentComplaints(sorted);
      }
    }
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    window.sessionStorage.clear();
    window.location.replace("/login");
  };

  // On complaint click, go to /mycomplaints and pass complaintId via state
  const handleComplaintClick = (complaintId) => {
    navigate('/mycomplaints', { state: { complaintId } });
  };

  return (
    <>
      <DashboardHeader username={username} handleLogout={handleLogout} />
      <main className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50"} min-h-screen w-full flex flex-col items-center pt-[72px] pb-28 px-1 sm:px-2 md:px-4`}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent mb-7 mt-5">
          User Dashboard
        </h1>
        <section className="w-full max-w-[370px] xs:max-w-[430px] sm:max-w-[500px] md:max-w-[560px] lg:max-w-[640px] bg-white/85 rounded-3xl shadow-xl p-4 sm:p-7 mb-6 flex flex-col gap-6">
          <div className="text-base sm:text-xl font-extrabold mb-1 text-purple-600">Overview</div>
          <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
            <div className="flex-1 min-w-[88px] max-w-[230px] h-20 sm:h-24 rounded-2xl flex flex-col justify-center items-center shadow-md m-1"
              style={{ background: "linear-gradient(135deg,#f87171,#fbbf24 90%)", color: "#fff" }}>
              <div className="text-sm sm:text-base opacity-80 mb-1">Open Complaints</div>
              <div className="text-xl sm:text-2xl font-extrabold">{openCount}</div>
            </div>
            <div className="flex-1 min-w-[88px] max-w-[230px] h-20 sm:h-24 rounded-2xl flex flex-col justify-center items-center shadow-md m-1"
              style={{ background: "linear-gradient(135deg,#6366f1,#f472b6 85%)", color: "#fff" }}>
              <div className="text-sm sm:text-base opacity-80 mb-1">Resolved Complaints</div>
              <div className="text-xl sm:text-2xl font-extrabold">{resolvedCount}</div>
            </div>
            <div className="flex-1 min-w-[88px] max-w-[230px] h-20 sm:h-24 rounded-2xl flex flex-col justify-center items-center shadow-md m-1"
              style={{ background: "linear-gradient(135deg,#34d399,#818cf8 90%)", color: "#fff" }}>
              <div className="text-sm sm:text-base opacity-80 mb-1">Avg Resolution Time</div>
              <div className="text-xl sm:text-2xl font-extrabold">{avgTime} days</div>
            </div>
          </div>
          <div className="font-bold text-base sm:text-lg mb-2 mt-2 text-purple-600">Recent Complaints</div>
          <div className="bg-white rounded-xl border p-3 min-h-[50px] flex flex-col gap-3">
            {recentComplaints.length === 0 ? (
              <div className="text-center text-gray-400">No complaints found</div>
            ) : (
              recentComplaints.map((c, idx) => {
                const latestStatus = getLatestStatus(c);
                let statusColor = "text-blue-500", badge = "";
                if (latestStatus === "Resolved") statusColor = "text-green-500";
                else if (latestStatus === "Under Review" || latestStatus === "In Progress") statusColor = "text-yellow-500";
                else if (latestStatus === "Complaint Submitted") statusColor = "text-blue-500";
                badge = latestStatus === "Resolved" ? "✅" : latestStatus === "Under Review" ? "🔎" : "📝";
                return (
                  <div
                    key={c.id || idx}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-100 py-2 last:border-b-0 cursor-pointer hover:bg-purple-50 transition"
                    onClick={() => handleComplaintClick(c.id)}
                  >
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-base sm:text-[15px]">Complaint ID: {c.id}</div>
                      <div className="text-xs text-gray-500 mb-1 break-words">
                        Issue: {c.subject || c.issue || c.description}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {c.category && (
                          <span className="text-xs sm:text-sm px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold border border-purple-300">
                            {c.category}
                          </span>
                        )}
                        {c.priority && (
                          <span className="text-xs sm:text-sm px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold border border-yellow-300">
                            {c.priority}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`mt-2 sm:mt-0 sm:ml-2 text-xs sm:text-sm font-bold capitalize flex items-center gap-1 ${statusColor}`}>
                      <span>{badge}</span> {latestStatus}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
      <DashboardNavbar />
    </>
  );
};

export default Dashboard;
