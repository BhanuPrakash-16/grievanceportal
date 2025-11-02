// components/OfficerDashboard.jsx
import React from "react";
import OfficerNavbar from "./OfficerNavbar";

export default function OfficerDashboard() {
  const assigned = 3, pending = 1, resolved = 1;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pb-12">
      <OfficerNavbar />
      <div className="flex gap-8 mt-8 px-8">
        <StatCard title="Total Assigned" value={assigned} color="text-blue-600 bg-blue-100" />
        <StatCard title="Pending" value={pending} color="text-yellow-600 bg-yellow-50"/>
        <StatCard title="Resolved" value={resolved} color="text-green-600 bg-green-100"/>
      </div>
      <div className="mt-10 px-8">
        <AssignedComplaintsTable />
      </div>
      <div className="w-fit mt-12 ml-8">
        <ProfileCard name="Officer A" dept="Municipal" email="officerA@gmail.com" assigned={assigned}/>
      </div>
    </div>
  );
}

// Card component for dashboard stats
function StatCard({ title, value, color }) {
  return (
    <div className={`rounded-xl shadow text-center flex-1 py-5 px-7 ${color}`}>
      <div className="text-lg font-semibold text-gray-600">{title}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
    </div>
  );
}

// Minimal inline table for assigned complaints (*hooks could be used for API integration)
function AssignedComplaintsTable() {
  const [complaints, setComplaints] = React.useState([
    { id: 1, title: "Street Light Not Working", category: "Electrical", priority: "High", status: "Pending" },
    { id: 2, title: "Water Leakage near Park", category: "Water", priority: "Medium", status: "In Progress" },
    { id: 3, title: "Garbage Not Collected", category: "Sanitation", priority: "Low", status: "Resolved" },
  ]);
  
  // Track status and remark separately for each complaint
  const [edit, setEdit] = React.useState({});
  function handleStatusChange(idx, status) {
    setComplaints(c =>
      c.map((item, i) => i === idx ? { ...item, status } : item));
  }
  function handleRemarkChange(idx, remark) {
    setEdit(val => ({ ...val, [idx]: remark }));
  }
  function sendRemark(idx) {
    alert(`Remark sent: ${edit[idx] || ""}\nStatus: ${complaints[idx].status}`);
    setEdit(edit => ({ ...edit, [idx]: "" }));
  }

  const statusColors = {
    Pending: "text-yellow-500 font-bold",
    "In Progress": "text-blue-600 font-bold",
    Resolved: "text-green-600 font-bold"
  };

  return (
    <div className="bg-white rounded-2xl shadow px-6 py-6 mt-2">
      <div className="text-xl font-semibold mb-4 text-gray-700">Assigned Complaints</div>
      <table className="min-w-full table-auto border-t border-gray-300">
        <thead>
          <tr className="text-gray-800">
            <th>ID</th><th>Title</th><th>Category</th><th>Priority</th><th>Status</th><th>Action</th><th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c, idx) => (
            <tr key={c.id} className="text-sm">
              <td>{c.id}</td>
              <td>{c.title}</td>
              <td>{c.category}</td>
              <td>
                <span className={
                  c.priority === "High" ? "px-2 py-1 rounded bg-red-100 text-red-600 font-bold" :
                  c.priority === "Medium" ? "px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-bold" :
                  "px-2 py-1 rounded bg-green-100 text-green-700 font-bold"
                }>
                  {c.priority}
                </span>
              </td>
              <td>
                <span className={statusColors[c.status] || ""}>{c.status}</span>
              </td>
              <td>
                <select
                  value={c.status}
                  className="rounded border px-2 py-1"
                  onChange={e => handleStatusChange(idx,e.target.value)}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={edit[idx] || ""}
                  className="border rounded px-2 py-1 mr-1 w-32"
                  placeholder="Type remark..."
                  onChange={e => handleRemarkChange(idx, e.target.value)}
                />
                <button className="bg-pink-500 hover:bg-purple-700 text-white px-3 py-1 font-semibold rounded"
                  onClick={() => sendRemark(idx)}
                >Send</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProfileCard({ name, dept, email, assigned }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow w-64">
      <div className="font-semibold mb-1">Name: <span className="text-pink-700">{name}</span></div>
      <div className="mb-1">Department: <span className="font-semibold">{dept}</span></div>
      <div className="mb-1">Email: <span className="text-purple-700 font-semibold">{email}</span></div>
      <div className="mt-2">Assigned Complaints: <span className="font-bold text-blue-700">{assigned}</span></div>
    </div>
  );
}
