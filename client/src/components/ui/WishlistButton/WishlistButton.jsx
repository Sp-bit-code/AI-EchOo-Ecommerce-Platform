import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../../../api/wishlistApi";

import { useAuth } from "../../../context/AuthContext.jsx";

import "./WishlistButton.css";

const getItemProductId = (item) => {
  return item?.product?.id || item?.products?.id || item?.product || item?.product_id;
};

const bubbleBase =
  "relative overflow-hidden bg-gradient-to-b from-gray-500 to-gray-800 " +
  "shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3),_0px_4px_8px_rgba(0,0,0,0.4)] " +
  "ring-1 ring-gray-600 text-white transition-all " +
  "hover:from-gray-400 hover:to-gray-700 hover:scale-105 active:scale-95";

const HeartIcon = ({ isWishlisted, size = "w-4 h-4" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`${size} transition-transform duration-300 ${
        isWishlisted ? "scale-110" : "scale-100"
      }`}
      fill={isWishlisted ? "white" : "none"}
      stroke="white"
      strokeWidth={isWishlisted ? 0 : 2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
};

const useWishlistState = (product) => {
  const { user, profile, isAuthenticated, refreshUser } = useAuth();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    let active = true;

    const checkWishlist = async () => {
      if (!isAuthenticated || !product?.id) {
        setIsWishlisted(false);
        return;
      }

      const localWishlist = Array.isArray(user?.wishlist)
        ? user.wishlist
        : Array.isArray(profile?.wishlist)
          ? profile.wishlist
          : [];

      if (localWishlist.length > 0) {
        setIsWishlisted(
          localWishlist.some(
            (item) => String(getItemProductId(item)) === String(product.id)
          )
        );
        return;
      }

      try {
        const wishlist = await getWishlist();

        if (!active) return;

        const list = Array.isArray(wishlist)
          ? wishlist
          : wishlist?.data || wishlist?.wishlist || [];

        setIsWishlisted(
          list.some((item) => String(getItemProductId(item)) === String(product.id))
        );
      } catch {
        if (active) {
          setIsWishlisted(false);
        }
      }
    };

    checkWishlist();

    return () => {
      active = false;
    };
  }, [isAuthenticated, product?.id, user, profile]);

  const toggleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (loading || !product?.id) return;

    if (!isAuthenticated) {
      toast.error("Please login to manage your wishlist");
      return;
    }

    setRipple(true);
    setTimeout(() => setRipple(false), 500);

    setLoading(true);

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product.id);
        setIsWishlisted(true);
        toast.success("Added to wishlist ♥");
      }

      if (typeof refreshUser === "function") {
        refreshUser();
      }
    } catch (error) {
      toast.error(error?.message || "Error updating wishlist");
    } finally {
      setLoading(false);
    }
  };

  return {
    isWishlisted,
    loading,
    ripple,
    toggleWishlist,
  };
};

export const WishlistButtonLarge = ({ product, className = "" }) => {
  const { isWishlisted, loading, ripple, toggleWishlist } =
    useWishlistState(product);

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      disabled={loading}
      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      className={`
        ${bubbleBase}
        w-12 h-12 rounded-full flex items-center justify-center
        ${loading ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {ripple && (
        <span className="absolute inset-0 rounded-full bg-white/30 animate-ping pointer-events-none" />
      )}

      <HeartIcon isWishlisted={isWishlisted} size="w-5 h-5" />
    </button>
  );
};

const WishlistButton = ({ product, className = "" }) => {
  const { isWishlisted, loading, ripple, toggleWishlist } =
    useWishlistState(product);

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      disabled={loading}
      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      className={`
        ${bubbleBase}
        w-8 h-8 rounded-full flex items-center justify-center
        ${loading ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {ripple && (
        <span className="absolute inset-0 rounded-full bg-white/30 animate-ping pointer-events-none" />
      )}

      <HeartIcon isWishlisted={isWishlisted} size="w-4 h-4" />
    </button>
  );
};

export default WishlistButton;