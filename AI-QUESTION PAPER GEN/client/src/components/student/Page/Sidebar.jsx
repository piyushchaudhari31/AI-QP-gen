import React from "react";
import "../style/sidebar.css";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  LogOut,
  FileQuestion,
  Settings,
} from "lucide-react";

import { NavLink, useNavigate, useLocation } from "react-router-dom";

const StudentSidebar = ({ open, setOpen }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const closeSidebar = () => {
    if (window.innerWidth < 900) {
      setOpen(false);
    }
  };

  const isAiTestActive =
    location.pathname.includes("/student/performance") ||
    location.pathname.includes("/student/exam");

  return (
    <aside className={`student-sidebar ${open ? "show" : ""}`}>

      <div className="student-header">
        <h2>Student</h2>
      </div>

      <ul className="student-menu">

        <NavLink
          to="/student/dashboard"
          className={`menu-item ${location.pathname.includes("/student/dashboard") ? "active" : ""}`}
          onClick={closeSidebar}
        >
          <LayoutDashboard size={18}/>
          Dashboard
        </NavLink>

        <NavLink
          to="/student/QuestionPaper"
          className={`menu-item ${location.pathname.includes("/student/QuestionPaper") ? "active" : ""}`}
          onClick={closeSidebar}
        >
          <FileQuestion size={18}/>
          Question Paper
        </NavLink>

        <NavLink
          to="/student/questionBank"
          className={`menu-item ${location.pathname.includes("/student/questionBank") ? "active" : ""}`}
          onClick={closeSidebar}
        >
          <BookOpen size={18}/>
          Question Bank
        </NavLink>

        {/* AI TEST FIX */}
        <NavLink
          to="/student/performance"
          className={`menu-item ${isAiTestActive ? "active" : ""}`}
          onClick={closeSidebar}
        >
          <Sparkles size={18}/>
          AI Test
        </NavLink>

        <NavLink
          to="/student/settings"
          className={`menu-item ${location.pathname.includes("/student/settings") ? "active" : ""}`}
          onClick={closeSidebar}
        >
          <Settings size={18}/>
          Settings
        </NavLink>

      </ul>

      <div className="student-bottom">

        <div className="student-profile">
          <img
            src={
              user?.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.fullname || "User"
              )}&background=000&color=fff`
            }
            alt="profile"
          />
          <div>
            <h4>{user?.fullname}</h4>
            <p>{user?.email}</p>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16}/>
          Logout
        </button>

      </div>

    </aside>
  );
};

export default StudentSidebar;