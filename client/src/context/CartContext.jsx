import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCart,
  addToCart as addToCartRequest,
  updateCartItem as updateCartItemRequest,
  increaseCartItem as increaseCartItemRequest,
  decreaseCartItem as decreaseCartItemRequest,
  removeCartItem as removeCartItemRequest,
  clearCart as clearCartRequest,
  calculateCartSummary,
} from "../api/cartApi";

import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartSummary, setCartSummary] = useState({
    totalItems: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
  });
  const [cartLoading, setCartLoading] = useState(false);

  /*
    fetchCart()

    Old project:
    - Cart was fetched from Django apiService.js

    New project:
    - Cart is fetched from Supabase cart_items table using cartApi.js
  */

  const fetchCart = useCallback(async () => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setCartItems([]);
      setCartCount(0);
      setCartSummary({
        totalItems: 0,
        subtotal: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
        total: 0,
      });
      return;
    }

    try {
      setCartLoading(true);

      const items = await getCart();
      const summary = calculateCartSummary(items);

      setCartItems(items);
      setCartCount(summary.totalItems);
      setCartSummary(summary);
    } catch (error) {
      console.error("Failed to fetch cart details:", error);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setCartLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  /*
    addToCart()

    Usage:
    await addToCart(product.id, 1)
  */

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      const item = await addToCartRequest({
        productId,
        quantity,
      });

      await fetchCart();

      return item;
    },
    [fetchCart]
  );

  /*
    updateCartItem()

    Usage:
    await updateCartItem(cartItem.id, 3)
  */

  const updateCartItem = useCallback(
    async (cartItemId, quantity) => {
      const item = await updateCartItemRequest(cartItemId, {
        quantity,
      });

      await fetchCart();

      return item;
    },
    [fetchCart]
  );

  /*
    increaseCartItem()

    Usage:
    await increaseCartItem(cartItem.id)
  */

  const increaseCartItem = useCallback(
    async (cartItemId) => {
      const item = await increaseCartItemRequest(cartItemId);
      await fetchCart();
      return item;
    },
    [fetchCart]
  );

  /*
    decreaseCartItem()

    Usage:
    await decreaseCartItem(cartItem.id)
  */

  const decreaseCartItem = useCallback(
    async (cartItemId) => {
      const item = await decreaseCartItemRequest(cartItemId);
      await fetchCart();
      return item;
    },
    [fetchCart]
  );

  /*
    removeCartItem()

    Usage:
    await removeCartItem(cartItem.id)
  */

  const removeCartItem = useCallback(
    async (cartItemId) => {
      await removeCartItemRequest(cartItemId);
      await fetchCart();
      return true;
    },
    [fetchCart]
  );

  /*
    clearCart()

    Usage:
    await clearCart()
  */

  const clearCart = useCallback(async () => {
    await clearCartRequest();

    setCartItems([]);
    setCartCount(0);
    setCartSummary({
      totalItems: 0,
      subtotal: 0,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: 0,
    });

    return true;
  }, []);

  /*
    Auto fetch cart when auth state changes.
  */

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /*
    Clear cart state on forced logout.
  */

  useEffect(() => {
    const handleLogout = () => {
      setCartItems([]);
      setCartCount(0);
      setCartSummary({
        totalItems: 0,
        subtotal: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
        total: 0,
      });
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  const cartValue = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartSummary,
      cartLoading,

      fetchCart,
      addToCart,
      updateCartItem,
      increaseCartItem,
      decreaseCartItem,
      removeCartItem,
      clearCart,

      setCartItems,
      setCartCount,
    }),
    [
      cartItems,
      cartCount,
      cartSummary,
      cartLoading,
      fetchCart,
      addToCart,
      updateCartItem,
      increaseCartItem,
      decreaseCartItem,
      removeCartItem,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }

  return ctx;
};

export default CartContext;