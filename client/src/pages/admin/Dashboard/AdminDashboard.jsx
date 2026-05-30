import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllOrders,
  getAllProducts,
  getAllUsers,
} from "../../../api/adminApi";

import { useAuth } from "../../../context/AuthContext.jsx";

import AnalyticsCharts from "./AnalyticsCharts.jsx";
import DashboardStats from "./DashboardStats.jsx";
import RecentActivity from "./RecentActivity.jsx";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { user: currentUser, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const normalizeProduct = (product = {}) => {
    return {
      ...product,
      images: product.product_images || product.images || [],
      variants: product.variants || {
        colors: product.colors || [],
        storage: product.storage_options || [],
        ram: product.ram_options || [],
      },
      stock: Number(product.stock || 0),
      price: Number(product.price || 0),
      status:
        product.status ||
        (Number(product.stock || 0) <= 0 ? "out-of-stock" : "active"),
    };
  };

  const normalizeOrderItem = (item = {}) => {
    const product = item.products || item.product || {};

    return {
      ...item,
      productId: item.product_id || product.id,
      quantity: Number(item.quantity || 1),
      itemTotal:
        Number(item.itemTotal || 0) ||
        Number(item.price || product.price || 0) * Number(item.quantity || 1),
    };
  };

  const normalizeOrder = (order = {}) => {
    const orderUser = order.profiles || order.profile || {};
    const items = order.order_items || order.items || [];

    return {
      ...order,
      total: Number(order.total || order.total_amount || 0),
      status: order.status || order.order_status || "pending",
      paymentStatus: order.payment_status || "pending",
      userName:
        order.userName ||
        orderUser.full_name ||
        orderUser.name ||
        orderUser.email ||
        "Unknown",
      userEmail: order.userEmail || orderUser.email || "",
      createdAt: order.createdAt || order.created_at,
      items: items.map(normalizeOrderItem),
    };
  };

  const normalizeUser = (user = {}) => {
    return {
      ...user,
      name: user.name || user.full_name || user.email || "User",
      email: user.email || "",
      role: user.role || "User",
      status: user.status || "Active",
    };
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersRes, ordersRes, productsRes] = await Promise.all([
        getAllUsers(),
        getAllOrders(),
        getAllProducts(),
      ]);

      const users = Array.isArray(usersRes) ? usersRes : [];
      const orders = Array.isArray(ordersRes) ? ordersRes : [];
      const products = Array.isArray(productsRes) ? productsRes : [];

      setAnalytics(
        generateAnalyticsFromData({
          users: users.map(normalizeUser),
          orders: orders.map(normalizeOrder),
          products: products.map(normalizeProduct),
        })
      );
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError(error.message || "Failed to load dashboard data");
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const generateAnalyticsFromData = ({ users, orders, products }) => {
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + Number(order.total || 0);
    }, 0);

    const totalOrders = orders.length;
    const totalUsers = users.length;
    const totalProducts = products.length;

    const activeUsers = users.filter((user) => {
      return String(user.status || "Active").toLowerCase() === "active";
    }).length;

    const outOfStockProducts = products.filter((product) => {
      return Number(product.stock || 0) <= 0;
    }).length;

    const activeProducts = products.filter((product) => {
      return String(product.status || "active").toLowerCase() === "active";
    }).length;

    const currentOrders = orders.filter((order) => {
      const status = String(order.status || "").toLowerCase();

      return ["placed", "pending", "confirmed", "processing"].includes(status);
    }).length;

    const cancelledOrders = orders.filter((order) => {
      return String(order.status || "").toLowerCase() === "cancelled";
    }).length;

    const completedOrders = orders.filter((order) => {
      return ["completed", "delivered"].includes(
        String(order.status || "").toLowerCase()
      );
    }).length;

    let totalSales = 0;

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        totalSales += Number(item.quantity || 1);
      });
    });

    const ordersByDay = {};
    const today = new Date();

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const key = date.toISOString().split("T")[0];

      ordersByDay[key] = {
        name: date.toLocaleString("default", {
          weekday: "short",
        }),
        revenue: 0,
        orders: 0,
        sales: 0,
        date,
      };
    }

    orders.forEach((order) => {
      const createdAt = order.createdAt || order.created_at;

      if (!createdAt) return;

      const key = new Date(createdAt).toISOString().split("T")[0];

      if (!ordersByDay[key]) return;

      ordersByDay[key].revenue += Number(order.total || 0);
      ordersByDay[key].orders += 1;

      order.items?.forEach((item) => {
        ordersByDay[key].sales += Number(item.quantity || 1);
      });
    });

    const monthlySales = Object.values(ordersByDay)
      .sort((a, b) => a.date - b.date)
      .map((day) => ({
        name: day.name,
        revenue: day.revenue,
        orders: day.orders,
        sales: day.sales,
      }));

    const categoryMap = {};

    products.forEach((product) => {
      const category = product.category || "Uncategorized";

      if (!categoryMap[category]) {
        categoryMap[category] = {
          name: category,
          value: 0,
          revenue: 0,
        };
      }

      categoryMap[category].value += 1;
      categoryMap[category].revenue +=
        Number(product.price || 0) * Number(product.stock || 0);
    });

    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

    const categoryData = Object.values(categoryMap).map((category, index) => ({
      ...category,
      color: colors[index % colors.length],
    }));

    const productSales = {};

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);

        if (!product) return;

        if (!productSales[product.id]) {
          productSales[product.id] = {
            name: product.name,
            sales: 0,
            revenue: 0,
            category: product.category || "Uncategorized",
          };
        }

        productSales[product.id].sales += Number(item.quantity || 1);
        productSales[product.id].revenue += Number(item.itemTotal || 0);
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const recentOrders = [...orders]
      .sort((a, b) => {
        return (
          new Date(b.createdAt || b.created_at || 0) -
          new Date(a.createdAt || a.created_at || 0)
        );
      })
      .slice(0, 5)
      .map((order) => ({
        id: order.id,
        customer: order.userName || order.userEmail || "Unknown",
        amount: Number(order.total || 0),
        status: order.status || "pending",
        date: order.createdAt || order.created_at,
      }));

    const statusData = [
      {
        name: "Current",
        count: currentOrders,
      },
      {
        name: "Completed",
        count: completedOrders,
      },
      {
        name: "Cancelled",
        count: cancelledOrders,
      },
      {
        name: "History",
        count: totalOrders,
      },
    ];

    return {
      stats: {
        totalSales,
        totalOrders,
        totalRevenue,
        totalUsers,
        totalProducts,
        activeUsers,
        activeProducts,
        outOfStockProducts,
        currentOrders,
        cancelledOrders,
        completedOrders,
      },
      monthlySales,
      categoryData,
      statusData,
      topProducts,
      recentOrders,
    };
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const adminName =
    profile?.full_name ||
    profile?.name ||
    currentUser?.user_metadata?.full_name ||
    currentUser?.email ||
    "Admin";

  const quickCards = useMemo(() => {
    if (!analytics?.stats) return [];

    return [
      {
        label: "All Products",
        value: analytics.stats.totalProducts,
        sub: "Manage catalog",
        path: "/admin/products",
      },
      {
        label: "Out of Stock",
        value: analytics.stats.outOfStockProducts,
        sub: "Need restock",
        path: "/admin/products",
      },
      {
        label: "Active Users",
        value: analytics.stats.activeUsers,
        sub: "Signed users",
        path: "/admin/users",
      },
      {
        label: "Current Orders",
        value: analytics.stats.currentOrders,
        sub: "Pending/processing",
        path: "/admin/orders",
      },
      {
        label: "Cancelled Orders",
        value: analytics.stats.cancelledOrders,
        sub: "Cancelled history",
        path: "/admin/orders",
      },
      {
        label: "Order History",
        value: analytics.stats.totalOrders,
        sub: "All orders",
        path: "/admin/orders",
      },
    ];
  }, [analytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">
            {error || "No analytics data available"}
          </p>

          <button
            onClick={fetchAnalytics}
            className="mt-4 px-6 py-2 bg-gradient-to-b from-gray-500 to-gray-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3),_0px_4px_8px_rgba(0,0,0,0.4)] ring-1 ring-gray-600 text-white transition-all hover:bg-gradient-to-b hover:from-gray-400 hover:to-gray-700 hover:scale-105 active:scale-95 rounded-full font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    stats,
    monthlySales,
    categoryData,
    statusData,
    topProducts,
    recentOrders,
  } = analytics;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

          <p className="text-gray-600">Welcome back, {adminName}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Add New Product
          </button>

          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        {quickCards.map((card) => (
          <button
            key={card.label}
            onClick={() => navigate(card.path)}
            className="text-left bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {card.label}
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              {card.value}
            </p>

            <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
          </button>
        ))}
      </div>

      <DashboardStats stats={stats} formatCurrency={formatCurrency} />

      <AnalyticsCharts
        monthlySales={monthlySales}
        categoryData={categoryData}
        statusData={statusData}
        topProducts={topProducts}
        formatCurrency={formatCurrency}
      />

      <RecentActivity
        recentOrders={recentOrders}
        stats={stats}
        formatCurrency={formatCurrency}
        navigate={navigate}
      />
    </div>
  );
};

export default AdminDashboard;