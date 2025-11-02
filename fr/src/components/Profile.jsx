// import React, { Component, createRef } from "react";
// import {
//   FaHome, FaPlusSquare, FaRegFileAlt, FaUser, FaCamera, FaCheckCircle,
//   FaPhone, FaMapMarkerAlt, FaEdit, FaSignOutAlt, FaMoon, FaSun, FaBell, FaSms, FaExclamationTriangle
// } from "react-icons/fa";

// const HeaderBar = ({ username }) => (
//   <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 shadow h-[60px] flex items-center px-7">
//     <span className="text-2xl md:text-[1.85rem] font-extrabold tracking-tight text-white font-sans">
//       Grievance Portal
//     </span>
//     <div className="ml-auto flex items-center font-medium gap-3">
//       <span className="text-white text-base md:text-lg">
//         Welcome, {username || "User"}
//       </span>
//       <button
//         className="ml-3 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-semibold py-2 px-7 rounded-full text-lg transition-all shadow focus:outline-none"
//         onClick={() => {
//           localStorage.clear();
//           window.location.replace("/");
//         }}
//       >
//         Logout
//       </button>
//     </div>
//   </header>
// );

// const TabButton = ({ label, active, onClick }) => (
//   <button
//     className={`px-4 py-2 rounded-xl transition font-semibold text-base ${active
//       ? "bg-gradient-to-r from-pink-400 to-yellow-400 text-white shadow-md"
//       : "bg-gray-100 text-purple-700 border border-purple-200 hover:bg-purple-100"}`}
//     style={{ marginRight: 8 }}
//     onClick={onClick}
//     type="button"
//   >
//     {label}
//   </button>
// );

// const CenteredBottomNav = ({ active }) => (
//   <nav className="fixed bottom-5 w-full z-50 flex justify-center pointer-events-none">
//     <div
//       className="pointer-events-auto flex justify-between items-center
//         rounded-[2.2rem] shadow-xl bg-white/95 border border-gray-100
//         px-7 py-2 max-w-[420px] w-[90vw]"
//       style={{ transition: "all 0.2s", minWidth: 290 }}
//     >
//       <a href="/dashboard" className={`flex flex-col items-center mx-2 ${active === "dashboard" ? "text-blue-600" : "text-gray-700 hover:text-pink-500"}`}><FaHome size={24} /><span className="text-xs mt-1">Dashboard</span></a>
//       <a href="/complaints" className={`flex flex-col items-center mx-2 ${active === "complaints" ? "text-blue-600" : "text-gray-700 hover:text-pink-500"}`}><FaPlusSquare size={24} /><span className="text-xs mt-1">Submit</span></a>
//       <a href="/mycomplaints" className={`flex flex-col items-center mx-2 ${active === "mycomplaints" ? "text-blue-600" : "text-gray-700 hover:text-pink-500"}`}><FaRegFileAlt size={24} /><span className="text-xs mt-1">My Complaints</span></a>
//       <a href="/profile" className={`flex flex-col items-center mx-2 ${active === "profile" ? "text-blue-600" : "text-gray-700 hover:text-pink-500"}`}><FaUser size={24} /><span className="text-xs mt-1">Profile</span></a>
//     </div>
//   </nav>
// );

// class Profile extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       id: "",
//       fullname: "",
//       email: "",
//       role: "",
//       phone: "",
//       address: "",
//       verified: true,
//       theme: localStorage.getItem("appTheme") || "light",
//       editing: false,
//       activeTab: "Profile Info",
//       error: "",
//       mailStatus: "",
//       profilePic: "",
//     };
//     this.fileInputRef = createRef();
//   }

//   async componentDidMount() {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       window.location.replace("/");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:8419/users/profile", {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//       });

//       if (res.status === 403 || res.status === 401) {
//         localStorage.clear();
//         window.location.replace("/");
//         return;
//       }

//       const data = await res.json();
//       console.log("Profile data:", data);

//       this.setState({
//         id: data.id || "",
//         fullname: data.fullname || "User",
//         email: data.email || "",
//         phone: data.phone || "",
//         address: data.address || "",
//         role: data.role || "Citizen",
//       });
//     } catch (err) {
//       console.error("Profile error:", err);
//       this.setState({ error: "Failed to load profile." });
//     }
//   }

//   handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

//   handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => this.setState({ profilePic: reader.result });
//       reader.readAsDataURL(file);
//     }
//   };

//   saveProfile = async () => {
//     const token = localStorage.getItem("token");
//     const { phone, address } = this.state;

//     try {
//       const res = await fetch("http://localhost:8419/users/update", {
//         method: "PUT",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ phone, address }),
//       });

//       if (!res.ok) throw new Error("Update failed");
//       this.setState({ editing: false, error: "Success: Profile updated." });
//       setTimeout(() => this.setState({ error: "" }), 2000);
//     } catch (e) {
//       this.setState({ error: "Failed to update profile." });
//     }
//   };

//   handleThemeChange = () => {
//     const newTheme = this.state.theme === "light" ? "dark" : "light";
//     localStorage.setItem("appTheme", newTheme);
//     this.setState({ theme: newTheme }, () => {
//       document.body.className = newTheme === "dark" ? "bg-gray-900" : "";
//     });
//   };

//   render() {
//     const {
//       fullname, email, phone, address, role, verified, editing, theme, activeTab, profilePic, error
//     } = this.state;

//     return (
//       <>
//         <HeaderBar username={fullname} />
//         <main className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50"} min-h-screen pt-[80px] flex flex-col items-center pb-32`}>
//           <div className="w-full max-w-[490px] my-7 px-2">
//             <div className="flex justify-center mb-5">
//               <TabButton label="Profile Info" active={activeTab === "Profile Info"} onClick={() => this.setState({ activeTab: "Profile Info" })} />
//               <TabButton label="Settings" active={activeTab === "Settings"} onClick={() => this.setState({ activeTab: "Settings" })} />
//             </div>

//             <div className={`relative bg-white/90 rounded-[2.5rem] shadow-xl px-4 md:px-8 pt-7 pb-10 flex flex-col items-center ${theme === "dark" ? "bg-gray-800 text-white" : ""}`}>
//               {error && (
//                 <div className={`mb-4 mt-5 rounded-xl p-3 text-center font-semibold ${error.startsWith("Success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
//                   {error}
//                 </div>
//               )}

//               {activeTab === "Profile Info" && (
//                 <>
//                   <div className="flex flex-col items-center mb-2 w-full mt-12">
//                     <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-pink-400 mb-1 flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 shadow-lg">
//                       {profilePic ? (
//                         <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
//                       ) : (
//                         <FaUser className="w-[90%] h-[90%] text-purple-200" />
//                       )}
//                       <button
//                         onClick={() => this.fileInputRef.current.click()}
//                         className="absolute bottom-0 right-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white p-2 rounded-full shadow-md hover:scale-105 transition-transform"
//                       >
//                         <FaCamera size={18} />
//                       </button>
//                       <input type="file" ref={this.fileInputRef} accept="image/*" style={{ display: "none" }} onChange={this.handleFileSelect} />
//                     </div>

//                     <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
//                       {fullname}
//                     </h2>
//                     {verified && <span className="text-green-500 text-lg font-bold">✅</span>}
//                     <span className="text-xs mt-1 px-2 py-[1px] rounded-full bg-gray-100 text-purple-700 font-medium border border-purple-200 mb-2">
//                       Verified {role}
//                     </span>
//                   </div>

//                   <div className="flex flex-col gap-2 items-center">
//                     <span><b>Email:</b> {email}</span>
//                     <span><b>Phone:</b> {editing ? (
//                       <input type="text" name="phone" value={phone} onChange={this.handleChange} className="border rounded-lg p-1" />
//                     ) : phone || "--"}</span>
//                     <span><b>Address:</b> {editing ? (
//                       <input type="text" name="address" value={address} onChange={this.handleChange} className="border rounded-lg p-1" />
//                     ) : address || "--"}</span>
//                   </div>

//                   {!editing ? (
//                     <button
//                       className="mt-5 py-3 px-8 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white rounded-2xl font-bold shadow hover:scale-105 transition-transform text-base flex items-center gap-2"
//                       onClick={() => this.setState({ editing: true })}
//                     >
//                       <FaEdit /> Edit Profile
//                     </button>
//                   ) : (
//                     <button
//                       className="mt-5 py-3 px-8 bg-gradient-to-r from-green-400 to-purple-400 text-white rounded-2xl font-bold shadow hover:scale-105 transition-transform text-base flex items-center gap-2"
//                       onClick={this.saveProfile}
//                     >
//                       <FaCheckCircle /> Save Changes
//                     </button>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//           <CenteredBottomNav active="profile" />
//         </main>
//       </>
//     );
//   }
// }

// export default Profile;
// import React, { useEffect, useState } from "react";

// export default function Profile() {
//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       window.location.replace("/login");
//       return;
//     }

//     const fetchProfile = async () => {
//       try {
//         const res = await fetch("http://localhost:8419/users/profile", {
//           method: "GET",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (res.status === 401 || res.status === 403) {
//           alert("Session expired. Please login again.");
//           window.location.replace("/login");
//           return;
//         }

//         const data = await res.json();
//         setProfile(data);
//       } catch (err) {
//         console.error("Profile fetch failed:", err);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (!profile)
//     return (
//       <div className="flex justify-center items-center min-h-screen text-lg">
//         Loading profile...
//       </div>
//     );

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">My Profile</h2>
//         <div className="space-y-3 text-gray-700">
//           <p><strong>Full Name:</strong> {profile.fullname}</p>
//           <p><strong>Email:</strong> {profile.email}</p>
//           <p><strong>Role:</strong> {profile.role}</p>
//           <p><strong>Status:</strong> {profile.enabled ? "Active" : "Inactive"}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from "react";
import {
  FaHome, FaPlusSquare, FaRegFileAlt, FaUser,
  FaCamera, FaEdit, FaCheckCircle
} from "react-icons/fa";

// ------------------ Header ------------------
const HeaderBar = ({ username }) => (
  <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 shadow h-[60px] flex items-center px-7">
    <span className="text-2xl font-extrabold text-white">Grievance Portal</span>
    <div className="ml-auto flex items-center gap-3">
      <span className="text-white text-base md:text-lg">Welcome, {username || "User"}</span>
      <button
        className="ml-3 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-full text-base shadow"
        onClick={() => {
          localStorage.clear();
          window.location.replace("/login");
        }}
      >
        Logout
      </button>
    </div>
  </header>
);

// ------------------ Bottom Nav ------------------
const CenteredBottomNav = ({ active }) => (
  <nav className="fixed bottom-5 w-full z-50 flex justify-center pointer-events-none">
    <div
      className="pointer-events-auto flex justify-between items-center
        rounded-[2.2rem] shadow-xl bg-white/95 border border-gray-100
        px-7 py-2 max-w-[420px] w-[90vw]"
    >
      <a href="/dashboard" className={`flex flex-col items-center mx-2 ${active === "dashboard" ? "text-blue-600" : "text-gray-700 hover:text-pink-500"}`}><FaHome size={24} /><span className="text-xs mt-1">Dashboard</span></a>
      <a href="/complaints" className={`flex flex-col items-center mx-2 ${active === "complaints" ? "text-blue-600" : "text-gray-700 hover:text-pink-500"}`}><FaPlusSquare size={24} /><span className="text-xs mt-1">Submit</span></a>
      <a href="/mycomplaints" className={`flex flex-col items-center mx-2 ${active === "mycomplaints" ? "text-blue-600" : "text-gray-700 hover:text-pink-500"}`}><FaRegFileAlt size={24} /><span className="text-xs mt-1">My Complaints</span></a>
      <a href="/profile" className={`flex flex-col items-center mx-2 ${active === "profile" ? "text-blue-600" : "text-gray-700 hover:text-pink-500"}`}><FaUser size={24} /><span className="text-xs mt-1">Profile</span></a>
    </div>
  </nav>
);

// ------------------ Profile Page ------------------
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8419/users/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401 || res.status === 403) {
          alert("Session expired. Please login again.");
          localStorage.clear();
          window.location.replace("/login");
          return;
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setError("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8419/users/update", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: profile.phone,
          address: profile.address,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      setError("✅ Profile updated successfully!");
      setEditing(false);
      setTimeout(() => setError(""), 2500);
    } catch {
      setError("❌ Failed to update profile.");
    }
  };

  if (!profile)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading profile...
      </div>
    );

  return (
    <>
      <HeaderBar username={profile.fullname} />

      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 pt-[80px] flex flex-col items-center pb-32">
        <div className="w-full max-w-[480px] my-8 px-3">
          <div className="relative bg-white/90 rounded-[2.5rem] shadow-xl p-8 text-center">
            {error && (
              <div className={`mb-4 rounded-xl p-3 font-semibold ${error.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {error}
              </div>
            )}

            {/* Profile Picture */}
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-pink-400 flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 shadow-lg">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="w-[90%] h-[90%] text-purple-200" />
              )}
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white p-2 rounded-full shadow-md hover:scale-105 transition-transform"
              >
                <FaCamera size={18} />
              </button>
              <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>

            <h2 className="text-2xl font-extrabold mt-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              {profile.fullname}
            </h2>

            <p className="text-sm text-gray-500 mt-1">Verified {profile.role}</p>

            {/* Profile Details */}
            <div className="text-left mt-6 space-y-2 text-gray-700">
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong>{" "}
                {editing ? (
                  <input
                    type="text"
                    className="border p-1 rounded-lg w-48"
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                ) : profile.phone || "--"}
              </p>
              <p><strong>Address:</strong>{" "}
                {editing ? (
                  <input
                    type="text"
                    className="border p-1 rounded-lg w-48"
                    value={profile.address || ""}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                ) : profile.address || "--"}
              </p>
            </div>

            {!editing ? (
              <button
                className="mt-6 py-3 px-8 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white rounded-2xl font-bold shadow hover:scale-105 transition-transform text-base flex items-center gap-2 mx-auto"
                onClick={() => setEditing(true)}
              >
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <button
                className="mt-6 py-3 px-8 bg-gradient-to-r from-green-400 to-purple-400 text-white rounded-2xl font-bold shadow hover:scale-105 transition-transform text-base flex items-center gap-2 mx-auto"
                onClick={saveProfile}
              >
                <FaCheckCircle /> Save Changes
              </button>
            )}
          </div>
        </div>
        <CenteredBottomNav active="profile" />
      </main>
    </>
  );
}
