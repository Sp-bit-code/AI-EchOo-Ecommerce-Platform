import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

import { getProfile } from "../../../api/authApi";
import { getCart } from "../../../api/cartApi";
import { getMyOrders } from "../../../api/orderApi";
import { getWishlist } from "../../../api/wishlistApi";

import { useAuth } from "../../../context/AuthContext.jsx";

import CartSection from "../../../components/profile/CartSection/CartSection.jsx";
import OrdersSection from "../../../components/profile/OrdersSection/OrdersSection.jsx";
import OverviewSection from "../../../components/profile/OverviewSection/OverviewSection.jsx";
import ProfileSidebar from "../../../components/profile/ProfileSidebar/ProfileSidebar.jsx";
import WishlistSection from "../../../components/profile/WishlistSection/WishlistSection.jsx";
import SimpleFooter from "../../../components/layout/SimpleFoot/SimpleFoot.jsx";

import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);

  const normalizeProfile = (profile) => {
    return {
      ...profile,
      name: profile?.full_name || profile?.name || profile?.email || "User",
      full_name: profile?.full_name || profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      role: profile?.role || "User",
      avatar_url: profile?.avatar_url || null,
    };
  };

  const refreshProfile = useCallback(async () => {
    try {
      setLoading(true);

      const profile = await getProfile();

      if (!profile) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const [ordersRes, cartRes, wishlistRes] = await Promise.allSettled([
        getMyOrders(),
        getCart(),
        getWishlist(),
      ]);

      const normalizedProfile = normalizeProfile(profile);

      const nextUser = {
        ...normalizedProfile,
        order: ordersRes.status === "fulfilled" ? ordersRes.value || [] : [],
        orders: ordersRes.status === "fulfilled" ? ordersRes.value || [] : [],
        cart: cartRes.status === "fulfilled" ? cartRes.value || [] : [],
        wishlist:
          wishlistRes.status === "fulfilled" ? wishlistRes.value || [] : [],
      };

      setCurrentUser(nextUser);

      if (ordersRes.status === "rejected") {
        console.error("Orders load failed:", ordersRes.reason);
      }

      if (cartRes.status === "rejected") {
        console.error("Cart load failed:", cartRes.reason);
      }

      if (wishlistRes.status === "rejected") {
        console.error("Wishlist load failed:", wishlistRes.reason);
      }
    } catch (error) {
      console.error("Profile load error:", error);

      const message = String(error?.message || "").toLowerCase();

      if (
        error?.status === 401 ||
        error?.status === 403 ||
        message.includes("jwt") ||
        message.includes("not logged in") ||
        message.includes("please login")
      ) {
        await logout();
        navigate("/sign_in", { replace: true });
        return;
      }

      toast.error("Could not load your profile. Please try again.");
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!active) return;
      await refreshProfile();
    };

    load();

    return () => {
      active = false;
    };
  }, [refreshProfile]);

  const handleLogout = async () => {
    await logout();
    navigate("/sign_in", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#d9e8f5] via-[#e2ebf4] to-[#f4f7fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-gray-300 border-t-gray-700 animate-spin"></div>
          <p className="text-gray-500 text-sm font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#d9e8f5] via-[#e2ebf4] to-[#f4f7fa] flex flex-col items-center justify-center gap-4 p-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Please Sign In
        </h2>

        <button
          onClick={() => navigate("/sign_in")}
          className="px-6 py-3 rounded-full bg-gradient-to-b from-gray-500 to-gray-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3),_0px_4px_8px_rgba(0,0,0,0.4)] ring-1 ring-gray-600 text-white font-semibold hover:from-gray-400 hover:to-gray-700 transition-all"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const sectionLabels = {
    overview: "Overview",
    orders: "My Orders",
    wishlist: "Wishlist",
    cart: "My Cart",
  };

  const firstName =
    currentUser.name?.split(" ")[0] ||
    currentUser.full_name?.split(" ")[0] ||
    "User";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d9e8f5] via-[#e2ebf4] to-[#f4f7fa] pt-20 pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
              My Account
            </p>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
              {sectionLabels[activeSection]}
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Welcome back,{" "}
              <span className="font-medium text-gray-700">{firstName}</span>!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshProfile}
              title="Refresh"
              className="w-10 h-10 rounded-full bg-white/50 border border-white/70 flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-800 transition-all shadow-sm"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/50 border border-white/70 text-sm font-semibold text-gray-700 hover:bg-white transition-all shadow-sm"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <ProfileSidebar
            user={currentUser}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />

          <div className="flex-1 min-w-0">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
              {activeSection === "overview" && (
                <OverviewSection
                  user={currentUser}
                  setActiveSection={setActiveSection}
                />
              )}

              {activeSection === "orders" && (
                <OrdersSection user={currentUser} onRefresh={refreshProfile} />
              )}

              {activeSection === "wishlist" && (
                <WishlistSection
                  user={currentUser}
                  onRefresh={refreshProfile}
                />
              )}

              {activeSection === "cart" && <CartSection user={currentUser} />}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <SimpleFooter />
      </div>
    </div>
  );
};

export default Profile;