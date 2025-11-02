import React, { Component } from "react";
import { FaSearch, FaUserPlus, FaUserEdit, FaTrash, FaTimes, FaKey } from "react-icons/fa";
import AdminBottomNav from "./AdminBottomNavBar";

const USER_ROLES = ["User", "Admin", "Officer"];
const USER_STATUS = ["Active", "Inactive", "Suspended"];

class AdminUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      filteredUsers: [],
      searchKeyword: "",
      selectedUser: null,
      showAddModal: false,
      newUser: {
        name: "",
        email: "",
        role: "User",
        status: "Active",
        department: ""
      },
      editMode: false
    };
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = () => {
    const stored = window.sessionStorage.getItem("users_all");
    if (!stored) {
      const sampleUsers = [
        { id: "U001", name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", department: "IT", joinDate: "2025-01-15" },
        { id: "U002", name: "Jane Smith", email: "jane@example.com", role: "Officer", status: "Active", department: "Municipal", joinDate: "2025-02-20" },
        { id: "U003", name: "Mike Johnson", email: "mike@example.com", role: "User", status: "Active", department: "Water", joinDate: "2025-03-10" },
        { id: "U004", name: "Sarah Wilson", email: "sarah@example.com", role: "Officer", status: "Inactive", department: "Sanitation", joinDate: "2025-04-05" }
      ];
      window.sessionStorage.setItem("users_all", JSON.stringify(sampleUsers));
      this.setState({ users: sampleUsers, filteredUsers: sampleUsers });
    } else {
      const users = JSON.parse(stored);
      this.setState({ users, filteredUsers: users });
    }
  };

  handleSearch = (e) => {
    const searchKeyword = e.target.value.toLowerCase();
    const filteredUsers = this.state.users.filter(user =>
      Object.values(user).some(val =>
        val.toString().toLowerCase().includes(searchKeyword)
      )
    );
    this.setState({ searchKeyword, filteredUsers });
  };

  handleAddUser = () => {
    const { users, newUser } = this.state;
    const newId = "U" + String(users.length + 1).padStart(3, "0");
    const userToAdd = {
      ...newUser,
      id: newId,
      joinDate: new Date().toISOString().split("T")[0]
    };

    const updatedUsers = [...users, userToAdd];
    window.sessionStorage.setItem("users_all", JSON.stringify(updatedUsers));
    this.setState({
      users: updatedUsers,
      filteredUsers: updatedUsers,
      showAddModal: false,
      newUser: {
        name: "",
        email: "",
        role: "User",
        status: "Active",
        department: ""
      }
    });
  };

  handleEditUser = () => {
    const { users, selectedUser } = this.state;
    const updatedUsers = users.map(user =>
      user.id === selectedUser.id ? selectedUser : user
    );
    window.sessionStorage.setItem("users_all", JSON.stringify(updatedUsers));
    this.setState({
      users: updatedUsers,
      filteredUsers: updatedUsers,
      selectedUser: null,
      editMode: false
    });
  };

  handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = this.state.users.filter(user => user.id !== userId);
      window.sessionStorage.setItem("users_all", JSON.stringify(updatedUsers));
      this.setState({
        users: updatedUsers,
        filteredUsers: updatedUsers,
        selectedUser: null
      });
    }
  };

  handleLogout = () => {
    window.sessionStorage.clear();
    window.location.replace('/');
  };

  render() {
    const { filteredUsers, searchKeyword, selectedUser, showAddModal, newUser, editMode } = this.state;

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50 pb-24">
        {/* Header */}
        <div className="w-full py-4 px-6 border-b bg-white flex items-center justify-between">
          <div className="text-xl md:text-2xl font-extrabold">User Management</div>
          <div className="flex gap-2">
            <button onClick={() => this.setState({ showAddModal: true })}
              className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-sky-500 text-white font-semibold py-2 px-5 rounded-full shadow text-sm flex items-center gap-2">
              <FaUserPlus /> Add User
            </button>
            <button onClick={this.handleLogout}
              className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-full shadow">
              Logout
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto px-4 mt-6">
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="flex items-center gap-2">
              <FaSearch className="text-purple-600" />
              <input
                type="text"
                placeholder="Search users..."
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                value={searchKeyword}
                onChange={this.handleSearch}
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-lg rounded-xl">
              <thead>
                <tr className="text-left">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Join Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-purple-50 transition">
                    <td className="p-3 font-bold">#{user.id}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold
                        ${user.role === "Admin" ? "bg-purple-100 text-purple-700" :
                          user.role === "Officer" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-700"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold
                        ${user.status === "Active" ? "bg-green-100 text-green-700" :
                          user.status === "Inactive" ? "bg-gray-100 text-gray-700" :
                            "bg-red-100 text-red-700"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3">{user.department}</td>
                    <td className="p-3">{user.joinDate}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button onClick={() => this.setState({ selectedUser: user, editMode: true })}
                          className="p-2 text-blue-500 hover:text-blue-700">
                          <FaUserEdit />
                        </button>
                        <button onClick={() => this.handleDeleteUser(user.id)}
                          className="p-2 text-red-500 hover:text-red-700">
                          <FaTrash />
                        </button>
                        <button onClick={() => this.setState({ selectedUser: user, editMode: false })}
                          className="p-2 text-purple-500 hover:text-purple-700">
                          <FaKey />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New User</h2>
                <button onClick={() => this.setState({ showAddModal: false })}
                  className="text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    className="mt-1 w-full p-2 border rounded-lg"
                    value={newUser.name}
                    onChange={e => this.setState({ newUser: { ...newUser, name: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 w-full p-2 border rounded-lg"
                    value={newUser.email}
                    onChange={e => this.setState({ newUser: { ...newUser, email: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    className="mt-1 w-full p-2 border rounded-lg"
                    value={newUser.role}
                    onChange={e => this.setState({ newUser: { ...newUser, role: e.target.value } })}
                  >
                    {USER_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    className="mt-1 w-full p-2 border rounded-lg"
                    value={newUser.department}
                    onChange={e => this.setState({ newUser: { ...newUser, department: e.target.value } })}
                  />
                </div>
                <button
                  onClick={this.handleAddUser}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {selectedUser && editMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit User</h2>
                <button onClick={() => this.setState({ selectedUser: null, editMode: false })}
                  className="text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    className="mt-1 w-full p-2 border rounded-lg"
                    value={selectedUser.name}
                    onChange={e => this.setState({
                      selectedUser: { ...selectedUser, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 w-full p-2 border rounded-lg"
                    value={selectedUser.email}
                    onChange={e => this.setState({
                      selectedUser: { ...selectedUser, email: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    className="mt-1 w-full p-2 border rounded-lg"
                    value={selectedUser.role}
                    onChange={e => this.setState({
                      selectedUser: { ...selectedUser, role: e.target.value }
                    })}
                  >
                    {USER_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    className="mt-1 w-full p-2 border rounded-lg"
                    value={selectedUser.status}
                    onChange={e => this.setState({
                      selectedUser: { ...selectedUser, status: e.target.value }
                    })}
                  >
                    {USER_STATUS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    className="mt-1 w-full p-2 border rounded-lg"
                    value={selectedUser.department}
                    onChange={e => this.setState({
                      selectedUser: { ...selectedUser, department: e.target.value }
                    })}
                  />
                </div>
                <button
                  onClick={this.handleEditUser}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View/Reset Password Modal */}
        {selectedUser && !editMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">User Details</h2>
                <button onClick={() => this.setState({ selectedUser: null })}
                  className="text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>
              <div className="space-y-3">
                <p><strong>ID:</strong> {selectedUser.id}</p>
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Status:</strong> {selectedUser.status}</p>
                <p><strong>Department:</strong> {selectedUser.department}</p>
                <p><strong>Join Date:</strong> {selectedUser.joinDate}</p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      alert("Password reset link has been sent to user's email");
                      this.setState({ selectedUser: null });
                    }}
                    className="w-full bg-gradient-to-r from-yellow-400 to-red-400 text-white py-2 rounded-lg font-semibold"
                  >
                    Reset Password
                  </button>
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

export default AdminUsers;
