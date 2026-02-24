import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import "../admin/admin.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
