import axiosClient from "./axiosClient";
import { markOrderPaid, markOrderPaymentFailed } from "./orderApi";

/*
  paymentApi.js

  Purpose:
  - Create Razorpay order from backend/server
  - Open Razorpay checkout popup
  - Verify payment from backend/server
  - Update Supabase order status after successful payment
  - Mark payment failed if needed

  Important:
  - Razorpay secret key frontend me kabhi mat rakhna.
  - Frontend me only VITE_RAZORPAY_KEY_ID rahega.
  - Secret key server/.env me rahegi.
*/

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

/* -------------------------------------------------------------------------- */
/* Helper: Safe Razorpay Receipt                                               */
/* Razorpay receipt max length = 40 chars                                      */
/* -------------------------------------------------------------------------- */

const makeSafeReceipt = (orderId) => {
  return `rcpt_${String(orderId).slice(0, 30)}`;
};

/* -------------------------------------------------------------------------- */
/* Helper: Load Razorpay Script                                                */
/* -------------------------------------------------------------------------- */

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

/* -------------------------------------------------------------------------- */
/* Create Payment Order                                                        */
/* -------------------------------------------------------------------------- */

export const createPaymentOrder = async ({
  orderId,
  amount,
  currency = "INR",
  receipt,
  notes = {},
}) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  if (!amount || Number(amount) <= 0) {
    throw new Error("Valid amount is required");
  }

  const safeReceipt =
    receipt && receipt.length <= 40 ? receipt : makeSafeReceipt(orderId);

  const response = await axiosClient.post("/payments/create-order", {
    orderId,
    amount,
    currency,
    receipt: safeReceipt,
    notes,
  });

  return response.data;
};

/* -------------------------------------------------------------------------- */
/* Verify Payment                                                              */
/* -------------------------------------------------------------------------- */

export const verifyPayment = async ({
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new Error("Payment verification details are missing");
  }

  const response = await axiosClient.post("/payments/verify", {
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  return response.data;
};

/* -------------------------------------------------------------------------- */
/* Open Razorpay Checkout                                                      */
/* -------------------------------------------------------------------------- */

export const openRazorpayCheckout = async ({
  order,
  razorpayOrder,
  user = {},
  onSuccess,
  onFailure,
}) => {
  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    throw new Error("Razorpay SDK failed to load");
  }

  if (!RAZORPAY_KEY_ID) {
    throw new Error("Missing VITE_RAZORPAY_KEY_ID in client/.env");
  }

  if (!order?.id) {
    throw new Error("Local order ID is required");
  }

  if (!razorpayOrder?.id) {
    throw new Error("Razorpay order ID is required");
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency || "INR",
    name: "Echoo",
    description: "Echoo E-commerce Order Payment",
    order_id: razorpayOrder.id,

    prefill: {
      name: user.full_name || user.name || "",
      email: user.email || "",
      contact: user.phone || "",
    },

    notes: {
      local_order_id: order.id,
    },

    theme: {
      color: "#111111",
    },

    handler: async function (response) {
      try {
        const verifyResult = await verifyPayment({
          orderId: order.id,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });

        await markOrderPaid({
          orderId: order.id,
          paymentId: response.razorpay_payment_id,
          amount: Number(order.total_amount || 0),
          provider: "razorpay",
          rawResponse: {
            razorpayResponse: response,
            verifyResult,
          },
          clearUserCart: true,
        });

        if (onSuccess) {
          onSuccess({
            response,
            verifyResult,
          });
        }
      } catch (error) {
        await markOrderPaymentFailed({
          orderId: order.id,
          paymentId: response.razorpay_payment_id,
          amount: Number(order.total_amount || 0),
          provider: "razorpay",
          rawResponse: {
            razorpayResponse: response,
            error: error.message,
          },
        });

        if (onFailure) {
          onFailure(error);
        }

        throw error;
      }
    },

    modal: {
      ondismiss: async function () {
        if (onFailure) {
          onFailure(new Error("Payment popup closed by user"));
        }
      },
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();

  return razorpay;
};

/* -------------------------------------------------------------------------- */
/* Complete Payment Flow                                                       */
/* -------------------------------------------------------------------------- */

export const startPaymentFlow = async ({
  order,
  user,
  onSuccess,
  onFailure,
}) => {
  if (!order?.id) {
    throw new Error("Order is required for payment");
  }

  if (!order?.total_amount) {
    throw new Error("Order amount is required");
  }

  const razorpayOrder = await createPaymentOrder({
    orderId: order.id,
    amount: Number(order.total_amount),
    currency: "INR",
    receipt: makeSafeReceipt(order.id),
    notes: {
      local_order_id: order.id,
    },
  });

  return openRazorpayCheckout({
    order,
    razorpayOrder,
    user,
    onSuccess,
    onFailure,
  });
};

/* -------------------------------------------------------------------------- */
/* Payment Status Helpers                                                      */
/* -------------------------------------------------------------------------- */

export const isPaymentSuccess = (status) => {
  return status === "paid" || status === "success" || status === "captured";
};

export const isPaymentPending = (status) => {
  return status === "pending" || status === "created";
};

export const isPaymentFailed = (status) => {
  return status === "failed" || status === "cancelled";
};

/* -------------------------------------------------------------------------- */
/* Old Name Compatibility                                                      */
/* -------------------------------------------------------------------------- */

export const createRazorpayOrder = createPaymentOrder;
export const verifyRazorpayPayment = verifyPayment;