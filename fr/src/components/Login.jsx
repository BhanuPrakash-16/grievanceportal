// import React, { Component } from 'react';
// import SignUp from './SignUp';

// class Login extends Component {
//   constructor() {
//     super();
//     this.state = { isSignin: true, loading: false };
//     this.usernameRef = React.createRef();
//     this.passwordRef = React.createRef();
//   }

//   showSignin = () => {
//     this.setState({ isSignin: true });
//     if (this.usernameRef.current) this.usernameRef.current.value = "";
//     if (this.passwordRef.current) this.passwordRef.current.value = "";
//   };

//   showSignup = () => this.setState({ isSignin: false });

//   async forgetpassword() {
//     const email = this.usernameRef.current?.value.trim();
//     if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
//       alert("Enter a valid email");
//       return;
//     }

//     try {
//       const res = await fetch(`http://localhost:8419/users/forgetpassword/${email}`, {
//         method: 'GET',
//       });
//       const text = await res.text();
//       alert(text || "Password reset link sent if account exists.");
//     } catch (err) {
//       alert("Error: " + (err.message || "Server error"));
//     }
//   }

//   async signin(e) {
//   e?.preventDefault();
//   const email = this.usernameRef.current?.value.trim();
//   const password = this.passwordRef.current?.value;

//   if (!email || !password) return alert("Please fill in all fields");
//   if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return alert("Invalid email");

//   this.setState({ loading: true });
//   try {
//     const res = await fetch("http://localhost:8419/users/signin", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const text = await res.text(); // ✅ Parse as text
//     console.log("Server response:", text);

//     // Expected format: 200::message::token::username::role
//     const parts = text.split("::");
//     if (parts[0] !== "200") {
//       alert(parts[1] || "Login failed");
//       return;
//     }

//     const token = parts[2];
//     const username = parts[3] || email;
//     const role = parts[4] || "USER";
//     const fullname = parts[5] || username; 

//     // Save to localStorage
//     localStorage.setItem("token", token);
//     localStorage.setItem("username", username);
//     localStorage.setItem("role", role);
//     localStorage.setItem("fullname", fullname);

//     alert("Login successful!");

//     // Redirect by role
//     const r = role.toUpperCase();
//     if (r === "ADMIN") window.location.replace("/admin");
//     else if (r === "OFFICER") window.location.replace("/officer-dashboard");
//     else window.location.replace("/dashboard");

//   } catch (err) {
//     alert("Error: " + (err.message || "Server error"));
//   } finally {
//     this.setState({ loading: false });
//   }
// }


//   handleKeyPress = (e) => {
//     if (e.key === "Enter") this.signin(e);
//   };

//   render() {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
//         <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
//           <h1 className="text-center text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
//             Officer Grievance Portal
//           </h1>

//           {this.state.isSignin ? (
//             <form onKeyDown={this.handleKeyPress} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-purple-700">Email</label>
//                 <input
//                   ref={this.usernameRef}
//                   type="email"
//                   placeholder="Enter your email"
//                   className="w-full h-12 border border-gray-300 rounded-lg bg-gray-50 px-4 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-purple-700">Password</label>
//                 <input
//                   ref={this.passwordRef}
//                   type="password"
//                   placeholder="Enter your password"
//                   className="w-full h-12 border border-gray-300 rounded-lg bg-gray-50 px-4 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                 />
//               </div>

//               <div className="text-center text-xs text-gray-600">
//                 <span
//                   onClick={() => this.forgetpassword()}
//                   className="text-pink-500 cursor-pointer hover:underline"
//                 >
//                   Forgot Password?
//                 </span>
//               </div>

//               <button
//                 type="button"
//                 onClick={(e) => this.signin(e)}
//                 disabled={this.state.loading}
//                 className={`w-full h-12 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white rounded-lg font-semibold text-lg transition-all shadow-md ${
//                   this.state.loading ? "opacity-50 cursor-not-allowed" : "hover:from-yellow-400 hover:via-pink-500 hover:to-purple-700"
//                 }`}
//               >
//                 {this.state.loading ? "Signing In..." : "Sign In"}
//               </button>

//               <p className="text-center text-sm mt-4 text-gray-600">
//                 New user?{" "}
//                 <span
//                   onClick={this.showSignup}
//                   className="text-pink-500 font-medium cursor-pointer hover:underline"
//                 >
//                   Sign Up
//                 </span>
//               </p>
//             </form>
//           ) : (
//             <SignUp showSignin={this.showSignin} />
//           )}
//         </div>
//       </div>
//     );
//   }
// }

// export default Login;

import React, { useState, useRef } from "react";
import SignUp from "./SignUp";

const Login = () => {
  const [isSignin, setIsSignin] = useState(true);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const showSignin = () => {
    setIsSignin(true);
    if (usernameRef.current) usernameRef.current.value = "";
    if (passwordRef.current) passwordRef.current.value = "";
  };

  const showSignup = () => setIsSignin(false);

  const forgetPassword = async () => {
    const email = usernameRef.current?.value.trim();
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      alert("Enter a valid email");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8419/users/forgetpassword/${email}`);
      const text = await res.text();
      const [code, msg] = text.split("::");
      alert(msg || text);
    } catch (err) {
      alert(err.message || "Server error");
    }
  };

  const signin = async (e) => {
    e?.preventDefault();
    const email = usernameRef.current?.value.trim();
    const password = passwordRef.current?.value;
    if (!email || !password) return alert("Fill all fields");

    try {
      const res = await fetch("http://localhost:8419/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      if (!text) return alert("Server error");

      // Expect "200::<token>::<username>::<role>"
      const [code, token, username, role] = text.split("::");
      if (code !== "200") {
        alert(token);
        return;
      }

      // Save JWT & user details
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      alert("Login successful!");
      setTimeout(() => {
        if (role?.toUpperCase() === "ADMIN") window.location.replace("/admin");
        else if (role?.toUpperCase() === "OFFICER") window.location.replace("/officerdashboard");
        else window.location.replace("/dashboard");
      }, 300);
    } catch (err) {
      alert(err.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-center text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Officer Grievance Portal
        </h1>

        {isSignin ? (
          <form onSubmit={signin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-700">Email</label>
              <input
                ref={usernameRef}
                type="email"
                className="w-full h-12 border border-gray-300 rounded-lg bg-gray-50 px-4 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-700">Password</label>
              <input
                ref={passwordRef}
                type="password"
                className="w-full h-12 border border-gray-300 rounded-lg bg-gray-50 px-4 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="text-center text-xs text-gray-600">
              <span onClick={forgetPassword} className="text-pink-500 cursor-pointer hover:underline">
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-yellow-400 hover:via-pink-500 hover:to-purple-700 transition-all shadow-md"
            >
              Sign In
            </button>

            <p className="text-center text-sm mt-4 text-gray-600">
              New user?{" "}
              <span onClick={showSignup} className="text-pink-500 font-medium cursor-pointer hover:underline">
                Sign Up
              </span>
            </p>
          </form>
        ) : (
          <SignUp showSignin={showSignin} />
        )}
      </div>
    </div>
  );
};

export default Login;
