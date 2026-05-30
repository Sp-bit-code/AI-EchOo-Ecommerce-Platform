import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { getAllOrders, updateOrderStatus } from "../../../api/adminApi";

import AdminPagination from "../AdminPagination/AdminPagination.jsx";
import AdminOrderFilters from "./AdminOrderFilters.jsx";
import AdminOrderStats from "./AdminOrderStats.jsx";
import AdminOrdersTable from "./AdminOrdersTable.jsx";

import "./AdminOrder.css";

const ORDERS_PER_PAGE = 10;

const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price || 0);

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
    case "completed":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPaymentColor = (method) => {
  switch (method?.toLowerCase()) {
    case "card":
      return "bg-purple-100 text-purple-800";
    case "upi":
      return "bg-blue-100 text-blue-800";
    case "cod":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const statusOptions = [
  "pending",
  "confirmed",
  "shipped",
  "completed",
  "cancelled",
];

const AdminOrders = () => {
  const [rawOrders, setRawOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const normalizeOrderItem = (item) => {
    const product = item.products || item.product || {};

    return {
      ...item,
      product,
      product_name:
        item.product_name ||
        product.name ||
        item.name ||
        "Product",
      product_price: Number(
        item.product_price ||
          item.price ||
          product.price ||
          0
      ),
      product_image:
        item.product_image ||
        product.product_images?.[0]?.image_url ||
        product.images?.[0]?.image_url ||
        product.images?.[0] ||
        "",
      quantity: Number(item.quantity || 1),
    };
  };

  const normalizeOrder = (order) => {
    const profile = order.profiles || order.profile || {};
    const items = order.order_items || order.items || [];

    return {
      ...order,
      id: order.id,
      userName:
        order.userName ||
        order.user_name ||
        profile.full_name ||
        profile.name ||
        profile.email ||
        "Unknown User",
      userEmail:
        order.userEmail ||
        order.user_email ||
        profile.email ||
        "",
      total: Number(
        order.total ||
          order.total_amount ||
          order.amount ||
          0
      ),
      status:
        order.status ||
        order.order_status ||
        "pending",
      payment_method:
        order.payment_method ||
        order.paymentMethod ||
        order.payment_type ||
        "cod",
      payment_status:
        order.payment_status ||
        order.paymentStatus ||
        "pending",
      created_at:
        order.created_at ||
        order.createdAt ||
        order.date ||
        null,
      address:
        order.address ||
        order.shipping_address ||
        order.delivery_address ||
        null,
      items: items.map(normalizeOrderItem),
    };
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const ordersData = await getAllOrders();

      setRawOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const allOrders = useMemo(() => {
    return (rawOrders || []).map(normalizeOrder);
  }, [rawOrders]);

  const filteredOrders = useMemo(() => {
    let list = [...allOrders];

    const query = searchTerm.trim().toLowerCase();

    if (query) {
      list = list.filter((order) => {
        return (
          String(order.id).toLowerCase().includes(query) ||
          order.userName?.toLowerCase().includes(query) ||
          order.userEmail?.toLowerCase().includes(query) ||
          order.status?.toLowerCase().includes(query)
        );
      });
    }

    if (selectedStatus !== "all") {
      list = list.filter((order) => order.status === selectedStatus);
    }

    if (selectedPaymentMethod !== "all") {
      list = list.filter(
        (order) => order.payment_method === selectedPaymentMethod
      );
    }

    if (dateFilter !== "all") {
      const now = new Date();

      list = list.filter((order) => {
        if (!order.created_at) return false;

        const orderDate = new Date(order.created_at);

        if (dateFilter === "today") {
          return orderDate.toDateString() === now.toDateString();
        }

        if (dateFilter === "week") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          return orderDate >= sevenDaysAgo;
        }

        if (dateFilter === "month") {
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        }

        return true;
      });
    }

    if (sortBy === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
    }

    if (sortBy === "oldest") {
      list.sort(
        (a, b) =>
          new Date(a.created_at || 0) - new Date(b.created_at || 0)
      );
    }

    if (sortBy === "amount-high") {
      list.sort((a, b) => Number(b.total || 0) - Number(a.total || 0));
    }

    if (sortBy === "amount-low") {
      list.sort((a, b) => Number(a.total || 0) - Number(b.total || 0));
    }

    return list;
  }, [
    allOrders,
    searchTerm,
    selectedStatus,
    selectedPaymentMethod,
    dateFilter,
    sortBy,
  ]);

  const totalFilteredOrders = filteredOrders.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalFilteredOrders / ORDERS_PER_PAGE)
  );

  const orders = useMemo(() => {
    const start = (currentPage - 1) * ORDERS_PER_PAGE;
    const end = start + ORDERS_PER_PAGE;

    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage]);

  useEffect(() => {
    if (selectedOrder?.id) {
      const nextOrder = allOrders.find(
        (order) => order.id === selectedOrder.id
      );

      if (nextOrder) {
        setSelectedOrder(nextOrder);
      }
    }
  }, [allOrders, selectedOrder?.id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedStatus,
    selectedPaymentMethod,
    dateFilter,
    sortBy,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleViewDetails = useCallback((order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  }, []);

  const handleUpdateStatus = useCallback(async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);

      toast.success(`Order status updated to ${newStatus}`);

      await fetchOrders();
    } catch (updateError) {
      toast.error("Failed to update order status");
      console.error("Error updating order status:", updateError);
    }
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, order) => {
      return sum + Number(order.total || 0);
    }, 0);

    const totalOrders = filteredOrders.length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders: filteredOrders.filter(
        (order) => order.status === "pending"
      ).length,
      completedOrders: filteredOrders.filter(
        (order) => order.status === "completed"
      ).length,
      averageOrderValue: Number(
        totalOrders ? Math.round(totalRevenue / totalOrders) : 0
      ),
    };
  }, [filteredOrders]);

  if (loading && !orders.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800 font-medium">Error loading orders</div>

        <div className="text-red-600 text-sm mt-1">{error}</div>

        <button
          onClick={fetchOrders}
          className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Orders Management
        </h1>

        <p className="text-gray-600">
          Manage and update customer orders ({stats.totalOrders} orders)
        </p>
      </div>

      <AdminOrderStats stats={stats} formatPrice={formatPrice} />

      <AdminOrderFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        statusOptions={statusOptions}
      />

      <AdminOrdersTable
        filteredOrders={filteredOrders}
        paginatedOrders={orders}
        handleViewDetails={handleViewDetails}
        handleUpdateStatus={handleUpdateStatus}
        formatDate={formatDate}
        formatPrice={formatPrice}
        getStatusColor={getStatusColor}
        getPaymentColor={getPaymentColor}
        statusOptions={statusOptions}
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        selectedPaymentMethod={selectedPaymentMethod}
        dateFilter={dateFilter}
        pagination={
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalFilteredOrders}
            itemsPerPage={ORDERS_PER_PAGE}
            itemLabel="orders"
            onPageChange={setCurrentPage}
          />
        }
      />
    </div>
  );
};

export default AdminOrders;