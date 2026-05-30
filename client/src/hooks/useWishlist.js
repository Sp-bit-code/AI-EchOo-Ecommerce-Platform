import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getWishlist,
  addToWishlist as addToWishlistRequest,
  removeFromWishlist as removeFromWishlistRequest,
  isInWishlist as isInWishlistRequest,
} from "../api/wishlistApi";

import { useAuth } from "../context/AuthContext";
import { normalizeProductImages } from "../utils/productCatalog";

const normalizeWishlistItem = (item = {}) => {
  const product = item.products || item.product || item;

  return {
    ...item,
    product,
    product_id: item.product_id || item.productId || product.id || "",
    product_name: item.product_name || product.name || "Product",
    product_price: Number(
      item.product_price ||
        item.price ||
        product.discount_price ||
        product.price ||
        0
    ),
    product_image:
      item.product_image ||
      normalizeProductImages(product)?.[0] ||
      "/no-image.png",
    created_at: item.created_at || null,
  };
};

const useWishlist = (options = {}) => {
  const { autoFetch = true } = options;

  const { user, isAuthenticated, authLoading } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(autoFetch);
  const [wishlistError, setWishlistError] = useState("");

  const fetchWishlist = useCallback(async () => {
    if (authLoading) {
      return [];
    }

    if (!isAuthenticated || !user?.id) {
      setWishlistItems([]);
      setWishlistLoading(false);
      return [];
    }

    try {
      setWishlistLoading(true);
      setWishlistError("");

      const response = await getWishlist();
      const list = Array.isArray(response)
        ? response
        : response?.data || response?.wishlist || [];

      const normalizedItems = list.map(normalizeWishlistItem);

      setWishlistItems(normalizedItems);

      return normalizedItems;
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      setWishlistError(error.message || "Failed to fetch wishlist");
      setWishlistItems([]);
      return [];
    } finally {
      setWishlistLoading(false);
    }
  }, [authLoading, isAuthenticated, user?.id]);

  const addToWishlist = useCallback(
    async (productId) => {
      if (!isAuthenticated || !user?.id) {
        throw new Error("Please sign in to add products to wishlist.");
      }

      const response = await addToWishlistRequest(productId);

      await fetchWishlist();

      return response?.data || response;
    },
    [fetchWishlist, isAuthenticated, user?.id]
  );

  const removeFromWishlist = useCallback(
    async (productId) => {
      if (!isAuthenticated || !user?.id) {
        throw new Error("Please sign in to remove products from wishlist.");
      }

      const response = await removeFromWishlistRequest(productId);

      await fetchWishlist();

      return response?.data || response;
    },
    [fetchWishlist, isAuthenticated, user?.id]
  );

  const toggleWishlist = useCallback(
    async (productId) => {
      const exists = wishlistItems.some((item) => {
        return String(item.product_id) === String(productId);
      });

      if (exists) {
        await removeFromWishlist(productId);
        return false;
      }

      await addToWishlist(productId);
      return true;
    },
    [wishlistItems, addToWishlist, removeFromWishlist]
  );

  const checkWishlist = useCallback(
    async (productId) => {
      if (!isAuthenticated || !user?.id || !productId) {
        return false;
      }

      if (typeof isInWishlistRequest === "function") {
        const response = await isInWishlistRequest(productId);
        return Boolean(response?.data || response?.exists || response);
      }

      return wishlistItems.some((item) => {
        return String(item.product_id) === String(productId);
      });
    },
    [isAuthenticated, user?.id, wishlistItems]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchWishlist();
    }
  }, [autoFetch, fetchWishlist]);

  const wishlistCount = useMemo(() => {
    return wishlistItems.length;
  }, [wishlistItems]);

  return {
    wishlistItems,
    wishlistCount,
    wishlistLoading,
    wishlistError,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    checkWishlist,
    setWishlistItems,
  };
};

export default useWishlist;
export { useWishlist };