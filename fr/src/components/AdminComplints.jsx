import React, { Component } from "react";
import { FaSearch, FaFileCsv, FaFilePdf, FaChevronRight, FaTimes } from "react-icons/fa";
import AdminBottomNav from "./AdminBottomNavBar";

const CATEGORIES = ["All", "Water Management", "Traffic Management", "Sanitation", "Education", "Municipal", "Infrastructure"];
const PRIORITIES = ["All", "Low", "Medium", "High"];
const STATUSES = ["All", "NEW", "IN_PROGRESS", "RESOLVED", "ESCALATED"];
const OFFICERS = ["Officer A", "Officer B", "Officer C", "Officer D"];
const STATUS_STYLES = {
  "NEW": "bg-gray-200 text-gray-800 border-gray-300",
  "IN_PROGRESS": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "RESOLVED": "bg-green-100 text-green-700 border-green-300",
  "ESCALATED": "bg-red-100 text-red-700 border-red-300"
};
const getStatusLabel = st => {
  if (st === "NEW") return "Pending";
  if (st === "IN_PROGRESS") return "Under Review";
  if (st === "RESOLVED") return "Resolved";
  if (st === "ESCALATED") return "Escalated";
  return st;
};
const EXPORT_KEYS = ["id", "user", "category", "priority", "status", "officer", "date", "title", "description"];

// You can run this in the browser console or in componentDidMount to set fake complaints
const sampleComplaints = [
  {
    id: "CMP001", user: "John Doe", category: "Water Management", priority: "High", status: "NEW", officer: "Officer A",
    date: "2025-10-25", title: "No water in main street", description: "There has been no water supply since yesterday.", comments: []
  },
  {
    id: "CMP002", user: "Sunitha Rao", category: "Sanitation", priority: "Medium", status: "IN_PROGRESS", officer: "Officer B",
    date: "2025-10-24", title: "Garbage not cleared", description: "Full bin and garbage not picked up for days.", comments: []
  },
  {
    id: "CMP003", user: "Mohan Reddy", category: "Traffic Management", priority: "High", status: "ESCALATED", officer: "Officer D",
    date: "2025-10-20", title: "Traffic jam at market", description: "Regular jams blocking school traffic.", comments: []
  },
  {
    id: "CMP004", user: "Vijay Kumar", category: "Municipal", priority: "Low", status: "RESOLVED", officer: "Officer A",
    date: "2025-10-18", title: "Broken streetlight", description: "Streetlight in 2nd avenue not working.", comments: []
  },
  {
    id: "CMP005", user: "Anjali Sharma", category: "Education", priority: "Medium", status: "NEW", officer: "Officer C",
    date: "2025-10-17", title: "School lacks benches", description: "No benches for students in ZPHS 4.", comments: []
  },
  {
    id: "CMP006", user: "Ramesh P", category: "Sanitation", priority: "High", status: "NEW", officer: "None",
    date: "2025-10-19", title: "Open drain issue", description: "Open sewage drain in Ramnagar.", comments: []
  },
  {
    id: "CMP007", user: "Fatima Bee", category: "Infrastructure", priority: "Medium", status: "IN_PROGRESS", officer: "Officer D",
    date: "2025-10-22", title: "Broken road", description: "Potholes in main road causing accidents.", comments: []
  },
  {
    id: "CMP008", user: "Lakshmi K", category: "Traffic Management", priority: "Low", status: "RESOLVED", officer: "Officer B",
    date: "2025-10-22", title: "Signal not working", description: "Signal at clock tower not functional.", comments: []
  },
  {
    id: "CMP009", user: "Govind R", category: "Municipal", priority: "Medium", status: "NEW", officer: "None",
    date: "2025-10-21", title: "Tree fallen", description: "Tree blocking road near lake.", comments: []
  },
  {
    id: "CMP010", user: "Sita Devi", category: "Water Management", priority: "High", status: "ESCALATED", officer: "Officer C",
    date: "2025-10-23", title: "Contaminated water", description: "Dirty water from taps in Shantinagar.", comments: []
  }
];

// Only run if you want to OVERRIDE all complaints data for testing:
window.sessionStorage.setItem("complaints_all", JSON.stringify(sampleComplaints));


class AdminComplints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allComplaints: [],
      filteredComplaints: [],
      filterCategory: "All",
      filterPriority: "All",
      filterStatus: "All",
      searchKeyword: "",
      selectedComplaint: null,
      adminComment: "",
      selectBulk: [],
      officerAssign: "",
      sortField: "date",
      sortAsc: false,
      filterDateFrom: "",
      filterDateTo: "",
      showBulkModal: null, // "assign", "resolve", or "escalate"
      bulkOfficerValue: "Officer A"
    };
  }

  componentDidMount() {
    this.loadComplaints();
  }

  loadComplaints = () => {
    const stored = window.sessionStorage.getItem("complaints_all");
    const all = stored ? JSON.parse(stored) : [];
    this.setState({ allComplaints: all }, this.handleFilterChange);
  };

  handleLogout = () => {
    window.sessionStorage.clear();
    window.location.replace('/');
  };

  handleFilterChange = () => {
    const { allComplaints, filterCategory, filterPriority, filterStatus, searchKeyword, filterDateFrom, filterDateTo, sortField, sortAsc } = this.state;
    let filtered = allComplaints.filter(c => {
      const catMatch = filterCategory === "All" || c.category === filterCategory;
      const priMatch = filterPriority === "All" || c.priority === filterPriority;
      const statMatch = filterStatus === "All" || c.status === filterStatus;
      const searchMatch = !searchKeyword || ["id","user","title","description","category","officer"].some(key => (c[key] || "").toLowerCase().includes(searchKeyword.toLowerCase()));
      const fromMatch = !filterDateFrom || new Date(c.date || c.id) >= new Date(filterDateFrom);
      const toMatch = !filterDateTo || new Date(c.date || c.id) <= new Date(filterDateTo);
      return catMatch && priMatch && statMatch && searchMatch && fromMatch && toMatch;
    });

    filtered.sort((a,b) => {
      if(sortField === "date") return sortAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      if(sortField === "priority") {
        const map = { "High":3, "Medium":2, "Low":1 };
        return sortAsc ? map[a.priority]-map[b.priority] : map[b.priority]-map[a.priority];
      }
      if(sortField === "status") {
        const map = { "NEW":1,"IN_PROGRESS":2,"RESOLVED":3,"ESCALATED":4 };
        return sortAsc ? map[a.status]-map[b.status] : map[b.status]-map[a.status];
      }
      if(sortField === "officer") return sortAsc ? (a.officer||"").localeCompare(b.officer||"") : (b.officer||"").localeCompare(a.officer||"");
      return 0;
    });
    this.setState({ filteredComplaints: filtered });
  };

  updateComplaint = (id, updates) => {
    const updated = this.state.allComplaints.map(c => c.id === id ? { ...c, ...updates } : c);
    window.sessionStorage.setItem("complaints_all", JSON.stringify(updated));
    this.setState({ allComplaints: updated }, this.handleFilterChange);
  };

  openModal = (complaint) => this.setState({ selectedComplaint: complaint, adminComment: "", officerAssign: complaint.officer || "None" });
  closeModal = () => this.setState({ selectedComplaint: null, officerAssign: "" });

  addComment = () => {
    const { selectedComplaint, adminComment } = this.state;
    if (!adminComment.trim()) return;
    const updated = {
      ...selectedComplaint,
      comments: [
        ...(selectedComplaint.comments || []),
        { text: adminComment, date: new Date().toLocaleString(), author: "Admin" }
      ]
    };
    this.updateComplaint(selectedComplaint.id, updated);
    this.setState({ selectedComplaint: updated, adminComment: "" });
  };

  handleAssignOfficer = (id, value) => {
    this.updateComplaint(id, { officer: value, status: value !== "None" ? "IN_PROGRESS" : "NEW" });
  };

  handleAssignOfficerModal = () => {
    const { selectedComplaint, officerAssign } = this.state;
    if (officerAssign) {
      this.updateComplaint(selectedComplaint.id, { officer: officerAssign, status: officerAssign !== "None" ? "IN_PROGRESS" : "NEW" });
      this.setState({ selectedComplaint: { ...selectedComplaint, officer: officerAssign, status: officerAssign !== "None" ? "IN_PROGRESS" : "NEW" } });
    }
  }

  handleBulkSelect = id => {
    this.setState(({ selectBulk }) => ({
      selectBulk: selectBulk.includes(id) ? selectBulk.filter(x => x !== id) : [...selectBulk, id]
    }));
  };

  // --- Bulk Action popups and logic ---
  openBulkModal = (action) => this.setState({ showBulkModal: action, bulkOfficerValue: OFFICERS[0] });
  closeBulkModal = () => this.setState({ showBulkModal: null });

  confirmBulkAction = () => {
    const { showBulkModal, selectBulk, bulkOfficerValue } = this.state;
    if (showBulkModal === "assign") {
      selectBulk.forEach(id => this.updateComplaint(id, { officer: bulkOfficerValue, status: "IN_PROGRESS" }));
    }
    if (showBulkModal === "resolve") {
      selectBulk.forEach(id => this.updateComplaint(id, { status: "RESOLVED" }));
    }
    if (showBulkModal === "escalate") {
      selectBulk.forEach(id => this.updateComplaint(id, { status: "ESCALATED" }));
    }
    this.setState({ selectBulk: [], showBulkModal: null });
  };

  exportCSV = () => {
    const { filteredComplaints } = this.state;
    const rows = [EXPORT_KEYS.join(","), ...filteredComplaints.map(c => EXPORT_KEYS.map(k => `"${(c[k] || "").toString().replaceAll('"', '""')}"`).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([rows], { type: 'text/csv' }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "complaints_export.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  exportPDF = () => alert("PDF Export coming soon!");
  escalateComplaint = (id) => this.updateComplaint(id, { status: "ESCALATED" });

  render() {
    const { filteredComplaints, filterCategory, filterPriority, filterStatus, searchKeyword, selectedComplaint, adminComment, selectBulk, officerAssign, filterDateFrom, filterDateTo, showBulkModal, bulkOfficerValue } = this.state;

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50 pb-24">
        {/* Header */}
        <div className="w-full py-4 px-6 border-b bg-white flex items-center justify-between">
          <div className="text-xl md:text-2xl font-extrabold">All Complaints</div>
          <div className="flex gap-2">
            <button onClick={this.exportCSV} className="bg-gradient-to-r from-green-400 to-blue-400 text-white font-semibold py-2 px-5 rounded-full shadow text-sm flex items-center gap-2" disabled={filteredComplaints.length===0}><FaFileCsv /> CSV</button>
            <button onClick={this.exportPDF} className="bg-gradient-to-r from-purple-400 to-pink-500 text-white font-semibold py-2 px-5 rounded-full shadow text-sm flex items-center gap-2"><FaFilePdf /> PDF</button>
            <button onClick={this.handleLogout} className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold py-2 px-6 rounded-full shadow">Logout</button>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto px-4 mt-6">
          <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <FaSearch className="text-purple-600" />
              <input type="text" placeholder="Search complaints..." className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" value={searchKeyword} onChange={e => this.setState({searchKeyword:e.target.value}, this.handleFilterChange)} />
            </div>
            <select className="p-2 border rounded-lg" value={filterCategory} onChange={e => this.setState({filterCategory:e.target.value}, this.handleFilterChange)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
            <select className="p-2 border rounded-lg" value={filterPriority} onChange={e => this.setState({filterPriority:e.target.value}, this.handleFilterChange)}>{PRIORITIES.map(p => <option key={p}>{p}</option>)}</select>
            <select className="p-2 border rounded-lg" value={filterStatus} onChange={e => this.setState({filterStatus:e.target.value}, this.handleFilterChange)}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
            <input type="date" className="p-2 border rounded-lg" value={filterDateFrom} onChange={e => this.setState({filterDateFrom:e.target.value}, this.handleFilterChange)} />
            <input type="date" className="p-2 border rounded-lg" value={filterDateTo} onChange={e => this.setState({filterDateTo:e.target.value}, this.handleFilterChange)} />
            <button onClick={()=>this.openBulkModal("assign")} disabled={selectBulk.length===0} className="ml-4 text-xs bg-gradient-to-r from-blue-500 to-purple-400 text-white px-3 py-2 rounded-full font-semibold shadow-sm">Assign Officer (bulk)</button>
            <button onClick={()=>this.openBulkModal("resolve")} disabled={selectBulk.length===0} className="ml-1 text-xs bg-gradient-to-r from-green-500 to-blue-400 text-white px-3 py-2 rounded-full font-semibold shadow-sm">Mark Resolved (bulk)</button>
            <button onClick={()=>this.openBulkModal("escalate")} disabled={selectBulk.length===0} className="ml-1 text-xs bg-gradient-to-r from-red-500 to-yellow-400 text-white px-3 py-2 rounded-full font-semibold shadow-sm">Escalate (bulk)</button>
          </div>

          {/* Bulk Modal */}
          {showBulkModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-2xl max-w-[94vw] w-full max-w-sm p-6 flex flex-col items-center space-y-6">
                <div className="flex justify-between items-center w-full">
                  <h2 className="font-bold text-lg capitalize">{showBulkModal === "assign" ? "Assign Officer (Bulk)" : showBulkModal === "resolve" ? "Mark Resolved (Bulk)" : "Escalate (Bulk)"}</h2>
                  <button onClick={this.closeBulkModal} className="text-2xl text-gray-500"><FaTimes/></button>
                </div>
                {showBulkModal === "assign" && (
                  <div className="w-full">
                    <label className="font-semibold mb-1 block text-sm">Select Officer:</label>
                    <select value={bulkOfficerValue} onChange={e=>this.setState({ bulkOfficerValue: e.target.value })} className="w-full p-3 border rounded-lg mt-1">
                      {OFFICERS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                )}
                <div className="w-full text-center text-gray-600 mb-2">
                  {showBulkModal !== "assign" && "Are you sure you want to apply this action to all selected complaints?"}
                  {showBulkModal === "assign" && `Assign selected complaints to "${bulkOfficerValue}"?`}
                </div>
                <button onClick={this.confirmBulkAction} className="w-full py-2 rounded-full font-bold text-white bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg">
                  Confirm
                </button>
              </div>
            </div>
          )}

          {/* Complaints Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-lg rounded-xl text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-3"></th>
                  <th className="p-3">ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Officer</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length===0 && <tr><td colSpan={9} className="text-center py-10 text-gray-400 italic">No complaints match your filters.</td></tr>}
                {filteredComplaints.map(c => (
                  <tr key={c.id} className="hover:bg-purple-50 transition">
                    <td className="p-3"><input type="checkbox" checked={selectBulk.includes(c.id)} onChange={()=>this.handleBulkSelect(c.id)} className="h-4 w-4"/></td>
                    <td className="p-3 font-bold">#{c.id}</td>
                    <td className="p-3">{c.user}</td>
                    <td className="p-3">{c.category}</td>
                    <td className={`p-3 font-semibold ${c.priority==="High"?"bg-red-100 text-red-700":c.priority==="Medium"?"bg-yellow-100 text-yellow-700":"bg-green-100 text-green-700"} rounded-xl px-2 py-1`}>{c.priority}</td>
                    <td className={`p-3 font-bold border ${STATUS_STYLES[c.status]}`}>{getStatusLabel(c.status)}</td>
                    <td className="p-3">
                      <select value={c.officer||"None"} onChange={e=>this.handleAssignOfficer(c.id,e.target.value)} className="p-1 rounded border bg-white text-xs">{["None"].concat(OFFICERS).map(o=><option key={o}>{o}</option>)}</select>
                    </td>
                    <td className="p-3">{c.date || new Date(c.id).toLocaleDateString()}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={()=>this.openModal(c)} className="px-3 py-2 text-xs rounded-full bg-purple-500 text-white shadow hover:bg-pink-500">View <FaChevronRight className="inline ml-1"/></button>
                      <button onClick={()=>this.escalateComplaint(c.id)} className="px-3 py-2 text-xs rounded-full bg-red-500 text-white shadow hover:bg-yellow-500">Escalate</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Complaint Details</h2>
                <button className="text-2xl text-gray-500" onClick={this.closeModal}><FaTimes/></button>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>ID:</strong> {selectedComplaint.id}</p>
                <p><strong>Title:</strong> {selectedComplaint.title}</p>
                <p><strong>Description:</strong> {selectedComplaint.description}</p>
                <p><strong>Category:</strong> {selectedComplaint.category}</p>
                <p><strong>Priority:</strong> {selectedComplaint.priority}</p>
                <p><strong>Status:</strong> <span className={STATUS_STYLES[selectedComplaint.status]}>{getStatusLabel(selectedComplaint.status)}</span></p>
                <p><strong>User:</strong> {selectedComplaint.user}</p>
                <p><strong>Date:</strong> {selectedComplaint.date || new Date(selectedComplaint.id).toLocaleDateString()}</p>
                <p><strong>Assigned Officer:</strong>
                  <select value={officerAssign||"None"} onChange={e=>this.setState({officerAssign:e.target.value})} className="ml-3 p-1 rounded border bg-white text-xs">{["None"].concat(OFFICERS).map(o=><option key={o}>{o}</option>)}</select>
                  <button onClick={this.handleAssignOfficerModal} className="ml-2 px-2 py-1 rounded bg-blue-500 text-white text-xs">Assign</button>
                </p>
              </div>
              <div className="mt-4 flex gap-6">
                <button onClick={()=>this.updateComplaint(selectedComplaint.id,{status:"IN_PROGRESS"})} className="bg-yellow-400 text-white px-4 py-2 rounded">Mark In Progress</button>
                <button onClick={()=>this.updateComplaint(selectedComplaint.id,{status:"RESOLVED"})} className="bg-green-500 text-white px-4 py-2 rounded">Mark Resolved</button>
                <button onClick={()=>this.updateComplaint(selectedComplaint.id,{status:"ESCALATED"})} className="bg-red-500 text-white px-4 py-2 rounded">Escalate</button>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">Comments</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded">
                  {(selectedComplaint.comments||[]).map((c,i)=><div key={i} className="text-xs"><span className="font-bold">{c.author}:</span> {c.text} <span className="text-gray-400 text-[10px]">({c.date})</span></div>)}
                </div>
                <div className="mt-2 flex gap-2">
                  <input type="text" className="flex-1 border p-2 rounded" placeholder="Add comment..." value={adminComment} onChange={e=>this.setState({adminComment:e.target.value})} />
                  <button onClick={this.addComment} className="bg-purple-500 text-white px-4 py-2 rounded">Add</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <AdminBottomNav />
      </div>
    );
  }
}

export default AdminComplints;
