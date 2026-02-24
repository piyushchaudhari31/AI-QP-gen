import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import "../student/studentcontent.css";
import StudentSidebar from "./Page/Sidebar";
import { Menu } from "lucide-react";

const StudentLayout = () => {

  const [open, setOpen] = useState(false);

  return (
    <div className="student-layout">

      {/* Mobile Topbar */}
      <div className="mobile-topbar">
        <Menu size={24} onClick={() => setOpen(!open)} />
        <h3>Student Panel</h3>
      </div>

      <StudentSidebar open={open} setOpen={setOpen} />

      <div className="student-content">
        <Outlet />
      </div>

    </div>
  );
};

export default StudentLayout;