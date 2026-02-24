import React, { useContext, useState } from "react";
import "../auth/register.css";
import { Mail, Lock, User } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { authcontext } from "../context/Authcontext";

const Register = () => {
  const navigate = useNavigate();
  const { url } = useContext(authcontext);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();

    if (!fullname || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    const registerPromise = axios.post(
      `${url}/api/admin/register`,
      { fullname, email, password },
      { withCredentials: true }
    );

    toast.promise(registerPromise, {
      loading: "Creating account...",
      success: (res) => {

       navigate('/login')

        return res.data.message || "Registered Successfully 🎉";
      },
      error: (err) => {
        return err.response?.data?.message || "Registration Failed ❌";
      },
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">

        <div className="register-icon">
          <User size={26} />
        </div>

        <h2>Create Account</h2>
        <p className="subtitle">Register to continue</p>

        <form onSubmit={handleRegister}>

          {/* Full Name */}
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-box">
              <User size={18} />
              <input
                type="text"
                placeholder="Enter your fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-box">
              <Mail size={18} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>
            <div className="input-box">
              <Lock size={18} />
              <input
                type="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            className="register-btn"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <span>
            <Link to="/login">Login</Link>
          </span>
        </p>

      </div>
    </div>
  );
};

export default Register;
