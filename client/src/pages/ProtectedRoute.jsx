import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import "../styles/App.css";

const normalizeRole = (role) => {
  if (!role) return "User";

  const cleanRole = String(role).trim().toLowerCase();

  if (cleanRole === "admin") return "Admin";

  return "User";
};

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, profile, user, role, authLoading } = useAuth();
  const location = useLocation();

  const currentRole = normalizeRole(
    role ||
      profile?.role ||
      user?.role ||
      user?.user_metadata?.role ||
      user?.authUser?.user_metadata?.role
  );

  if (authLoading) {
    return (
      <div className="protected-loader">
        <div className="protected-loader-box">
          <div className="protected-loader-spinner"></div>
          <span>Checking authentication...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign_in" state={{ from: location }} replace />;
  }

  /*
    Admin protection:
    - Only Admin can open /admin routes
    - Normal user goes home
  */
  if (requiredRole === "Admin" && currentRole !== "Admin") {
    return <Navigate to="/" replace />;
  }

  /*
    User protection:
    - Any logged-in account can open user pages
    - Do NOT redirect admin automatically from profile/cart/checkout
    - Admin login blocking from normal login will be handled in LoginForm
  */
  if (requiredRole === "User") {
    return children;
  }

  return children;
};

export default ProtectedRoute;