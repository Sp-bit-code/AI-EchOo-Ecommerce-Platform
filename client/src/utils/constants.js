export const APP_NAME = "EchOo";

export const DEFAULT_CURRENCY = "INR";

export const FREE_SHIPPING_LIMIT = 50000;

export const DEFAULT_SHIPPING_CHARGE = 99;

export const USER_ROLES = {
  ADMIN: "Admin",
  USER: "User",
};

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
};

export const PAYMENT_METHODS = {
  CARD: "card",
  UPI: "upi",
  COD: "cod",
  NETBANKING: "netbanking",
  RAZORPAY: "razorpay",
};

export const PRODUCT_STATUS = {
  NEW: "new",
  ACTIVE: "active",
  INACTIVE: "inactive",
  OUT_OF_STOCK: "out-of-stock",
  COMING_SOON: "coming-soon",
};

export const PRODUCT_CATEGORIES = [
  "Smartphone",
  "Laptop",
  "Tablet",
  "Accessory",
  "Wearables",
  "Gaming",
  "Audio",
  "Smart Home",
  "Camera",
  "Other",
];

export const ROUTES = {
  HOME: "/",
  STORE: "/store",
  CART: "/cart",
  CHECKOUT: "/checkout",
  PROFILE: "/profile",
  SIGN_IN: "/sign_in",
  SIGN_UP: "/sign_up",
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
};

export const STORAGE_KEYS = {
  REMEMBERED_EMAIL: "rememberedEmail",
};