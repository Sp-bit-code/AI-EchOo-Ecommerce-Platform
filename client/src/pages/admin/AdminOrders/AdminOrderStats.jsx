import React from "react";

import "./AdminOrderStats.css";

/*
  AdminOrderStats.jsx

  Purpose:
  - Shows order summary cards in admin panel
  - Total Orders
  - Total Revenue
  - Pending Orders
  - Average Order Value

  UI is kept same as old file.
*/

const AdminOrderStats = ({ stats = {}, formatPrice }) => {
  const safeFormatPrice =
    formatPrice ||
    ((price) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(price || 0));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="text-sm text-gray-500">Total Orders</div>

        <div className="text-2xl font-bold text-gray-900">
          {stats.totalOrders || 0}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="text-sm text-gray-500">Total Revenue</div>

        <div className="text-2xl font-bold text-gray-900">
          {safeFormatPrice(stats.totalRevenue || 0)}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="text-sm text-gray-500">Pending Orders</div>

        <div className="text-2xl font-bold text-gray-900">
          {stats.pendingOrders || 0}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="text-sm text-gray-500">Avg. Order Value</div>

        <div className="text-2xl font-bold text-gray-900">
          {safeFormatPrice(stats.averageOrderValue || 0)}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderStats;