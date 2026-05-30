import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
} from "../api/orderApi";

import { useAuth } from "../context/AuthContext";

const normalizeOrderItem = (item = {}) => {
  const product = item.products || item.product || {};

  return {
    ...item,
    product,
    product_id: item.product_id || product.id || "",
    product_name: item.product_name || product.name || "Product",
    product_price: Number(
      item.product_price || item.price || product.price || 0
    ),
    product_image:
      item.product_image ||
      product.product_images?.[0]?.image_url ||
      product.images?.[0]?.image_url ||
      product.images?.[0] ||
      "/no-image.png",
    quantity: Number(item.quantity || 1),
  };
};

const normalizeOrder = (order = {}) => {
  const profile = order.profiles || order.profile || {};
  const items = order.order_items || order.items || [];

  return {
    ...order,
    id: order.id,
    user_id: order.user_id || profile.id || "",
    userName:
      order.userName ||
      order.user_name ||
      profile.full_name ||
      profile.name ||
      profile.email ||
      "User",
    userEmail:
      order.userEmail ||
      order.user_email ||
      profile.email ||
      "",
    total: Number(order.total || order.total_amount || order.amount || 0),
    subtotal: Number(order.subtotal || order.total || order.total_amount || 0),
    shipping: Number(order.shipping || 0),
    status: order.status || order.order_status || "pending",
    payment_method:
      order.payment_method ||
      order.paymentMethod ||
      order.payment_type ||
      "cod",
    payment_status:
      order.payment_status ||
      order.paymentStatus ||
      "pending",
    shipping_address:
      order.shipping_address ||
      order.shippingAddress ||
      order.address ||
      {},
    created_at: order.created_at || order.createdAt || null,
    items: items.map(normalizeOrderItem),
  };
};

const useOrders = (options = {}) => {
  const { autoFetch = true } = options;

  const { user, isAuthenticated, authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(autoFetch);
  const [ordersError, setOrdersError] = useState("");

  const fetchOrders = useCallback(async () => {
    if (authLoading) {
      return [];
    }

    if (!isAuthenticated || !user?.id) {
      setOrders([]);
      setOrdersLoading(false);
      return [];
    }

    try {
      setOrdersLoading(true);
      setOrdersError("");

      const response = await getUserOrders(user.id);
      const list = Array.isArray(response)
        ? response
        : response?.data || response?.orders || [];

      const normalizedOrders = list.map(normalizeOrder);

      setOrders(normalizedOrders);

      return normalizedOrders;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrdersError(error.message || "Failed to fetch orders");
      setOrders([]);
      return [];
    } finally {
      setOrdersLoading(false);
    }
  }, [authLoading, isAuthenticated, user?.id]);

  const fetchOrderById = useCallback(async (orderId) => {
    if (!orderId) {
      throw new Error("Order ID is required.");
    }

    const response = await getOrderById(orderId);
    const order = response?.data || response;

    return normalizeOrder(order);
  }, []);

  const placeOrder = useCallback(
    async (payload) => {
      if (!isAuthenticated || !user?.id) {
        throw new Error("Please sign in to place an order.");
      }

      const finalPayload = {
        ...payload,
        user_id: payload.user_id || user.id,
      };

      const response = await createOrder(finalPayload);
      const order = response?.data || response;

      await fetchOrders();

      return normalizeOrder(order);
    },
    [fetchOrders, isAuthenticated, user?.id]
  );

  const cancelUserOrder = useCallback(
    async (orderId) => {
      if (!orderId) {
        throw new Error("Order ID is required.");
      }

      const response = await cancelOrder(orderId);

      await fetchOrders();

      return response?.data || response;
    },
    [fetchOrders]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchOrders();
    }
  }, [autoFetch, fetchOrders]);

  const orderStats = useMemo(() => {
    const totalOrders = orders.length;

    const totalSpent = orders.reduce((sum, order) => {
      return sum + Number(order.total || 0);
    }, 0);

    const pendingOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;

    const completedOrders = orders.filter(
      (order) => order.status === "completed"
    ).length;

    const cancelledOrders = orders.filter(
      (order) => order.status === "cancelled"
    ).length;

    return {
      totalOrders,
      totalSpent,
      pendingOrders,
      completedOrders,
      cancelledOrders,
    };
  }, [orders]);

  return {
    orders,
    ordersLoading,
    ordersError,
    orderStats,
    fetchOrders,
    fetchOrderById,
    placeOrder,
    cancelUserOrder,
    setOrders,
  };
};

export default useOrders;
export { useOrders };