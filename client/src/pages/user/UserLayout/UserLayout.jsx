import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../../../components/layout/Navbar/Navbar.jsx";

import "./UserLayout.css";

/*
  UserLayout.jsx

  Purpose:
  - Common layout for all user-facing pages
  - Navbar will show on Home, Store, Product, Cart, Profile, etc.
  - Footer is handled inside individual pages to keep old UI identical.
*/

const UserLayout = () => {
  return (
    <div className="user-layout">
      <Navbar />

      <main className="user-layout-main">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;