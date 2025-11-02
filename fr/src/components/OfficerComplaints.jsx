// components/OfficerComplaints.jsx
import React from "react";
import OfficerNavbar from "./OfficerNavbar";

export default function OfficerComplaints() {
  // Dummy complaints data
  const [complaints, setComplaints] = React.useState([
    { id: 1, title: "Street Light Not Working", category: "Electrical", priority: "High", status: "Pending" },
    { id: 2, title: "Water Leakage near Park", category: "Water", priority: "Medium", status: "In Progress" },
    { id: 3, title: "Garbage Not Collected", category: "Sanitation", priority: "Low", status: "Resolved" }
  ]);
  const [edit, setEdit] = React.useState({});

  function handleStatusChange(idx, status) {
    setComplaints(c =>
      c.map((item, i) => i === idx ? { ...item, status } : item));
  }
  function handleRemarkChange(idx, remark) {
    setEdit(val => ({ ...val, [idx]: remark }));
  }
  function sendRemark(idx) {
    alert(`Remark sent: "${edit[idx] || ""}"\nStatus: ${complaints[idx].status}`);
    setEdit(edit => ({ ...edit, [idx]: "" }));
  }

  const statusColors = {
    Pending: "text-yellow-500 font-bold",
    "In Progress": "text-blue-600 font-bold",
    Resolved: "text-green-600 font-bold"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pb-12">
      <OfficerNavbar />
      <div className="max-w-5xl mx-auto mt-8 bg-white rounded-xl shadow px-8 py-8">
        <div className="text-2xl font-semibold mb-7 text-gray-800">Assigned Complaints</div>
        <table className="min-w-full table-auto border-t border-gray-300 mb-2">
          <thead>
            <tr>
              <th>ID</th><th>Title</th><th>Category</th><th>Priority</th><th>Status</th><th>Action</th><th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c, idx) => (
              <tr key={c.id}>
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
                <td><span className={statusColors[c.status] || ""}>{c.status}</span></td>
                <td>
                  <select
                    value={c.status}
                    className="rounded border px-2 py-1"
                    onChange={e => handleStatusChange(idx, e.target.value)}
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
    </div>
  );
}
