import { getCurrentUser } from "./authApi";

/*
  wishlistApi.js

  Stable REST version:
  - Uses Supabase REST API
  - Uses echoo_access_token from localStorage
  - Avoids supabase.from()
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
    console.error("Wishlist REST error:", response.status, text);
    throw new Error(text || "Wishlist request failed");
  }

  return text ? JSON.parse(text) : null;
};

const encodeSelect = (select) => {
  return encodeURIComponent(select.replace(/\s+/g, ""));
};

const WISHLIST_SELECT = `
  *,
  products(
    *,
    product_images(*)
  )
`;

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
/* Get Wishlist Items                                                          */
/* -------------------------------------------------------------------------- */

export const getWishlist = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const select = encodeSelect(WISHLIST_SELECT);

  const data = await restFetch(
    `wishlist_items?select=${select}&user_id=eq.${encodeURIComponent(
      user.id
    )}&order=created_at.desc`
  );

  return data || [];
};

/* -------------------------------------------------------------------------- */
/* Add Product To Wishlist                                                     */
/* -------------------------------------------------------------------------- */

export const addToWishlist = async (productId) => {
  const user = await requireUser();

  if (!productId) {
    throw new Error("Product ID is required");
  }

  const existing = await restFetch(
    `wishlist_items?select=*&user_id=eq.${encodeURIComponent(
      user.id
    )}&product_id=eq.${encodeURIComponent(productId)}&limit=1`
  );

  const existingItem = existing?.[0];

  if (existingItem) {
    return existingItem;
  }

  const inserted = await restFetch("wishlist_items", {
    method: "POST",
    body: [
      {
        user_id: user.id,
        product_id: productId,
      },
    ],
  });

  const newItem = Array.isArray(inserted) ? inserted[0] : inserted;

  if (!newItem?.id) {
    return null;
  }

  return getWishlistItemById(newItem.id);
};

/* -------------------------------------------------------------------------- */
/* Get Wishlist Item By ID                                                     */
/* -------------------------------------------------------------------------- */

const getWishlistItemById = async (wishlistItemId) => {
  const select = encodeSelect(WISHLIST_SELECT);

  const data = await restFetch(
    `wishlist_items?select=${select}&id=eq.${encodeURIComponent(
      wishlistItemId
    )}&limit=1`
  );

  return data?.[0] || null;
};

/* -------------------------------------------------------------------------- */
/* Remove Product From Wishlist By Product ID                                  */
/* -------------------------------------------------------------------------- */

export const removeFromWishlist = async (productId) => {
  const user = await requireUser();

  if (!productId) {
    throw new Error("Product ID is required");
  }

  await restFetch(
    `wishlist_items?user_id=eq.${encodeURIComponent(
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
/* Remove Wishlist Item By Wishlist Item ID                                    */
/* -------------------------------------------------------------------------- */

export const removeWishlistItem = async (wishlistItemId) => {
  await requireUser();

  if (!wishlistItemId) {
    throw new Error("Wishlist item ID is required");
  }

  await restFetch(`wishlist_items?id=eq.${encodeURIComponent(wishlistItemId)}`, {
    method: "DELETE",
    prefer: "return=minimal",
  });

  return true;
};

/* -------------------------------------------------------------------------- */
/* Check If Product Is In Wishlist                                             */
/* -------------------------------------------------------------------------- */

export const isProductInWishlist = async (productId) => {
  const user = await getCurrentUser();

  if (!user || !productId) {
    return false;
  }

  const data = await restFetch(
    `wishlist_items?select=id&user_id=eq.${encodeURIComponent(
      user.id
    )}&product_id=eq.${encodeURIComponent(productId)}&limit=1`
  );

  return Boolean(data?.[0]);
};

/* -------------------------------------------------------------------------- */
/* Toggle Wishlist                                                             */
/* -------------------------------------------------------------------------- */

export const toggleWishlist = async (productId) => {
  const user = await requireUser();

  if (!productId) {
    throw new Error("Product ID is required");
  }

  const existing = await restFetch(
    `wishlist_items?select=*&user_id=eq.${encodeURIComponent(
      user.id
    )}&product_id=eq.${encodeURIComponent(productId)}&limit=1`
  );

  const existingItem = existing?.[0];

  if (existingItem) {
    await restFetch(`wishlist_items?id=eq.${encodeURIComponent(existingItem.id)}`, {
      method: "DELETE",
      prefer: "return=minimal",
    });

    return {
      added: false,
      removed: true,
      item: existingItem,
    };
  }

  const inserted = await restFetch("wishlist_items", {
    method: "POST",
    body: [
      {
        user_id: user.id,
        product_id: productId,
      },
    ],
  });

  const newItem = Array.isArray(inserted) ? inserted[0] : inserted;
  const fullItem = newItem?.id ? await getWishlistItemById(newItem.id) : newItem;

  return {
    added: true,
    removed: false,
    item: fullItem,
  };
};

/* -------------------------------------------------------------------------- */
/* Clear Full Wishlist                                                         */
/* -------------------------------------------------------------------------- */

export const clearWishlist = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return true;
  }

  await restFetch(`wishlist_items?user_id=eq.${encodeURIComponent(user.id)}`, {
    method: "DELETE",
    prefer: "return=minimal",
  });

  return true;
};

/* -------------------------------------------------------------------------- */
/* Get Wishlist Count                                                          */
/* -------------------------------------------------------------------------- */

export const getWishlistCount = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return 0;
  }

  const token = getAccessToken();

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/wishlist_items?select=id&user_id=eq.${encodeURIComponent(
      user.id
    )}`,
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
    console.error("Wishlist count error:", response.status, text);
    throw new Error(text || "Wishlist count failed");
  }

  return Number(response.headers.get("content-range")?.split("/")?.[1] || 0);
};

/* -------------------------------------------------------------------------- */
/* Get Wishlist Product IDs                                                    */
/* -------------------------------------------------------------------------- */

export const getWishlistProductIds = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const data = await restFetch(
    `wishlist_items?select=product_id&user_id=eq.${encodeURIComponent(user.id)}`
  );

  return data?.map((item) => item.product_id) || [];
};

/* -------------------------------------------------------------------------- */
/* Move Wishlist Item To Cart Helper                                           */
/* -------------------------------------------------------------------------- */

export const removeWishlistAfterCartAdd = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  await removeFromWishlist(productId);

  return true;
};