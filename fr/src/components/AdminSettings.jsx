import React, { useState } from "react";
import {
  FaCog, FaUserShield, FaBell, FaKey, FaCheck, FaPalette, FaLock,
  FaUserEdit, FaPlus, FaTrash, FaEdit
} from "react-icons/fa";
import AdminBottomNav from "./AdminBottomNavBar";

const initialCategories = [
  "Water Management",
  "Traffic Management",
  "Sanitation",
  "Municipal"
];
const initialOfficers = [
  { name: "Officer A", area: "Water Management" },
  { name: "Officer B", area: "Traffic Management" },
  { name: "Officer C", area: "Sanitation" }
];
const initialThemes = [
  { name: "Default", value: "linear-gradient(135deg,#8b5cf6,#f43f5e 80%)" },
  { name: "Aqua Blue", value: "linear-gradient(135deg,#38bdf8,#818cf8 70%)" },
  { name: "Sunset", value: "linear-gradient(135deg,#fbbf24,#f59e42,#ec4899 80%)" }
];

export default function AdminSettings() {
  const [tab, setTab] = useState("system");

  // SYSTEM
  const [escalationDays, setEscalationDays] = useState(5);
  const [categories, setCategories] = useState([...initialCategories]);
  const [newCat, setNewCat] = useState("");
  const [catEditIdx, setCatEditIdx] = useState(-1);
  const [catEditLabel, setCatEditLabel] = useState("");
  const [officers, setOfficers] = useState([...initialOfficers]);
  const [officerName, setOfficerName] = useState("");
  const [officerArea, setOfficerArea] = useState("");
  const [theme, setTheme] = useState(initialThemes[0].value);
  const [logoUrl, setLogoUrl] = useState("");

  // NOTIFICATIONS
  const [notifEmail, setNotifEmail] = useState("admin@resolveit.com");
  const [notifFreq, setNotifFreq] = useState("Daily");

  // ACCOUNT
  const [show2FA, setShow2FA] = useState(false);
  const [apiKey, setApiKey] = useState("sk-xxx-xxxxxxx");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // -- Category handlers
  const addCategory = () => {
    if (newCat.trim() && !categories.includes(newCat)) {
      setCategories([...categories, newCat]);
      setNewCat("");
    }
  };
  const updateCategory = idx => {
    if (catEditLabel.trim() && idx >= 0) {
      setCategories(categories.map((c, i) => i === idx ? catEditLabel : c));
      setCatEditIdx(-1);
    }
  };
  const deleteCategory = idx => setCategories(categories.filter((_, i) => i !== idx));

  // Officer handlers
  const addOfficer = () => {
    if (officerName.trim() && officerArea.trim()) {
      setOfficers([...officers, { name: officerName, area: officerArea }]);
      setOfficerName(""); setOfficerArea("");
    }
  };
  const removeOfficer = idx => setOfficers(officers.filter((_, i) => i !== idx));

  // Account handlers
  const handlePasswordChange = () => {
    if (password && password === password2) {
      alert("Password Changed!");
      setPassword(""); setPassword2("");
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", background: "#fcf8fe" }}
      className="pb-40">
      {/* Header */}
      <div className="w-full py-4 px-6 border-b bg-white flex items-center justify-between">
        <div className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <FaCog className="text-purple-500" /> Admin Settings
        </div>
      </div>

      {/* Centered Card Layout */}
      <div className="max-w-xl mx-auto mt-10">
        {/* Tabs */}
        <div className="flex justify-center gap-1 mb-6">
          <button
            onClick={() => setTab("system")}
            className={`px-6 py-2 font-bold rounded-t-2xl focus:outline-none ${tab === "system" ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow" : "bg-white text-purple-700 border-b-2 border-purple-300"}`}>
            System
          </button>
          <button
            onClick={() => setTab("notifications")}
            className={`px-6 py-2 font-bold rounded-t-2xl focus:outline-none ${tab === "notifications" ? "bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow" : "bg-white text-pink-500 border-b-2 border-pink-200"}`}>
            Notifications
          </button>
          <button
            onClick={() => setTab("account")}
            className={`px-6 py-2 font-bold rounded-t-2xl focus:outline-none ${tab === "account" ? "bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow" : "bg-white text-indigo-600 border-b-2 border-indigo-200"}`}>
            Account
          </button>
        </div>

        <div className="bg-white bg-opacity-95 rounded-3xl shadow-2xl p-5 md:p-8 border">
          {/* -- SYSTEM SETTINGS -- */}
          {tab === "system" && (
            <>
              <div className="mb-8">
                <div className="font-bold text-lg mb-2 flex items-center gap-2 text-purple-600"><FaCog /> System Settings</div>
                <div className="mb-6">
                  <label className="block font-medium text-gray-700 mb-1">Auto-Escalation Time (days):</label>
                  <input type="number" min="1" value={escalationDays}
                    onChange={e => setEscalationDays(e.target.value)}
                    className="p-2 border rounded-lg w-32"
                  />
                  <span className="ml-2 text-xs text-gray-400">Complaints auto-escalate if unresolved for this many days.</span>
                </div>
                {/* -- Category Management -- */}
                <label className="block font-medium text-gray-700 mb-1">Categories</label>
                <div className="flex gap-2 mb-2">
                  <input value={newCat} onChange={e => setNewCat(e.target.value)}
                         className="p-2 border rounded-lg" placeholder="Add category..." />
                  <button type="button" className="bg-purple-400 px-4 py-2 rounded text-white font-bold" onClick={addCategory}><FaPlus /></button>
                </div>
                <div>
                  {categories.map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-3 mb-1">
                      {catEditIdx === idx ? (
                        <>
                          <input value={catEditLabel} onChange={e => setCatEditLabel(e.target.value)} className="p-1 px-2 border rounded" />
                          <button className="bg-green-500 text-white text-xs px-2 rounded" onClick={() => updateCategory(idx)}><FaCheck /></button>
                          <button className="bg-gray-300 px-2 rounded" onClick={() => setCatEditIdx(-1)}><FaTrash /></button>
                        </>
                      ) : (
                        <>
                          <span>{cat}</span>
                          <button className="bg-yellow-400 text-white text-xs px-2 rounded" onClick={() => {setCatEditIdx(idx);setCatEditLabel(cat);}}><FaEdit /></button>
                          <button className="bg-red-400 text-white text-xs px-2 rounded" onClick={() => deleteCategory(idx)}><FaTrash /></button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                {/* -- Officers -- */}
                <label className="block font-medium text-gray-700 mt-4 mb-1">Officers</label>
                <div className="flex flex-col md:flex-row gap-2 mb-2">
                  <input value={officerName} onChange={e => setOfficerName(e.target.value)} className="p-2 border rounded-lg" placeholder="Officer name" />
                  <input value={officerArea} onChange={e => setOfficerArea(e.target.value)} className="p-2 border rounded-lg" placeholder="Assigned area" />
                  <button type="button" className="bg-purple-400 px-4 py-2 rounded text-white font-bold" onClick={addOfficer}><FaPlus /></button>
                </div>
                <div>
                  {officers.map((o, i) => (
                    <div key={i} className="flex gap-2 items-center mb-1">
                      <FaUserShield /> {o.name} <span className="text-xs">(Area: {o.area})</span>
                      <button className="bg-red-300 text-white px-2 rounded text-xs" onClick={() => removeOfficer(i)}><FaTrash /></button>
                    </div>
                  ))}
                </div>
                {/* -- Theme -- */}
                <div className="mt-7 mb-2">
                  <label className="block font-medium text-gray-700 mb-1 flex gap-2 items-center"><FaPalette /> Portal Theme</label>
                  <div className="flex gap-3 mb-2">
                    {initialThemes.map((th, idx) =>
                      <button key={idx}
                        onClick={() => setTheme(th.value)}
                        className={`p-4 rounded-xl shadow-md border-2 ${theme===th.value ? "border-purple-500 scale-105" : "border-white"}`}
                        style={{ background: th.value, color: "#fff", fontWeight: "bold" }}>
                        {th.name}
                      </button>
                    )}
                  </div>
                  <input type="text" placeholder="Logo URL" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="p-2 border rounded-lg w-64" />
                  {logoUrl && <img src={logoUrl} alt="Logo Preview" className="h-9 ml-3 rounded shadow" style={{display: "inline-block", verticalAlign: "middle"}} />}
                </div>
              </div>
            </>
          )}

          {/* -- NOTIFICATIONS -- */}
          {tab === "notifications" && (
            <>
              <div className="font-bold text-lg mb-6 flex gap-2 items-center text-yellow-600"><FaBell /> Notification Settings</div>
              <div className="mb-5">
                <label className="block font-medium text-gray-700 mb-1">Admin Email for Alerts</label>
                <input value={notifEmail} onChange={e => setNotifEmail(e.target.value)} className="p-2 border rounded-lg w-60" placeholder="admin@..." />
              </div>
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">Frequency</label>
                <select className="w-44 p-2 border rounded-lg" value={notifFreq} onChange={e => setNotifFreq(e.target.value)}>
                  <option value="Immediate">Immediate</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>
              <div className="text-sm text-gray-400 mt-6">Customize email notifications, SMS alerts, and escalation reminders for all complaint activity here.</div>
            </>
          )}

          {/* -- ACCOUNT -- */}
          {tab === "account" && (
            <>
              <div className="font-bold text-lg mb-7 flex gap-2 items-center text-pink-700"><FaUserEdit /> Admin Account</div>
              <div className="mb-5">
                <label className="font-medium mb-1 block">Change Password</label>
                <div className="flex gap-2">
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="New password" className="p-2 border rounded-lg" />
                  <input type="password" value={password2} onChange={e=>setPassword2(e.target.value)} placeholder="Confirm password" className="p-2 border rounded-lg" />
                  <button className="bg-green-500 px-4 py-2 rounded text-white font-bold" onClick={handlePasswordChange}>Change</button>
                </div>
              </div>
              <div className="mb-5 flex gap-2 items-center">
                <FaLock className="inline" />
                <span className="font-medium mr-3">Two-Factor Authentication:</span>
                <button className={`px-3 py-2 rounded-xl font-bold shadow ${show2FA ? "bg-blue-700 text-white" : "bg-gray-300"}`} onClick={()=>setShow2FA(x=>!x)}>
                  {show2FA ? "Enabled" : "Enable"}
                </button>
              </div>
              <div className="mb-4">
                <label className="block font-medium">API Key</label>
                <div className="flex items-center gap-2">
                  <input className="p-2 border rounded-lg w-80" value={apiKey} onChange={e=>setApiKey(e.target.value)} />
                  <FaKey className="text-2xl text-gray-400" />
                </div>
                <span className="text-xs text-gray-400">Keep this key private.</span>
              </div>
            </>
          )}
        </div>
      </div>
      <AdminBottomNav  />
    </div>
  );
}
