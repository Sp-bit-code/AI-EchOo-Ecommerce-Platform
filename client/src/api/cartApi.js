import { getCurrentUser } from "./authApi";

/*
  cartApi.js

  Stable REST version:
  - Uses Supabase REST API for cart table operations
  - Uses saved echoo_access_token from localStorage
  - Avoids supabase.auth.getSession() because it hangs in browser
  - Keeps same exported function names
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

const getAccessToken = async () => {
  const token = localStorage.getItem("echoo_access_token");

  if (token) {
    return token;
  }

  return SUPABASE_KEY;
};

const restFetch = async (path, options = {}) => {
  const token = await getAccessToken();

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
    console.error("Cart REST error:", response.status, text);
    throw new Error(text || "Cart request failed");
  }

  return text ? JSON.parse(text) : null;
};

const CART_SELECT = `
  *,
  products(
    id,
    name,
    slug,
    brand,
    category,
    price,
    discount_price,
    stock,
    rating,
    variants,
    product_images(
      id,
      product_id,
      image_url,
      is_primary,
      sort_order
    )
  )
`;

const encodeSelect = (select) => {
  return encodeURIComponent(select.replace(/\s+/g, ""));
};

/* -------------------------------------------------------------------------- */
/* Helper: Require Logged-In User                                              */
/* -------------------------------------------------------------------------- */

const requireUser = async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Please login first");
  }

  return user;
};

/* -------------------------------------------------------------------------- */
/* Helper: Normalize Cart Item                                                 */
/* -------------------------------------------------------------------------- */

const normalizeCartItem = (item = {}) => {
  const product = item.products;

  if (!product) {
    return item;
  }

  const images = Array.isArray(product.product_images)
    ? [...product.product_images].sort((a, b) => {
        if (a?.is_primary && !b?.is_primary) return -1;
        if (!a?.is_primary && b?.is_primary) return 1;
        return Number(a?.sort_order || 0) - Number(b?.sort_order || 0);
      })
    : [];

  return {
    ...item,
    quantity: Number(item.quantity || 1),
    products: {
      ...product,
      images,
      product_images: images,
      price: Number(product.price || 0),
      discount_price: product.discount_price
        ? Number(product.discount_price)
        : null,
      stock: Number(product.stock || 0),
      rating: Number(product.rating || 0),
      variants: product.variants || {},
    },
  };
};

/* -------------------------------------------------------------------------- */
/* Helper: Get One Cart Item                                                   */
/* -------------------------------------------------------------------------- */

const getCartItemById = async (cartItemId) => {
  const select = encodeSelect(CART_SELECT);

  const data = await restFetch(
    `cart_items?select=${select}&id=eq.${encodeURIComponent(cartItemId)}&limit=1`
  );

  return data?.[0] ? normalizeCartItem(data[0]) : null;
};

/* -------------------------------------------------------------------------- */
/* Get Cart Items                                                              */
/* -------------------------------------------------------------------------- */

export const getCart = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const select = encodeSelect(CART_SELECT);

  const data = await restFetch(
    `cart_items?select=${select}&user_id=eq.${encodeURIComponent(
      user.id
    )}&order=created_at.desc`
  );

  return (data || []).map(normalizeCartItem);
};

/* -------------------------------------------------------------------------- */
/* Add To Cart                                                                 */
/* -------------------------------------------------------------------------- */

export const addToCart = async ({ productId, quantity = 1 }) => {
  const user = await requireUser();

  if (!productId) {
    throw new Error("Product ID is required");
  }

  const finalQuantity = Number(quantity);

  if (finalQuantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const existing = await restFetch(
    `cart_items?select=*&user_id=eq.${encodeURIComponent(
      user.id
    )}&product_id=eq.${encodeURIComponent(productId)}&limit=1`
  );

  const existingItem = existing?.[0];

  if (existingItem) {
    await restFetch(`cart_items?id=eq.${encodeURIComponent(existingItem.id)}`, {
      method: "PATCH",
      body: {
        quantity: Number(existingItem.quantity || 0) + finalQuantity,
        updated_at: new Date().toISOString(),
      },
    });

    return getCartItemById(existingItem.id);
  }

  const inserted = await restFetch("cart_items", {
    method: "POST",
    body: [
      {
        user_id: user.id,
        product_id: productId,
        quantity: finalQuantity,
      },
    ],
  });

  const newItem = Array.isArray(inserted) ? inserted[0] : inserted;

  if (!newItem?.id) {
    return null;
  }

  return getCartItemById(newItem.id);
};

/* -------------------------------------------------------------------------- */
/* Update Cart Item Quantity                                                   */
/* -------------------------------------------------------------------------- */

export const updateCartItem = async (cartItemId, { quantity }) => {
  await requireUser();

  if (!cartItemId) {
    throw new Error("Cart item ID is required");
  }

  const finalQuantity = Number(quantity);

  if (finalQuantity <= 0) {
    return removeCartItem(cartItemId);
  }

  await restFetch(`cart_items?id=eq.${encodeURIComponent(cartItemId)}`, {
    method: "PATCH",
    body: {
      quantity: finalQuantity,
      updated_at: new Date().toISOString(),
    },
  });

  return getCartItemById(cartItemId);
};

/* -------------------------------------------------------------------------- */
/* Increase Cart Item Quantity                                                 */
/* -------------------------------------------------------------------------- */

export const increaseCartItem = async (cartItemId) => {
  await requireUser();

  if (!cartItemId) {
    throw new Error("Cart item ID is required");
  }

  const data = await restFetch(
    `cart_items?select=*&id=eq.${encodeURIComponent(cartItemId)}&limit=1`
  );

  const item = data?.[0];

  if (!item) {
    throw new Error("Cart item not found");
  }

  return updateCartItem(cartItemId, {
    quantity: Number(item.quantity || 0) + 1,
  });
};

/* -------------------------------------------------------------------------- */
/* Decrease Cart Item Quantity                                                 */
/* -------------------------------------------------------------------------- */

export const decreaseCartItem = async (cartItemId) => {
  await requireUser();

  if (!cartItemId) {
    throw new Error("Cart item ID is required");
  }

  const data = await restFetch(
    `cart_items?select=*&id=eq.${encodeURIComponent(cartItemId)}&limit=1`
  );

  const item = data?.[0];

  if (!item) {
    throw new Error("Cart item not found");
  }

  const newQuantity = Number(item.quantity || 0) - 1;

  if (newQuantity <= 0) {
    return removeCartItem(cartItemId);
  }

  return updateCartItem(cartItemId, {
    quantity: newQuantity,
  });
};

/* -------------------------------------------------------------------------- */
/* Remove Cart Item                                                            */
/* -------------------------------------------------------------------------- */

export const removeCartItem = async (cartItemId) => {
  await requireUser();

  if (!cartItemId) {
    throw new Error("Cart item ID is required");
  }

  await restFetch(`cart_items?id=eq.${encodeURIComponent(cartItemId)}`, {
    method: "DELETE",
    prefer: "return=minimal",
  });

  return true;
};

/* -------------------------------------------------------------------------- */
/* Remove Product From Cart By Product ID                                      */
/* -------------------------------------------------------------------------- */

export const removeProductFromCart = async (productId) => {
  const user = await requireUser();

  if (!productId) {
    throw new Error("Product ID is required");
  }

  await restFetch(
    `cart_items?user_id=eq.${encodeURIComponent(
      user.id
    )}&product_id=eq.${encodeURIComponent(productId)}`,
    {
      method: "DELETE",
      prefer: "return=minimal",
    }
  );

  return true;
};

/* -------------------------------------------------------------------------- */
/* Clear Full Cart                                                             */
/* -------------------------------------------------------------------------- */

export const clearCart = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return true;
  }

  await restFetch(`cart_items?user_id=eq.${encodeURIComponent(user.id)}`, {
    method: "DELETE",
    prefer: "return=minimal",
  });

  return true;
};

/* -------------------------------------------------------------------------- */
/* Check If Product Is In Cart                                                 */
/* -------------------------------------------------------------------------- */

export const isProductInCart = async (productId) => {
  const user = await getCurrentUser();

  if (!user || !productId) {
    return false;
  }

  const data = await restFetch(
    `cart_items?select=id&user_id=eq.${encodeURIComponent(
      user.id
    )}&product_id=eq.${encodeURIComponent(productId)}&limit=1`
  );

  return Boolean(data?.[0]);
};

/* -------------------------------------------------------------------------- */
/* Get Cart Count                                                              */
/* -------------------------------------------------------------------------- */

export const getCartCount = async () => {
  const cartItems = await getCart();

  return cartItems.reduce((total, item) => {
    return total + Number(item.quantity || 0);
  }, 0);
};

/* -------------------------------------------------------------------------- */
/* Calculate Cart Total                                                        */
/* -------------------------------------------------------------------------- */

export const calculateCartTotal = (cartItems = []) => {
  return cartItems.reduce((total, item) => {
    const product = item.products;

    if (!product) {
      return total;
    }

    const price = Number(product.discount_price || product.price || 0);
    const quantity = Number(item.quantity || 1);

    return total + price * quantity;
  }, 0);
};

/* -------------------------------------------------------------------------- */
/* Calculate Cart Summary                                                      */
/* -------------------------------------------------------------------------- */

export const calculateCartSummary = (cartItems = []) => {
  const subtotal = calculateCartTotal(cartItems);

  const totalItems = cartItems.reduce((total, item) => {
    return total + Number(item.quantity || 0);
  }, 0);

  const shipping = subtotal > 0 ? 0 : 0;
  const tax = 0;
  const discount = 0;
  const total = subtotal + shipping + tax - discount;

  return {
    totalItems,
    subtotal,
    shipping,
    tax,
    discount,
    total,
  };
};