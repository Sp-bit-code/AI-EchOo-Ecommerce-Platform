import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  X,
  Menu,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

import "./Sidebar.css";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: Package,
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`admin-sidebar ${
          sidebarOpen ? "admin-sidebar-open" : "admin-sidebar-closed"
        }`}
      >
        {/* Header */}
        <div className="admin-sidebar-header">
          <div
            className="admin-sidebar-brand"
            onClick={() => navigate("/admin")}
          >
            <img
              alt="EchOo."
              src="/Echoo-transparent.png"
              className="admin-sidebar-logo"
            />

            <div>
              <h1 className="admin-sidebar-title">EchOo</h1>
              <p className="admin-sidebar-subtitle">Admin Panel</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="admin-sidebar-close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav">
          <div className="admin-sidebar-nav-list">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`admin-sidebar-link ${
                    isActive
                      ? "admin-sidebar-link-active"
                      : "admin-sidebar-link-normal"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="admin-sidebar-link-left">
                    <IconComponent
                      className={`w-5 h-5 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />

                    <span className="admin-sidebar-link-text">
                      {item.name}
                    </span>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 transition-all ${
                      isActive
                        ? "text-white translate-x-0"
                        : "text-gray-300 -translate-x-1 opacity-0 group-hover:text-gray-400 group-hover:translate-x-0 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="admin-sidebar-mobile-button"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>
    </>
  );
};

export default Sidebar;