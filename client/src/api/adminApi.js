/*
  adminApi.js

  REST-based admin API:
  - Users
  - Orders
  - Products
  - Product images
  - Payments
  - Dashboard stats

  Important:
  - orders table does not have direct FK relation with profiles
  - so profiles are fetched separately and attached using user_id
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
/* REST Helper                                                                 */
/* -------------------------------------------------------------------------- */

const getAccessToken = () => {
  return localStorage.getItem("echoo_access_token") || SUPABASE_KEY;
};

const restFetch = async (path, options = {}) => {
  const token = getAccessToken();

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
    console.error("Admin REST error:", response.status, text);
    throw new Error(text || "Admin request failed");
  }

  return text ? JSON.parse(text) : null;
};

const encodeSelect = (select) => {
  return encodeURIComponent(select.replace(/\s+/g, ""));
};

const countRows = async (table, filter = "") => {
  const token = getAccessToken();

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=id${filter}`,
    {
      method: "HEAD",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
        Prefer: "count=exact",
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Count failed for ${table}`);
  }

  const range = response.headers.get("content-range");
  return Number(range?.split("/")?.[1] || 0);
};

/* -------------------------------------------------------------------------- */
/* Users                                                                       */
/* -------------------------------------------------------------------------- */

export const getAllUsers = async (params = {}) => {
  const queryParts = ["select=*", "order=created_at.desc"];

  if (params.role) {
    queryParts.push(`role=eq.${encodeURIComponent(params.role)}`);
  }

  if (params.limit) {
    queryParts.push(`limit=${Number(params.limit)}`);
  }

  let users = await restFetch(`profiles?${queryParts.join("&")}`);

  if (params.search) {
    const search = params.search.trim().toLowerCase();

    users = users.filter((user) => {
      return (
        user.email?.toLowerCase().includes(search) ||
        user.full_name?.toLowerCase().includes(search) ||
        user.phone?.toLowerCase().includes(search)
      );
    });
  }

  return users || [];
};

export const getUserById = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const data = await restFetch(
    `profiles?select=*&id=eq.${encodeURIComponent(userId)}&limit=1`
  );

  return data?.[0] || null;
};

export const updateUser = async (userId, updateData) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const data = await restFetch(`profiles?id=eq.${encodeURIComponent(userId)}`, {
    method: "PATCH",
    body: {
      ...updateData,
      updated_at: new Date().toISOString(),
    },
  });

  return data?.[0] || null;
};

export const deleteUserProfile = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  await restFetch(`profiles?id=eq.${encodeURIComponent(userId)}`, {
    method: "DELETE",
    prefer: "return=minimal",
  });

  return true;
};

export const makeUserAdmin = async (userId) => {
  return updateUser(userId, {
    role: "Admin",
  });
};

export const makeUserNormal = async (userId) => {
  return updateUser(userId, {
    role: "User",
  });
};

/* -------------------------------------------------------------------------- */
/* Orders                                                                      */
/* -------------------------------------------------------------------------- */

const ADMIN_ORDER_SELECT = `
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

const attachProfilesToOrders = async (orders = []) => {
  if (!Array.isArray(orders) || orders.length === 0) {
    return [];
  }

  const profiles = await restFetch(
    "profiles?select=id,email,full_name,phone,role,created_at"
  );

  const profileMap = new Map();

  (profiles || []).forEach((profile) => {
    profileMap.set(profile.id, profile);
  });

  return orders.map((order) => ({
    ...order,
    profiles: profileMap.get(order.user_id) || null,
  }));
};

export const getAllOrders = async (params = {}) => {
  const select = encodeSelect(ADMIN_ORDER_SELECT);

  const queryParts = [`select=${select}`, "order=created_at.desc"];

  if (params.orderStatus) {
    queryParts.push(`order_status=eq.${encodeURIComponent(params.orderStatus)}`);
  }

  if (params.paymentStatus) {
    queryParts.push(
      `payment_status=eq.${encodeURIComponent(params.paymentStatus)}`
    );
  }

  if (params.userId) {
    queryParts.push(`user_id=eq.${encodeURIComponent(params.userId)}`);
  }

  if (params.limit) {
    queryParts.push(`limit=${Number(params.limit)}`);
  }

  const orders = await restFetch(`orders?${queryParts.join("&")}`);

  return attachProfilesToOrders(orders || []);
};

export const getAdminOrderById = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const select = encodeSelect(ADMIN_ORDER_SELECT);

  const data = await restFetch(
    `orders?select=${select}&id=eq.${encodeURIComponent(orderId)}&limit=1`
  );

  const ordersWithProfiles = await attachProfilesToOrders(data || []);

  return ordersWithProfiles?.[0] || null;
};

export const updateOrderStatus = async (orderId, orderStatus) => {
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

export const updatePaymentStatus = async (orderId, paymentStatus) => {
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

export const deleteOrder = async (orderId) => {
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
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

const PRODUCT_SELECT = `
  *,
  product_images(*)
`;

const cleanProductPayload = (productData = {}) => {
  return {
    name: productData.name || "",
    slug: productData.slug || "",
    brand: productData.brand || "",
    category: productData.category || "",
    description: productData.description || "",
    short_description:
      productData.short_description ||
      productData.shortDescription ||
      productData.description ||
      "",
    price: Number(productData.price || 0),
    discount_price: productData.discount_price
      ? Number(productData.discount_price)
      : null,
    stock: Number(productData.stock || 0),
    rating: Number(productData.rating || 0),
    is_featured: Boolean(productData.is_featured),
    features: Array.isArray(productData.features) ? productData.features : [],
    specs: productData.specs || productData.specifications || {},
    variants: productData.variants || {},
    status: productData.status || "active",
  };
};

export const getAllProducts = async (params = {}) => {
  const select = encodeSelect(PRODUCT_SELECT);

  const queryParts = [`select=${select}`, "order=created_at.desc"];

  if (params.category) {
    queryParts.push(`category=eq.${encodeURIComponent(params.category)}`);
  }

  if (params.brand) {
    queryParts.push(`brand=eq.${encodeURIComponent(params.brand)}`);
  }

  if (params.limit) {
    queryParts.push(`limit=${Number(params.limit)}`);
  }

  let products = await restFetch(`products?${queryParts.join("&")}`);

  if (params.search) {
    const search = params.search.trim().toLowerCase();

    products = products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(search) ||
        product.brand?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search)
      );
    });
  }

  return products || [];
};

export const getAdminProductById = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  const select = encodeSelect(PRODUCT_SELECT);

  const data = await restFetch(
    `products?select=${select}&id=eq.${encodeURIComponent(productId)}&limit=1`
  );

  return data?.[0] || null;
};

export const createAdminProduct = async (productData) => {
  if (!productData?.name) {
    throw new Error("Product name is required");
  }

  if (!productData?.price) {
    throw new Error("Product price is required");
  }

  const cleanData = cleanProductPayload(productData);

  const data = await restFetch("products", {
    method: "POST",
    body: [cleanData],
  });

  return data?.[0] || null;
};

export const updateAdminProduct = async (productId, productData) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  const cleanData = {
    ...cleanProductPayload(productData),
    updated_at: new Date().toISOString(),
  };

  const data = await restFetch(
    `products?id=eq.${encodeURIComponent(productId)}`,
    {
      method: "PATCH",
      body: cleanData,
    }
  );

  return data?.[0] || null;
};

export const deleteAdminProduct = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  await restFetch(`products?id=eq.${encodeURIComponent(productId)}`, {
    method: "DELETE",
    prefer: "return=minimal",
  });

  return true;
};

/* -------------------------------------------------------------------------- */
/* Product Images                                                              */
/* -------------------------------------------------------------------------- */

export const deleteProductImagesByProductId = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  await restFetch(
    `product_images?product_id=eq.${encodeURIComponent(productId)}`,
    {
      method: "DELETE",
      prefer: "return=minimal",
    }
  );

  return true;
};

export const insertProductImages = async (productId, images = []) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  const cleanedImages = images.filter(Boolean);

  if (cleanedImages.length === 0) {
    return [];
  }

  const rows = cleanedImages.map((imageUrl, index) => ({
    product_id: productId,
    image_url: imageUrl,
    is_primary: index === 0,
    sort_order: index,
  }));

  const data = await restFetch("product_images", {
    method: "POST",
    body: rows,
  });

  return data || [];
};

export const syncAdminProductImages = async (productId, images = []) => {
  await deleteProductImagesByProductId(productId);

  if (!images || images.length === 0) {
    return [];
  }

  return insertProductImages(productId, images);
};

/* -------------------------------------------------------------------------- */
/* Payments                                                                    */
/* -------------------------------------------------------------------------- */

export const getAllPayments = async (params = {}) => {
  const select = encodeSelect(`
    *,
    orders(*)
  `);

  const queryParts = [`select=${select}`, "order=created_at.desc"];

  if (params.status) {
    queryParts.push(`status=eq.${encodeURIComponent(params.status)}`);
  }

  if (params.provider) {
    queryParts.push(`provider=eq.${encodeURIComponent(params.provider)}`);
  }

  if (params.limit) {
    queryParts.push(`limit=${Number(params.limit)}`);
  }

  const data = await restFetch(`payments?${queryParts.join("&")}`);

  return data || [];
};

/* -------------------------------------------------------------------------- */
/* Dashboard Stats                                                             */
/* -------------------------------------------------------------------------- */

export const getDashboardStats = async () => {
  const [totalUsers, totalProducts, totalOrders, paidOrders, pendingOrders] =
    await Promise.all([
      countRows("profiles"),
      countRows("products"),
      countRows("orders"),
      countRows("orders", "&payment_status=eq.paid"),
      countRows("orders", "&payment_status=eq.pending"),
    ]);

  const revenueOrders = await restFetch(
    "orders?select=total_amount&payment_status=eq.paid"
  );

  const totalRevenue = (revenueOrders || []).reduce((total, order) => {
    return total + Number(order.total_amount || 0);
  }, 0);

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    paidOrders,
    pendingOrders,
    totalRevenue,
  };
};

export const getRecentActivity = async () => {
  const [recentOrdersRaw, recentUsers, recentProducts] = await Promise.all([
    restFetch("orders?select=*&order=created_at.desc&limit=5"),
    restFetch("profiles?select=*&order=created_at.desc&limit=5"),
    restFetch("products?select=*&order=created_at.desc&limit=5"),
  ]);

  const recentOrders = await attachProfilesToOrders(recentOrdersRaw || []);

  return {
    recentOrders: recentOrders || [],
    recentUsers: recentUsers || [],
    recentProducts: recentProducts || [],
  };
};

/* -------------------------------------------------------------------------- */
/* Old Name Compatibility                                                      */
/* -------------------------------------------------------------------------- */

export const adminGetUsers = getAllUsers;
export const adminPatchUser = updateUser;
export const adminDeleteUser = deleteUserProfile;

export const adminGetOrders = getAllOrders;
export const adminPatchOrder = updateOrderStatus;
export const adminDeleteOrder = deleteOrder;

export const getUsers = getAllUsers;
export const getOrders = getAllOrders;