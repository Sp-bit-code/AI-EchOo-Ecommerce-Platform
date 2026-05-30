import { useCallback, useState } from "react";

import {
  createPaymentOrder,
  verifyPayment,
} from "../api/paymentApi";

const loadRazorpayScript = () => {
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

const usePayment = () => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const startRazorpayPayment = useCallback(
    async ({
      amount,
      currency = "INR",
      receipt,
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      notes = {},
      onSuccess,
      onFailure,
    }) => {
      try {
        setPaymentLoading(true);
        setPaymentError("");

        const scriptLoaded = await loadRazorpayScript();

        if (!scriptLoaded) {
          throw new Error("Razorpay SDK failed to load.");
        }

        const paymentOrder = await createPaymentOrder({
          amount,
          currency,
          receipt,
          order_id: orderId,
          notes,
        });

        const razorpayOrder =
          paymentOrder?.data || paymentOrder?.order || paymentOrder;

        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

        if (!razorpayKey) {
          throw new Error("Missing VITE_RAZORPAY_KEY_ID in client/.env");
        }

        const options = {
          key: razorpayKey,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency || currency,
          name: "EchOo",
          description: "EchOo Order Payment",
          order_id: razorpayOrder.id,
          prefill: {
            name: customerName || "",
            email: customerEmail || "",
            contact: customerPhone || "",
          },
          notes,
          theme: {
            color: "#111827",
          },
          handler: async (response) => {
            try {
              const verification = await verifyPayment({
                order_id: orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (onSuccess) {
                onSuccess(verification);
              }
            } catch (error) {
              setPaymentError(error.message || "Payment verification failed.");

              if (onFailure) {
                onFailure(error);
              }
            }
          },
          modal: {
            ondismiss: () => {
              const error = new Error("Payment cancelled by user.");
              setPaymentError(error.message);

              if (onFailure) {
                onFailure(error);
              }
            },
          },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.open();

        return razorpay;
      } catch (error) {
        console.error("Payment error:", error);
        setPaymentError(error.message || "Payment failed.");

        if (onFailure) {
          onFailure(error);
        }

        throw error;
      } finally {
        setPaymentLoading(false);
      }
    },
    []
  );

  const verifyRazorpayPayment = useCallback(async (payload) => {
    try {
      setPaymentLoading(true);
      setPaymentError("");

      const result = await verifyPayment(payload);

      return result?.data || result;
    } catch (error) {
      console.error("Payment verification error:", error);
      setPaymentError(error.message || "Payment verification failed.");
      throw error;
    } finally {
      setPaymentLoading(false);
    }
  }, []);

  return {
    paymentLoading,
    paymentError,
    startRazorpayPayment,
    verifyRazorpayPayment,
    loadRazorpayScript,
  };
};

export default usePayment;
export { usePayment };