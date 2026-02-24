import React, { useContext, useState } from "react";
import "../style/sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { authcontext } from "../../../context/Authcontext";

const Sidebar = () => {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const {url} = useContext(authcontext)

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
      setOpen(false)
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const handleClose = () => {
    if(window.innerWidth <= 900){
      setOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Topbar */}
      <div className="mobile-topbar">
        <Menu onClick={()=>setOpen(true)} />
      </div>

      <aside className={`sidebar ${open ? "show" : ""}`}>
        <div className="close-btn">
          <X onClick={()=>setOpen(false)} />
        </div>

        <h2 className="sidebar-title">Admin Panel</h2>

        <nav>
          <NavLink to="/Admin/dashboard" onClick={handleClose}>
            <LayoutDashboard size={18}/> Dashboard
          </NavLink>

          <NavLink to="/Admin/users" onClick={handleClose}>
            <Users size={18}/> User Management
          </NavLink>

          <NavLink to="/Admin/subjects" onClick={handleClose}>
            <BookOpen size={18}/> Subject Management
          </NavLink>

          <NavLink to="/Admin/papers" onClick={handleClose}>
            <FileText size={18}/> Question Papers
          </NavLink>

          <NavLink to="/Admin/settings" onClick={handleClose}>
            <Settings size={18}/> Settings
          </NavLink>
        </nav>

        <div className="logout" onClick={handleLogout}>
          <LogOut size={18}/> Logout
        </div>
      </aside>
    </>
  );
};

export default Sidebar;