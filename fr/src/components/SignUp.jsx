import React, { Component } from 'react';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'signup', // 'signup' or 'verify'
      email: '',
      fullname: '',
      role: '',
      password: '',
      loading: false,
    };
  }

  async handleSignup(e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const role = document.getElementById('role').value;
    const password = document.getElementById('signuppassword').value;
    const confirm = document.getElementById('confirmpassword').value;

    ['fullname', 'email', 'role', 'signuppassword', 'confirmpassword'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.border = '';
    });

    if (!fullname) return this.highlight('fullname');
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) return this.highlight('email', 'Invalid email');
    if (!role) return this.highlight('role');
    if (!password) return this.highlight('signuppassword');
    if (password !== confirm) return this.highlight('signuppassword', 'Passwords do not match');

    this.setState({ loading: true });

    try {
      const response = await fetch("http://localhost:8419/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, role, password }),
      });

      const text = await response.text();
      this.getResponse(text, () => {
        this.setState({ step: 'verify', email, fullname, role, password });
      });
    } catch (error) {
      alert("⚠️ Server error: " + error.message);
    } finally {
      this.setState({ loading: false });
    }
  }

  async handleVerifyOtp(e) {
    e.preventDefault();
    const otp = document.getElementById('otp').value.trim();
    if (!otp || otp.length !== 6) {
      document.getElementById('otp').style.border = '1px solid red';
      return alert("Enter valid 6-digit OTP");
    }

    this.setState({ loading: true });

    try {
      const response = await fetch("http://localhost:8419/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.state.email, otp }),
      });

      const text = await response.text();
      this.getResponse(text, () => {
        alert("✅ Account verified! You can now sign in.");
        if (this.props.showSignin) this.props.showSignin();
      });
    } catch (error) {
      alert("⚠️ Server error: " + error.message);
    } finally {
      this.setState({ loading: false });
    }
  }

  getResponse(res, onSuccess) {
    if (!res) return alert("No response from server.");
    const [code, message] = res.split("::");
    if (code === "200") {
      alert("✅ " + message);
      if (onSuccess) onSuccess();
    } else {
      alert("❌ " + message);
    }
  }

  highlight(id, msg = "Required") {
    const el = document.getElementById(id);
    if (el) {
      el.style.border = "1px solid red";
      el.focus();
    }
    alert(msg);
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.state.step === 'signup' ? this.handleSignup(e) : this.handleVerifyOtp(e);
    }
  }

  render() {
    const { step, loading } = this.state;

    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl">
        {step === 'signup' ? (
          <>
            <h2 className="text-center text-2xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Create Your Account
            </h2>

            <form onKeyDown={(e) => this.handleKeyPress(e)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700">Full Name</label>
                  <input id="fullname" type="text" className="w-full h-12 border border-gray-300 rounded-lg px-4 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700">Email</label>
                  <input id="email" type="email" className="w-full h-12 border border-gray-300 rounded-lg px-4 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-purple-700">Select Role</label>
                  <select id="role" className="w-full h-12 border border-gray-300 rounded-lg px-4 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500">
                    <option value="">Select Role</option>
                    <option value="USER">User</option>
                    <option value="OFFICER">Officer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700">Password</label>
                  <input id="signuppassword" type="password" className="w-full h-12 border border-gray-300 rounded-lg px-4 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700">Confirm Password</label>
                  <input id="confirmpassword" type="password" className="w-full h-12 border border-gray-300 rounded-lg px-4 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => this.handleSignup(e)}
                disabled={loading}
                className={`w-full h-12 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white rounded-lg font-semibold text-lg mt-6 transition-all shadow-md hover:shadow-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:from-yellow-400 hover:to-purple-700"
                }`}
              >
                {loading ? "Registering..." : "Register"}
              </button>

              <p className="text-center text-sm mt-4 text-gray-600">
                Already have an account?{" "}
                <span
                  onClick={() => this.props.showSignin?.()}
                  className="text-pink-500 font-medium cursor-pointer hover:text-purple-700 hover:underline"
                >
                  Sign In
                </span>
              </p>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-center text-2xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Verify Your Email
            </h2>
            <div className="text-center text-sm text-gray-600 mb-6">
              We sent a 6-digit OTP to <strong>{this.state.email}</strong>
            </div>

            <form onKeyDown={(e) => this.handleKeyPress(e)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-700">Enter OTP</label>
                <input
                  id="otp"
                  type="text"
                  maxLength="6"
                  placeholder="123456"
                  className="w-full h-12 text-center text-xl font-mono border border-gray-300 rounded-lg px-4 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="button"
                onClick={(e) => this.handleVerifyOtp(e)}
                disabled={loading}
                className={`w-full h-12 bg-gradient-to-r from-green-400 to-blue-600 text-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:from-green-500 hover:to-blue-700"
                }`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <p className="text-center text-xs text-gray-500">
                Didn’t receive? Check spam or{" "}
                <span onClick={() => this.setState({ step: 'signup' })} className="text-pink-500 cursor-pointer hover:underline">
                  try again
                </span>
              </p>
            </form>
          </>
        )}
      </div>
    );
  }
}

export default SignUp;
