import React from "react";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Package,
  CreditCard,
  IndianRupeeIcon,
} from "lucide-react";

import "./DashboardStats.css";

/*
  DashboardStats.jsx

  Purpose:
  - Shows admin dashboard summary cards
  - Total Sales
  - Total Orders
  - Total Revenue
  - Total Users

  UI is kept same as old file.
*/

const DashboardStats = ({ stats = {}, formatCurrency }) => {
  const safeFormatCurrency =
    formatCurrency ||
    ((amount) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount || 0));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Sales Card */}
      <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Sales</p>

            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.totalSales || 0}
            </p>

            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-gray-500">Items sold</span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Total Orders Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>

            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.totalOrders || 0}
            </p>

            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-gray-500">Completed orders</span>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <Package className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>

            <p className="text-2xl font-bold text-gray-900 mt-1">
              {safeFormatCurrency(stats.totalRevenue || 0)}
            </p>

            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-gray-500">Total income</span>
            </div>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <IndianRupeeIcon className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Total Users Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Users</p>

            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.totalUsers || 0}
            </p>

            <div className="flex items-center mt-2">
              <Users className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-gray-500">Registered users</span>
            </div>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <CreditCard className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;