import React, { useContext } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  FileText,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../style/sidebar.css";
import { authcontext } from "../../../context/Authcontext";

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { url } = useContext(authcontext);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await axios.post(
        `${url}/api/admin/logOut`,
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  // close sidebar on mobile
  const closeSidebar = () => {
    if (window.innerWidth < 900) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)}></div>}

      <aside className={`sidebar ${open ? "open" : "close"}`}>
        {/* Header */}
        <div className="sidebar-header">
          {open && <h2>Faculty</h2>}

          <button onClick={() => setOpen(!open)}>
            {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="sidebar-menu">
          <NavLink to="/faculty/dashboard" className="link" onClick={closeSidebar}>
            <LayoutDashboard size={20} />
            {open && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/faculty/question-bank" className="link" onClick={closeSidebar}>
            <BookOpen size={20} />
            {open && <span>Question Bank</span>}
          </NavLink>

          <NavLink to="/faculty/generate-paper" className="link" onClick={closeSidebar}>
            <Sparkles size={20} />
            {open && <span>Generate Paper</span>}
          </NavLink>

          <NavLink to="/faculty/my-papers" className="link" onClick={closeSidebar}>
            <FileText size={20} />
            {open && <span>My Papers</span>}
          </NavLink>

          <NavLink to="/faculty/settings" className="link" onClick={closeSidebar}>
            <Settings size={20} />
            {open && <span>Settings</span>}
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="profile">
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

            {open && (
              <div className="profile-info">
                <h4>{user?.fullname}</h4>
                <span>Faculty</span>
              </div>
            )}
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;