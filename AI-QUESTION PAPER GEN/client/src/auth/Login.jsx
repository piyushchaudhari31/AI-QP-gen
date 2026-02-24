import React, { useContext, useState } from "react";
import "../auth/login.css";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { authcontext } from "../context/Authcontext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { url } = useContext(authcontext);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);

    const loginPromise = axios.post(
      `${url}/api/admin/login`,
      { email, password },
      { withCredentials: true }
    );

    toast
      .promise(loginPromise, {
        loading: "Logging in...",
        success: (res) => {
          // ✅ Save token & user
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));

          // ✅ ROLE BASED REDIRECT
          const role = res.data.user.role;
          
          

          if (role === "Admin") {
            navigate("/Admin/dashboard");
          } else if (role === "faculty") {
            navigate("/faculty/dashboard");
          } else if (role === "student") {
            navigate("/student/dashboard");
          } else {
            navigate("/");
          }

          return res.data.message || "Login successful 🎉";
        },
        error: (err) => {
          return (
            err.response?.data?.message ||
            "Invalid login credentials ❌"
          );
        },
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-icon">
          <Lock size={26} />
        </div>

        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to continue to your account</p>

        <form onSubmit={handleLogin}>
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
            className="login-btn"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            Sign In
          </button>
        </form>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <button className="google-btn">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
          />
          Continue with Google
        </button>

        <p className="register-text">
          Don’t have an account?{" "}
          <span>
            <Link to="/register">Create Account</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
