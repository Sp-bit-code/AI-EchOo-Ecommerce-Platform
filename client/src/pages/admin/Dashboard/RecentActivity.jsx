import React from "react";
import { TrendingUp } from "lucide-react";

import "./RecentActivity.css";

const RecentActivity = ({
  recentOrders = [],
  stats = {},
  formatCurrency,
  navigate,
}) => {
  const safeFormatCurrency =
    formatCurrency ||
    ((amount) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount || 0));

  const totalRevenue = Number(stats.totalRevenue || 0);
  const totalOrders = Number(stats.totalOrders || 0);
  const totalSales = Number(stats.totalSales || 0);
  const totalUsers = Number(stats.totalUsers || 0);

  const averageOrderValue =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const itemsPerOrder =
    totalOrders > 0 ? totalSales / totalOrders : 0;

  const formatDate = (date) => {
    if (!date) return "N/A";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewAll = () => {
    if (navigate) {
      navigate("/admin/orders");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Orders */}
      <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h3>
            <p className="text-sm text-gray-500">Latest customer orders</p>
          </div>

          <button
            onClick={handleViewAll}
            className="bg-gradient-to-b from-gray-500 to-gray-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3),_0px_4px_8px_rgba(0,0,0,0.4)] ring-1 ring-gray-600 text-white transition-all hover:bg-gradient-to-b hover:from-gray-400 hover:to-gray-700 hover:scale-105 active:scale-95 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1"
          >
            View All <TrendingUp className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      #{String(order.id).slice(0, 8)}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-900">
                      {order.customer || "Unknown"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-900">
                      {safeFormatCurrency(order.amount || 0)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status || "pending"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(order.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">No recent orders found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sales Summary */}
      <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Sales Summary
          </h3>
          <p className="text-sm text-gray-500">Key metrics overview</p>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Average Order Value
            </h4>

            <div className="text-2xl font-bold text-gray-900">
              {safeFormatCurrency(averageOrderValue)}
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Total revenue divided by total orders
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Items per Order
            </h4>

            <div className="text-2xl font-bold text-gray-900">
              {itemsPerOrder.toFixed(1)}
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Average items per order
            </p>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-2" />

              <span className="text-sm text-gray-600">
                Based on {totalOrders} orders from {totalUsers} users
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;