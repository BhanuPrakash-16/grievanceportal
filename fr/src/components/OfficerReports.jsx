// components/Reports.jsx
import React from "react";
import { BarChart, CartesianGrid, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

const monthly = [
  { month: "Apr", resolved: 3 },
  { month: "May", resolved: 7 },
  { month: "Sep", resolved: 5 },
  { month: "Oct", resolved: 9 }
];
const catData = [
  { name: "Road", value: 9 },
  { name: "Water", value: 4 },
  { name: "Electricity", value: 3 }
];
const COLORS = ["#5f27cd", "#54a0ff", "#00b894"];

export default function Reports() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-2">Reports & History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <h4 className="mb-2 font-semibold">Resolved by Month</h4>
          <BarChart width={340} height={180} data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="resolved" fill="#ff7675" />
          </BarChart>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h4 className="mb-2 font-semibold">Complaints by Category</h4>
          <PieChart width={240} height={180}>
            <Pie
              data={catData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
              label
            >
              {catData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
      <div className="bg-white mt-4 p-4 shadow rounded w-fit">
        <b>Average Handling Time:</b> 1.5 days
      </div>
    </div>
  );
}
