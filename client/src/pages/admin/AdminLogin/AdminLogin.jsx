import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import {
  login as apiLogin,
  googleLogin as apiGoogleLogin,
  getProfile,
  logout as apiLogout,
} from "../../../api/authApi";

import { useAuth } from "../../../context/AuthContext.jsx";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Admin Login | Echoo";
  }, []);

  const clearLocalAuth = () => {
    localStorage.removeItem("echoo_session");
    localStorage.removeItem("echoo_access_token");
    localStorage.removeItem("echoo_refresh_token");
    localStorage.removeItem("echoo_login_mode");

    sessionStorage.clear();

    window.dispatchEvent(new CustomEvent("auth:logout"));
  };

  const normalizeRole = (role) => {
    if (!role) return "User";

    const cleanRole = String(role).trim().toLowerCase();

    if (cleanRole === "admin") return "Admin";

    return "User";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkAdminAndRedirect = async () => {
    let profile = null;

    try {
      profile = await getProfile();
    } catch (error) {
      console.error("Admin profile fetch error:", error);
    }

    if (!profile) {
      await apiLogout().catch(() => {});
      clearLocalAuth();

      toast.error("Profile not found. Please login again.");
      navigate("/admin_login", { replace: true });
      return false;
    }

    const role = normalizeRole(profile.role);

    if (role !== "Admin") {
      await apiLogout().catch(() => {});
      clearLocalAuth();

      toast.error("Access denied! Only admin can login here.");
      navigate("/sign_in", { replace: true });
      return false;
    }

    if (refreshUser) {
      await refreshUser();
    }

    localStorage.setItem("echoo_login_mode", "admin");

    toast.success("Admin login successful!");
    navigate("/admin/dashboard", { replace: true });

    return true;
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      clearLocalAuth();

      await apiLogin({
        email: formData.email,
        password: formData.password,
      });

      await checkAdminAndRedirect();
    } catch (error) {
      console.error("Admin login error:", error);

      await apiLogout().catch(() => {});
      clearLocalAuth();

      toast.error(error.message || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      clearLocalAuth();

      localStorage.setItem("echoo_login_mode", "admin");

      await apiGoogleLogin();
    } catch (error) {
      console.error("Google admin login error:", error);

      await apiLogout().catch(() => {});
      clearLocalAuth();

      toast.error(error.message || "Google login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-[36px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex bg-gray-950 text-white p-12 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-8">
              <ShieldCheckIcon className="w-7 h-7" />
            </div>

            <p className="text-sm text-gray-400 mb-4">Echoo Admin Panel</p>

            <h1 className="text-5xl font-bold leading-tight">
              Manage your <br />
              store safely.
            </h1>

            <p className="text-gray-400 mt-6 max-w-sm">
              Add products, manage orders, check active users, view cancelled
              history, and control your full catalog.
            </p>
          </div>

          <div className="relative z-10 text-xs text-gray-500">
            Only users with Admin role can access this dashboard.
          </div>

          <div className="absolute -right-24 -bottom-24 w-72 h-72 rounded-full bg-white/10 blur-2xl"></div>
        </div>

        <div className="p-8 sm:p-12 lg:p-16">
          <div className="flex items-center justify-between mb-12">
            <Link
              to="/sign_in"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              User Login
            </Link>

            <Link
              to="/"
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Home
            </Link>
          </div>

          <div className="max-w-sm mx-auto">
            <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>

            <p className="text-gray-500 text-sm mt-2 mb-8">
              Login only if your Supabase profile role is Admin.
            </p>

            <form onSubmit={handleEmailLogin} className="space-y-5">
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Admin email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-gray-900 text-white font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Checking admin..." : "Login as Admin"}
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </form>

            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400 text-sm">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-4 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Continue with Google as Admin
            </button>

            <p className="text-xs text-gray-400 mt-6 text-center">
              Normal users will be blocked automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;