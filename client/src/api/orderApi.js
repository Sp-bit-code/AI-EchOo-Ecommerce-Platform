import { supabase } from "./supabaseClient";
import { getCurrentUser } from "./authApi";
import { getCart, clearCart, calculateCartSummary } from "./cartApi";

/*
  orderApi.js

  Fixed version:
  - Uses fresh Supabase session token
  - Uses token.sub as user id for RLS-safe order insert
  - Handles JWT expired by refreshing session once
  - Prevents duplicate order creation from repeated clicks
  - Reuses recent pending order for same user + amount + payment method
  - Avoids breaking payment success if payment record already exists from backend
*/

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error("Missing VITE_SUPABASE_URL");
}

if (!SUPABASE_KEY) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY");
}

/* -------------------------------------------------------------------------- */
/* Runtime duplicate guards                                                    */
/* -------------------------------------------------------------------------- */

let createOrderInProgress = false;

/* -------------------------------------------------------------------------- */
/* Token Helpers                                                               */
/* -------------------------------------------------------------------------- */

const decodeJwtPayload = (token) => {
  if (!token || !token.includes(".")) {
    return null;
  }

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }
};

const getFreshAccessToken = async () => {
  const storedToken = localStorage.getItem("echoo_access_token");
  const storedPayload = decodeJwtPayload(storedToken);

  if (storedToken && storedPayload?.exp * 1000 > Date.now()) {
    return storedToken;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    localStorage.setItem("echoo_access_token", session.access_token);

    if (session.refresh_token) {
      localStorage.setItem("echoo_refresh_token", session.refresh_token);
    }

    return session.access_token;
  }

  const {
    data: { session: refreshedSession },
  } = await supabase.auth.refreshSession();

  if (refreshedSession?.access_token) {
    localStorage.setItem("echoo_access_token", refreshedSession.access_token);

    if (refreshedSession.refresh_token) {
      localStorage.setItem("echoo_refresh_token", refreshedSession.refresh_token);
    }

    return refreshedSession.access_token;
  }

  return null;
};

/* -------------------------------------------------------------------------- */
/* REST Helper                                                                 */
/* -------------------------------------------------------------------------- */

const restFetch = async (path, options = {}, retry = true) => {
  const token = await getFreshAccessToken();

  if (!token) {
    throw new Error("Please login first");
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: options.method || "GET",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();

  if (!response.ok) {
    let parsedError = null;

    try {
      parsedError = text ? JSON.parse(text) : null;
    } catch {
      parsedError = null;
    }

    const isJwtExpired =
      response.status === 401 ||
      parsedError?.code === "PGRST303" ||
      parsedError?.message?.toLowerCase?.().includes("jwt expired");

    if (isJwtExpired && retry) {
      await supabase.auth.refreshSession();
      return restFetch(path, options, false);
    }

    console.error("Order REST error:", response.status, text);

    const error = new Error(
      parsedError?.message || text || "Order request failed"
    );

    error.status = response.status;
    error.code = parsedError?.code;
    error.details = parsedError?.details;
    error.raw = parsedError || text;

    throw error;
  }

  return text ? JSON.parse(text) : null;
};

const encodeSelect = (select) => {
  return encodeURIComponent(select.replace(/\s+/g, ""));
};

const ORDER_SELECT = `
  *,
  order_items(
    *,
    products(
      *,
      product_images(*)
    )
  ),
  payments(*)
`;

/* -------------------------------------------------------------------------- */
/* Helper: Require Logged-In User                                              */
/* -------------------------------------------------------------------------- */

const requireUser = async () => {
  const token = await getFreshAccessToken();

  if (!token) {
    throw new Error("Please login first");
  }

  const payload = decodeJwtPayload(token);

  if (!payload?.sub || payload?.role !== "authenticated") {
    throw new Error("Session invalid. Please login again.");
  }

  return {
    id: payload.sub,
    email: payload.email || "",
    role: payload.role,
  };
};

/* -------------------------------------------------------------------------- */
/* Helper: Get Product Price                                                   */
/* -------------------------------------------------------------------------- */

const getItemPrice = (item) => {
  const product = item.products || item.product;

  if (!product) {
    return Number(item.price || 0);
  }

  return Number(product.discount_price || product.price || item.price || 0);
};

/* -------------------------------------------------------------------------- */
/* Helper: Get Product ID                                                      */
/* -------------------------------------------------------------------------- */

const getProductId = (item) => {
  const product = item.products || item.product;

  return item.product_id || product?.id || item.id;
};

/* -------------------------------------------------------------------------- */
/* Helper: Format Order Items                                                  */
/* -------------------------------------------------------------------------- */

const formatOrderItems = (items = [], orderId) => {
  return items.map((item) => {
    return {
      order_id: orderId,
      product_id: getProductId(item),
      quantity: Number(item.quantity || 1),
      price: getItemPrice(item),
    };
  });
};

/* -------------------------------------------------------------------------- */
/* Helper: Find recent pending duplicate order                                 */
/* -------------------------------------------------------------------------- */

const findRecentPendingOrder = async ({
  userId,
  totalAmount,
  paymentMethod,
  withinMinutes = 3,
}) => {
  const since = new Date(Date.now() - withinMinutes * 60 * 1000).toISOString();

  const data = await restFetch(
    `orders?select=*&user_id=eq.${encodeURIComponent(
      userId
    )}&total_amount=eq.${encodeURIComponent(
      totalAmount
    )}&payment_method=eq.${encodeURIComponent(
      paymentMethod
    )}&payment_status=eq.pending&order_status=eq.placed&created_at=gte.${encodeURIComponent(
      since
    )}&order=created_at.desc&limit=1`
  );

  return data?.[0] || null;
};

const getOrderItemsByOrderId = async (orderId) => {
  if (!orderId) return [];

  const data = await restFetch(
    `order_items?select=*&order_id=eq.${encodeURIComponent(orderId)}`
  );

  return data || [];
};

/* -------------------------------------------------------------------------- */
/* Create Order From Cart                                                      */
/* -------------------------------------------------------------------------- */

export const createOrderFromCart = async ({
  address,
  paymentMethod = "razorpay",
  notes = "",
} = {}) => {
  await requireUser();

  const cartItems = await getCart();

  if (!cartItems || cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const summary = calculateCartSummary(cartItems);

  return createOrder({
    items: cartItems,
    address,
    totalAmount: summary.total,
    paymentMethod,
    notes,
  });
};

/* -------------------------------------------------------------------------- */
/* Create Order Manually                                                       */
/* -------------------------------------------------------------------------- */

export const createOrder = async ({
  items = [],
  address,
  totalAmount,
  paymentMethod = "razorpay",
  notes = "",
}) => {
  if (createOrderInProgress) {
    throw new Error("Order is already being created. Please wait.");
  }

  createOrderInProgress = true;

  try {
    const user = await requireUser();

    if (!items || items.length === 0) {
      throw new Error("Order items are required");
    }

    const finalTotal =
      totalAmount ||
      items.reduce((total, item) => {
        return total + getItemPrice(item) * Number(item.quantity || 1);
      }, 0);

    const existingOrder = await findRecentPendingOrder({
      userId: user.id,
      totalAmount: finalTotal,
      paymentMethod,
      withinMinutes: 3,
    });

    if (existingOrder?.id) {
      const existingItems = await getOrderItemsByOrderId(existingOrder.id);

      return {
        order: existingOrder,
        orderItems: existingItems,
        reused: true,
      };
    }

    const insertedOrder = await restFetch("orders", {
      method: "POST",
      body: [
        {
          user_id: user.id,
          total_amount: finalTotal,
          payment_method: paymentMethod,
          payment_status: "pending",
          order_status: "placed",
          address: address || null,
          notes,
        },
      ],
    });

    const order = Array.isArray(insertedOrder) ? insertedOrder[0] : insertedOrder;

    if (!order?.id) {
      throw new Error("Order could not be created");
    }

    const orderItems = formatOrderItems(items, order.id);

    const createdItems = await restFetch("order_items", {
      method: "POST",
      body: orderItems,
    });

    return {
      order,
      orderItems: createdItems || [],
      reused: false,
    };
  } finally {
    createOrderInProgress = false;
  }
};

/* -------------------------------------------------------------------------- */
/* Get Logged-In User Orders                                                   */
/* -------------------------------------------------------------------------- */

export const getMyOrders = async () => {
  const user = await requireUser();

  const select = encodeSelect(ORDER_SELECT);

  const data = await restFetch(
    `orders?select=${select}&user_id=eq.${encodeURIComponent(
      user.id
    )}&order=created_at.desc`
  );

  return data || [];
};

/* -------------------------------------------------------------------------- */
/* Get User Orders By User ID                                                  */
/* -------------------------------------------------------------------------- */

export const getUserOrders = async (userId) => {
  if (!userId) {
    return [];
  }

  const select = encodeSelect(ORDER_SELECT);

  const data = await restFetch(
    `orders?select=${select}&user_id=eq.${encodeURIComponent(
      userId
    )}&order=created_at.desc`
  );

  return data || [];
};

/* -------------------------------------------------------------------------- */
/* Get Single Order By ID                                                      */
/* -------------------------------------------------------------------------- */

export const getOrderById = async (orderId) => {
  const user = await requireUser();

  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const select = encodeSelect(ORDER_SELECT);

  const data = await restFetch(
    `orders?select=${select}&id=eq.${encodeURIComponent(
      orderId
    )}&user_id=eq.${encodeURIComponent(user.id)}&limit=1`
  );

  if (!data?.[0]) {
    throw new Error("Order not found");
  }

  return data[0];
};

/* -------------------------------------------------------------------------- */
/* Cancel Order                                                                */
/* -------------------------------------------------------------------------- */

export const cancelOrder = async (orderId) => {
  const user = await requireUser();

  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const data = await restFetch(
    `orders?id=eq.${encodeURIComponent(orderId)}&user_id=eq.${encodeURIComponent(
      user.id
    )}`,
    {
      method: "PATCH",
      body: {
        order_status: "cancelled",
        updated_at: new Date().toISOString(),
      },
    }
  );

  return data?.[0] || null;
};

/* -------------------------------------------------------------------------- */
/* Save Payment Record                                                         */
/* -------------------------------------------------------------------------- */

export const savePaymentRecord = async ({
  orderId,
  paymentId,
  provider = "razorpay",
  amount,
  status = "paid",
  rawResponse = null,
}) => {
  const user = await requireUser();

  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const data = await restFetch("payments", {
    method: "POST",
    body: [
      {
        order_id: orderId,
        user_id: user.id,
        provider,
        payment_id: paymentId || null,
        amount,
        status,
        raw_response: rawResponse,
      },
    ],
  });

  return data?.[0] || null;
};

/* -------------------------------------------------------------------------- */
/* Mark Order Paid                                                             */
/* -------------------------------------------------------------------------- */

export const markOrderPaid = async ({
  orderId,
  paymentId,
  amount,
  provider = "razorpay",
  rawResponse = null,
  clearUserCart = true,
}) => {
  const user = await requireUser();

  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const data = await restFetch(
    `orders?id=eq.${encodeURIComponent(orderId)}&user_id=eq.${encodeURIComponent(
      user.id
    )}`,
    {
      method: "PATCH",
      body: {
        payment_status: "paid",
        order_status: "confirmed",
        payment_id: paymentId || null,
        updated_at: new Date().toISOString(),
      },
    }
  );

  const order = data?.[0];

  if (!order) {
    throw new Error("Order not found");
  }

  try {
    await savePaymentRecord({
      orderId,
      paymentId,
      provider,
      amount: amount || order.total_amount,
      status: "paid",
      rawResponse,
    });
  } catch (paymentRecordError) {
    console.warn(
      "Payment record save skipped. Backend may already have saved it:",
      paymentRecordError
    );
  }

  if (clearUserCart) {
    await clearCart();
  }

  return order;
};

/* -------------------------------------------------------------------------- */
/* Mark Order Payment Failed                                                   */
/* -------------------------------------------------------------------------- */

export const markOrderPaymentFailed = async ({
  orderId,
  paymentId = null,
  amount,
  provider = "razorpay",
  rawResponse = null,
}) => {
  const user = await requireUser();

  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const data = await restFetch(
    `orders?id=eq.${encodeURIComponent(orderId)}&user_id=eq.${encodeURIComponent(
      user.id
    )}`,
    {
      method: "PATCH",
      body: {
        payment_status: "failed",
        order_status: "payment_failed",
        payment_id: paymentId,
        updated_at: new Date().toISOString(),
      },
    }
  );

  const order = data?.[0];

  if (!order) {
    throw new Error("Order not found");
  }

  try {
    await savePaymentRecord({
      orderId,
      paymentId,
      provider,
      amount: amount || order.total_amount,
      status: "failed",
      rawResponse,
    });
  } catch (paymentRecordError) {
    console.warn("Failed payment record save skipped:", paymentRecordError);
  }

  return order;
};

/* -------------------------------------------------------------------------- */
/* Admin: Get All Orders                                                       */
/* -------------------------------------------------------------------------- */

export const adminGetOrders = async (params = {}) => {
  const select = encodeSelect(`
    *,
    profiles(*),
    order_items(
      *,
      products(
        *,
        product_images(*)
      )
    ),
    payments(*)
  `);

  const queryParts = [`select=${select}`, "order=created_at.desc"];

  if (params.orderStatus) {
    queryParts.push(`order_status=eq.${encodeURIComponent(params.orderStatus)}`);
  }

  if (params.paymentStatus) {
    queryParts.push(`payment_status=eq.${encodeURIComponent(params.paymentStatus)}`);
  }

  if (params.userId) {
    queryParts.push(`user_id=eq.${encodeURIComponent(params.userId)}`);
  }

  if (params.limit) {
    queryParts.push(`limit=${Number(params.limit)}`);
  }

  const data = await restFetch(`orders?${queryParts.join("&")}`);

  return data || [];
};

/* -------------------------------------------------------------------------- */
/* Admin: Update Order Status                                                  */
/* -------------------------------------------------------------------------- */

export const adminUpdateOrderStatus = async (orderId, orderStatus) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  if (!orderStatus) {
    throw new Error("Order status is required");
  }

  const data = await restFetch(`orders?id=eq.${encodeURIComponent(orderId)}`, {
    method: "PATCH",
    body: {
      order_status: orderStatus,
      updated_at: new Date().toISOString(),
    },
  });

  return data?.[0] || null;
};

/* -------------------------------------------------------------------------- */
/* Admin: Update Payment Status                                                */
/* -------------------------------------------------------------------------- */

export const adminUpdatePaymentStatus = async (orderId, paymentStatus) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  if (!paymentStatus) {
    throw new Error("Payment status is required");
  }

  const data = await restFetch(`orders?id=eq.${encodeURIComponent(orderId)}`, {
    method: "PATCH",
    body: {
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    },
  });

  return data?.[0] || null;
};

/* -------------------------------------------------------------------------- */
/* Admin: Delete Order                                                         */
/* -------------------------------------------------------------------------- */

export const adminDeleteOrder = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  await restFetch(`orders?id=eq.${encodeURIComponent(orderId)}`, {
    method: "DELETE",
    prefer: "return=minimal",
  });

  return true;
};

/* -------------------------------------------------------------------------- */
/* Get Order Summary                                                           */
/* -------------------------------------------------------------------------- */

export const getOrderSummary = (order) => {
  if (!order) {
    return {
      totalItems: 0,
      subtotal: 0,
      totalAmount: 0,
    };
  }

  const items = order.order_items || [];

  const totalItems = items.reduce((total, item) => {
    return total + Number(item.quantity || 0);
  }, 0);

  const subtotal = items.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);

  return {
    totalItems,
    subtotal,
    totalAmount: Number(order.total_amount || subtotal),
  };
};

/* -------------------------------------------------------------------------- */
/* Aliases For Old Code Compatibility                                          */
/* -------------------------------------------------------------------------- */

export const getOrders = getMyOrders;
export const getOrder = getOrderById;