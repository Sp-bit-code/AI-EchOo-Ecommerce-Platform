import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
} from "../../../api/cartApi";

import SimpleFooter from "../../../components/layout/SimpleFoot/SimpleFoot.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

import "./Cart.css";

const fmt = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

const normalizeCartItem = (item) => {
  const product = item.products || item.product || {};

  const images = product.product_images || product.images || [];

  const primaryImage =
    item.product_image ||
    images?.[0]?.image_url ||
    images?.[0] ||
    "/no-image.png";

  const productPrice =
    item.product_price ||
    item.price ||
    product.discount_price ||
    product.price ||
    0;

  return {
    ...item,
    product,
    product_name: item.product_name || product.name || "Product",
    product_price: Number(productPrice || 0),
    product_image: primaryImage,
    storage: item.storage || item.selected_options?.storage || "",
    ram: item.ram || item.selected_options?.ram || "",
    quantity: Number(item.quantity || 1),
  };
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user: currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const items = await getCart();

      const normalizedItems = (items || []).map(normalizeCartItem);

      setCartItems(normalizedItems);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const changeQty = async (itemId, delta) => {
    const item = cartItems.find((cartItem) => cartItem.id === itemId);

    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);

    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.id === itemId
          ? {
              ...cartItem,
              quantity: newQty,
            }
          : cartItem
      )
    );

    try {
      await updateCartItem(itemId, {
        quantity: newQty,
      });
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
      fetchCart();
    }
  };

  const removeItem = async (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));

    try {
      await removeCartItem(itemId);
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      fetchCart();
    }
  };

  const handleClearCart = async () => {
    setCartItems([]);

    try {
      await clearCartApi();
    } catch (error) {
      console.error("Failed to clear cart:", error);
      fetchCart();
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.product_price || 0) * Number(item.quantity || 1);
  }, 0);

  const shipping = subtotal > 50000 ? 0 : 99;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#d9e8f5] via-[#e2ebf4] to-[#f4f7fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-gray-300 border-t-gray-700 animate-spin"></div>
          <p className="text-gray-500 text-sm font-medium">
            Loading your cart...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#d9e8f5] via-[#e2ebf4] to-[#f4f7fa] flex flex-col items-center justify-center gap-4 p-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Please Sign In
        </h2>

        <Link
          to="/sign_in"
          className="px-8 py-3 rounded-full bg-gradient-to-b from-gray-500 to-gray-800 text-white font-semibold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    const firstName =
      currentUser?.user_metadata?.full_name?.split(" ")[0] ||
      currentUser?.name?.split(" ")[0] ||
      "there";

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#d9e8f5] via-[#e2ebf4] to-[#f4f7fa] flex flex-col items-center justify-center gap-4 p-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Your Bag is Empty
        </h2>

        <p className="text-gray-500 text-sm">
          Hey {firstName}! Nothing here yet.
        </p>

        <Link
          to="/store"
          className="px-8 py-3 rounded-full bg-gradient-to-b from-gray-500 to-gray-800 text-white font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d9e8f5] via-[#e2ebf4] to-[#f4f7fa] pt-20 pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
              Echoo Store
            </p>

            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
              Shopping Bag
            </h1>

            <p className="text-gray-500 mt-2 text-sm">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </p>
          </div>

          <button
            onClick={handleClearCart}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/70 text-sm font-medium text-red-500 hover:bg-red-50 transition-all shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear All
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -40,
                    height: 0,
                  }}
                  transition={{
                    duration: 0.22,
                  }}
                  className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-4 sm:p-5 flex gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-[#d9e8f5] to-[#f4f7fa] rounded-2xl p-2 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight line-clamp-1">
                          {item.product_name}
                        </h3>

                        <p className="text-xs text-gray-500 mt-0.5">
                          {[item.storage, item.ram].filter(Boolean).join(" · ")}
                        </p>

                        <p className="text-base font-bold text-gray-900 mt-2">
                          {fmt(item.product_price)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-full bg-white/60 border border-white/80 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => changeQty(item.id, -1)}
                        className="w-8 h-8 rounded-full bg-white/60 border border-white/80 flex items-center justify-center text-gray-700 font-bold hover:bg-white transition-all text-sm shadow-sm"
                      >
                        −
                      </button>

                      <span className="w-6 text-center font-semibold text-gray-900 text-sm">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => changeQty(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-white/60 border border-white/80 flex items-center justify-center text-gray-700 font-bold hover:bg-white transition-all text-sm shadow-sm"
                      >
                        +
                      </button>

                      <span className="ml-auto text-sm font-semibold text-gray-600">
                        {fmt(item.product_price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium text-gray-900">
                    {fmt(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span
                    className={`font-medium ${
                      shipping === 0 ? "text-emerald-600" : "text-gray-900"
                    }`}
                  >
                    {shipping === 0 ? "Free ✓" : fmt(shipping)}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-gray-400 bg-blue-50 rounded-xl px-3 py-2">
                    Add {fmt(50000 - subtotal)} more for free shipping
                  </p>
                )}

                <div className="h-px bg-white/80 my-2" />

                <div className="flex justify-between font-bold text-base text-gray-900">
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 py-4 rounded-full font-bold text-sm tracking-wide bg-gradient-to-b from-gray-500 to-gray-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3),_0px_4px_8px_rgba(0,0,0,0.4)] ring-1 ring-gray-600 text-white hover:from-gray-400 hover:to-gray-700 transition-all"
              >
                Checkout →
              </button>

              <Link
                to="/store"
                className="block text-center mt-4 text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <SimpleFooter />
      </div>
    </div>
  );
};

export default CartPage;