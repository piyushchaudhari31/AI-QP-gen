import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const FacultyLayout = () => {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar open={open} setOpen={setOpen} />

      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet context={{ setOpen }} />
      </div>
    </div>
  );
};

export default FacultyLayout;
