// components/ResolvedComplaints.jsx
import React from "react";
const resolvedFake = [
  { id: 900, subject: "Street cleaning", date: "2025-10-10", comment: "Resolved on time.", admin: "Good work" },
  { id: 889, subject: "Broken bench", date: "2025-09-30", comment: "Bench replaced.", admin: "Thanks" }
];
export default function ResolvedComplaints() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Resolved Complaints</h2>
      <table className="min-w-full table-auto bg-white shadow rounded">
        <thead>
          <tr className="bg-green-100">
            <th>ID</th><th>Subject</th><th>Date</th><th>Officer Comment</th><th>Admin Remark</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {resolvedFake.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.subject}</td><td>{r.date}</td>
              <td>{r.comment}</td><td>{r.admin}</td>
              <td>
                <button className="btn-dashboard">View Feedback</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
