import React, { useContext, useState } from "react";
import "../style/navbar.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { authcontext } from "../context/Authcontext";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const {url} = useContext(authcontext)

  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      await axios.post(
        `${url}/api/admin/logOut`,
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setOpen(false);

      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const user = JSON.parse(localStorage.getItem("user"))




  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        <div className="logo-icon">
          <img src={logo} alt="AI QPG Logo" />
        </div>
        <span className="logo-text">
          AI-QP
          <span className="mobile-br"><br /></span>
          Generator
        </span>
      </div>

      {/* CENTER – Dashboard (only when logged in) */}


      {/* RIGHT */}
      {/* RIGHT */}
      <div className="nav-right">
        {!token ? (
          <button className="nav-btn" onClick={() => navigate("/login")}>
            Get Started →
          </button>
        ) : (
          <div className="profile-wrapper">
            <div className="profile-toggle" onClick={() => setOpen(!open)}>
              <img
                src={
                  user?.image
                    ? user.image
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.fullname || "User"
                    )}&background=000&color=fff`
                }
                alt="profile"
                className="profile-img"
              />
              <span className="dropdown-icon">{open ? "▲" : "▼"}</span>
            </div>

            {open && (
              <div className="profile-dropdown">
                <span className="mobile-only" onClick={() => navigate(`/${user.role}/dashboard`)}>
                  Dashboard
                </span>
                <span onClick={() => navigate(`/${user.role}/settings`)}>Settings</span>
                <span className="logout" onClick={handleLogout}>Logout</span>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
