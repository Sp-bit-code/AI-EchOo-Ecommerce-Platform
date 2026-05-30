// import crypto from "crypto";
// import { createClient } from "@supabase/supabase-js";
// import razorpay from "../utils/razorpay.js";

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// /* Razorpay receipt max length = 40 chars */
// const makeSafeReceipt = (orderId) => {
//   return `rcpt_${String(orderId).slice(0, 30)}`;
// };

// /* Create Razorpay Order */
// export const createPaymentOrder = async (req, res) => {
//   try {
//     const {
//       orderId,
//       amount,
//       currency = "INR",
//       receipt,
//       notes = {},
//     } = req.body;

//     if (!orderId) {
//       return res.status(400).json({
//         success: false,
//         message: "Order ID is required",
//       });
//     }

//     if (!amount || Number(amount) <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Valid amount is required",
//       });
//     }

//     const amountInPaise = Math.round(Number(amount) * 100);

//     const safeReceipt =
//       receipt && String(receipt).length <= 40
//         ? String(receipt)
//         : makeSafeReceipt(orderId);

//     const razorpayOrder = await razorpay.orders.create({
//       amount: amountInPaise,
//       currency,
//       receipt: safeReceipt,
//       notes: {
//         local_order_id: orderId,
//         ...notes,
//       },
//     });

//     const { error: paymentInsertError } = await supabase.from("payments").insert([
//       {
//         order_id: orderId,
//         provider: "razorpay",
//         payment_id: razorpayOrder.id,
//         amount: Number(amount),
//         status: "created",
//       },
//     ]);

//     if (paymentInsertError) {
//       console.error("Supabase payment insert error:", paymentInsertError);

//       return res.status(500).json({
//         success: false,
//         message: "Payment record insert failed",
//         error: paymentInsertError.message,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       id: razorpayOrder.id,
//       amount: razorpayOrder.amount,
//       currency: razorpayOrder.currency,
//       receipt: razorpayOrder.receipt,
//       status: razorpayOrder.status,
//     });
//   } catch (error) {
//     console.error("Create payment order error:", {
//       message: error.message,
//       statusCode: error.statusCode,
//       error: error.error,
//     });

//     return res.status(500).json({
//       success: false,
//       message: "Payment order creation failed",
//       error: error.message,
//       razorpayError: error.error || null,
//     });
//   }
// };

// /* Verify Razorpay Payment */
// export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       orderId,
//       razorpayOrderId,
//       razorpayPaymentId,
//       razorpaySignature,
//     } = req.body;

//     if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment verification details are missing",
//       });
//     }

//     const body = `${razorpayOrderId}|${razorpayPaymentId}`;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     const isValid = expectedSignature === razorpaySignature;

//     if (!isValid) {
//       await supabase
//         .from("payments")
//         .update({
//           status: "failed",
//           payment_id: razorpayPaymentId,
//         })
//         .eq("order_id", orderId);

//       return res.status(400).json({
//         success: false,
//         message: "Invalid payment signature",
//       });
//     }

//     const { error: paymentUpdateError } = await supabase
//       .from("payments")
//       .update({
//         status: "paid",
//         payment_id: razorpayPaymentId,
//       })
//       .eq("order_id", orderId);

//     if (paymentUpdateError) {
//       console.error("Supabase payment update error:", paymentUpdateError);

//       return res.status(500).json({
//         success: false,
//         message: "Payment status update failed",
//         error: paymentUpdateError.message,
//       });
//     }

//     const { error: orderUpdateError } = await supabase
//       .from("orders")
//       .update({
//         payment_status: "paid",
//         order_status: "placed",
//       })
//       .eq("id", orderId);

//     if (orderUpdateError) {
//       console.error("Supabase order update error:", orderUpdateError);

//       return res.status(500).json({
//         success: false,
//         message: "Order status update failed",
//         error: orderUpdateError.message,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Payment verified successfully",
//       orderId,
//       razorpayOrderId,
//       razorpayPaymentId,
//     });
//   } catch (error) {
//     console.error("Verify payment error:", {
//       message: error.message,
//       statusCode: error.statusCode,
//       error: error.error,
//     });

//     return res.status(500).json({
//       success: false,
//       message: "Payment verification failed",
//       error: error.message,
//       razorpayError: error.error || null,
//     });
//   }
// };


import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import razorpay from "../utils/razorpay.js";

const REQUIRED_ENV = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
};

const missingEnv = Object.entries(REQUIRED_ENV)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingEnv.length > 0) {
  console.warn(
    `Payment controller missing environment variables: ${missingEnv.join(", ")}`
  );
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* Razorpay receipt max length = 40 chars */
const makeSafeReceipt = (orderId) => {
  return `rcpt_${String(orderId).slice(0, 30)}`;
};

const safeCompare = (a, b) => {
  const first = Buffer.from(String(a || ""), "utf8");
  const second = Buffer.from(String(b || ""), "utf8");

  if (first.length !== second.length) {
    return false;
  }

  return crypto.timingSafeEqual(first, second);
};

const normalizeAmount = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return value;
};

/* Create Razorpay Order */
export const createPaymentOrder = async (req, res) => {
  try {
    const {
      orderId,
      amount,
      currency = "INR",
      receipt,
      notes = {},
    } = req.body || {};

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        success: false,
        message: "Supabase server configuration is missing",
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const validAmount = normalizeAmount(amount);

    if (!validAmount) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const amountInPaise = Math.round(validAmount * 100);

    const safeReceipt =
      receipt && String(receipt).length <= 40
        ? String(receipt)
        : makeSafeReceipt(orderId);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: safeReceipt,
      notes: {
        local_order_id: orderId,
        ...notes,
      },
    });

    const { error: paymentInsertError } = await supabase.from("payments").insert([
      {
        order_id: orderId,
        provider: "razorpay",
        payment_id: razorpayOrder.id,
        amount: validAmount,
        status: "created",
      },
    ]);

    if (paymentInsertError) {
      console.error("Supabase payment insert error:", paymentInsertError);

      return res.status(500).json({
        success: false,
        message: "Payment record insert failed",
        error: paymentInsertError.message,
      });
    }

    return res.status(200).json({
      success: true,
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      status: razorpayOrder.status,
    });
  } catch (error) {
    console.error("Create payment order error:", {
      message: error.message,
      statusCode: error.statusCode,
      error: error.error,
    });

    return res.status(500).json({
      success: false,
      message: "Payment order creation failed",
      error: error.message,
      razorpayError: error.error || null,
    });
  }
};

/* Verify Razorpay Payment */
export const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body || {};

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay server configuration is missing",
      });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        success: false,
        message: "Supabase server configuration is missing",
      });
    }

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are missing",
      });
    }

    const body = `${razorpayOrderId}|${razorpayPaymentId}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = safeCompare(expectedSignature, razorpaySignature);

    if (!isValid) {
      await supabase
        .from("payments")
        .update({
          status: "failed",
          payment_id: razorpayPaymentId,
        })
        .eq("order_id", orderId);

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const { error: paymentUpdateError } = await supabase
      .from("payments")
      .update({
        status: "paid",
        payment_id: razorpayPaymentId,
      })
      .eq("order_id", orderId);

    if (paymentUpdateError) {
      console.error("Supabase payment update error:", paymentUpdateError);

      return res.status(500).json({
        success: false,
        message: "Payment status update failed",
        error: paymentUpdateError.message,
      });
    }

    const { error: orderUpdateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        order_status: "placed",
        payment_id: razorpayPaymentId,
      })
      .eq("id", orderId);

    if (orderUpdateError) {
      console.error("Supabase order update error:", orderUpdateError);

      return res.status(500).json({
        success: false,
        message: "Order status update failed",
        error: orderUpdateError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
    });
  } catch (error) {
    console.error("Verify payment error:", {
      message: error.message,
      statusCode: error.statusCode,
      error: error.error,
    });

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
      razorpayError: error.error || null,
    });
  }
};