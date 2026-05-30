import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar.jsx";
import Header from "../Header/Header.jsx";

import "./AdminLayout.css";

/*
  AdminLayout.jsx

  Purpose:
  - Common admin layout
  - Sidebar for admin navigation
  - Header for top admin actions
  - Outlet renders dashboard/users/products/orders pages

  UI is kept same as old admin layout.
*/

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="admin-layout-shell">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="admin-layout-main">
          <div className="admin-layout-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;