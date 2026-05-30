import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBagIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

import { cancelOrder } from "../../../api/orderApi";
import "./OrdersSection.css";

const OrdersSection = ({ user, onRefresh }) => {
  const [cancellingOrder, setCancellingOrder] = useState(null);

  const orders = Array.isArray(user?.order)
    ? user.order
    : Array.isArray(user?.orders)
    ? user.orders
    : [];

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' fill='%23e5e7eb'%3E%3Crect width='48' height='48' rx='4'/%3E%3C/svg%3E";

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price || 0));
  };

  const getOrderStatus = (order) => {
    return String(order?.status || order?.order_status || "placed").toLowerCase();
  };

  const getPaymentStatus = (order) => {
    return String(order?.paymentStatus || order?.payment_status || "unpaid").toLowerCase();
  };

  const getPaymentMethod = (order) => {
    return String(order?.paymentMethod || order?.payment_method || "N/A");
  };

  const getOrderItems = (order) => {
    return Array.isArray(order?.items)
      ? order.items
      : Array.isArray(order?.order_items)
      ? order.order_items
      : [];
  };

  const getOrderTotal = (order) => {
    return Number(order?.total || order?.total_amount || 0);
  };

  const getOrderSubtotal = (order) => {
    if (order?.subtotal) {
      return Number(order.subtotal);
    }

    return getOrderItems(order).reduce((total, item) => {
      return total + Number(item.price || item.itemTotal || 0) * Number(item.quantity || 1);
    }, 0);
  };

  const getProduct = (item) => {
    return item?.products || item?.product || {};
  };

  const getProductName = (item) => {
    const product = getProduct(item);

    return (
      item?.productName ||
      item?.product_name ||
      product?.name ||
      "Product"
    );
  };

  const getProductImage = (item) => {
    const product = getProduct(item);

    return (
      item?.productImage ||
      item?.product_image ||
      product?.product_images?.find((image) => image.is_primary)?.image_url ||
      product?.product_images?.[0]?.image_url ||
      product?.images?.[0]?.image_url ||
      fallbackImage
    );
  };

  const getItemTotal = (item) => {
    if (item?.itemTotal) {
      return Number(item.itemTotal);
    }

    return Number(item?.price || 0) * Number(item?.quantity || 1);
  };

  const canCancelOrder = (order) => {
    const orderStatus = getOrderStatus(order);

    return ![
      "shipped",
      "completed",
      "cancelled",
      "payment_failed",
      "failed",
    ].includes(orderStatus);
  };

  const getOrderStatusColor = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "pending":
      case "placed":
        return "bg-yellow-100 text-yellow-800";

      case "processing":
        return "bg-blue-100 text-blue-800";

      case "shipped":
        return "bg-purple-100 text-purple-800";

      case "completed":
      case "confirmed":
        return "bg-green-100 text-green-800";

      case "cancelled":
        return "bg-red-100 text-red-800";

      case "payment_failed":
      case "failed":
        return "bg-red-100 text-red-800";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "paid":
      case "success":
      case "captured":
        return "bg-green-100 text-green-800";

      case "pending":
      case "unpaid":
      case "":
        return "bg-yellow-100 text-yellow-800";

      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentLabel = (order) => {
    const status = getPaymentStatus(order);

    if (!status || status === "pending") {
      return "unpaid";
    }

    return status;
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setCancellingOrder(orderId);
      await cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      await onRefresh?.();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error?.message || "Failed to cancel order");
    } finally {
      setCancellingOrder(null);
    }
  };

  if (!orders.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-dm-sans font-semibold text-gray-900 mb-6">
          Order History
        </h3>

        <div className="text-center py-12">
          <ShoppingBagIcon className="size-16 text-gray-300 mx-auto mb-4" />

          <p className="text-gray-500 mb-2">No orders yet</p>

          <p className="text-sm text-gray-400 mb-4">
            Your orders will appear here once you make a purchase.
          </p>

          <Link
            to="/store"
            className="inline-block bg-gradient-to-b from-gray-500 to-gray-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3),_0px_4px_8px_rgba(0,0,0,0.4)] ring-1 ring-gray-600 text-white px-6 py-3 rounded-lg hover:from-gray-400 hover:to-gray-700 transition-colors"
          >
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-dm-sans font-semibold text-gray-900 mb-6">
        Order History ({orders.length})
      </h3>

      <div className="space-y-4">
        {orders.map((order) => {
          const shippingAddress =
            order?.shippingAddress ||
            order?.shipping_address ||
            order?.address ||
            {};

          const orderStatus = getOrderStatus(order);
          const paymentStatus = getPaymentLabel(order);
          const paymentMethod = getPaymentMethod(order);
          const orderItems = getOrderItems(order);

          return (
            <div
              key={order.id}
              className="p-6 border border-gray-200 rounded-xl hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start mb-4 gap-4">
                <div>
                  <p className="font-semibold text-gray-900 break-all">
                    Order #{order.id}
                  </p>

                  <p className="text-sm text-gray-500">
                    Placed on{" "}
                    {new Date(order.createdAt || order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getOrderStatusColor(
                      orderStatus
                    )}`}
                  >
                    {orderStatus}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPaymentStatusColor(
                      paymentStatus
                    )}`}
                  >
                    payment: {paymentStatus}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {orderItems.map((item) => {
                  const productName = getProductName(item);
                  const productImage = getProductImage(item);

                  return (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                          <img
                            src={productImage}
                            alt={productName}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.target.onerror = null;
                              event.target.src = fallbackImage;
                            }}
                          />
                        </div>

                        <div className="min-w-0">
                          <span className="font-medium text-gray-900 line-clamp-1">
                            {productName}
                          </span>

                          <div className="text-xs text-gray-500">
                            Qty: {item.quantity}
                            {item.storage ? ` • Storage: ${item.storage}` : ""}
                            {item.ram ? ` • RAM: ${item.ram}` : ""}
                          </div>
                        </div>
                      </div>

                      <span className="font-medium whitespace-nowrap">
                        {formatPrice(getItemTotal(item))}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Payment Method:{" "}
                      <span className="font-medium capitalize">
                        {paymentMethod}
                      </span>
                    </p>

                    <p className="text-sm text-gray-600">
                      Payment Status:{" "}
                      <span className="font-medium capitalize">
                        {paymentStatus}
                      </span>
                    </p>

                    <p className="text-xs text-gray-500">
                      Ship to:{" "}
                      {shippingAddress.full_name ||
                        user?.name ||
                        user?.full_name ||
                        "N/A"}
                      , {shippingAddress.city || "N/A"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(getOrderTotal(order))}
                    </p>

                    <p className="text-sm text-gray-500">
                      Subtotal: {formatPrice(getOrderSubtotal(order))}
                    </p>
                  </div>
                </div>

                {canCancelOrder(order) && (
                  <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancellingOrder === order.id}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingOrder === order.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="h-4 w-4" />
                          Cancel Order
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersSection;