import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./page/Sidebar";
import "../faculty/facultycontent.css";

const FacultyHome = () => {
  const [open, setOpen] = useState(window.innerWidth > 900);

  return (
    <div className="faculty-layout">

      <Sidebar open={open} setOpen={setOpen} />

      <div className="faculty-content">

        {/* MOBILE HEADER */}
        <div className="mobile-header">
          <button onClick={() => setOpen(true)}>
            <Menu size={26} />
          </button>

          <h3>Faculty Panel</h3>
        </div>

        <Outlet />
      </div>

    </div>
  );
};

export default FacultyHome;