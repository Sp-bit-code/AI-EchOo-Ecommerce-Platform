import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

import { addToCart } from "../../../api/cartApi";
import { removeFromWishlist } from "../../../api/wishlistApi";
import "./WishlistSection.css";

const WishlistSection = ({ user, onRefresh }) => {
  const [wishlistItems, setWishlistItems] = useState(user?.wishlist || []);
  const [loadingId, setLoadingId] = useState(null);

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' fill='%23e5e7eb'%3E%3Crect width='80' height='80' rx='4'/%3E%3C/svg%3E";

  useEffect(() => {
    setWishlistItems(user?.wishlist || []);
  }, [user]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);

  const getProduct = (item) => {
    return item.products || item.product || {};
  };

  const getProductId = (item) => {
    const product = getProduct(item);
    return item.product_id || product.id;
  };

  const getProductImage = (item) => {
    const product = getProduct(item);

    return (
      product.product_images?.find((image) => image.is_primary)?.image_url ||
      product.product_images?.[0]?.image_url ||
      product.images?.[0]?.image_url ||
      item.product_image ||
      fallbackImage
    );
  };

  const handleRemove = async (item) => {
    const productId = getProductId(item);

    if (!productId) {
      toast.error("Product not found");
      return;
    }

    setLoadingId(item.id || productId);

    try {
      await removeFromWishlist(productId);

      const updatedWishlist = wishlistItems.filter((wishlistItem) => {
        return getProductId(wishlistItem) !== productId;
      });

      setWishlistItems(updatedWishlist);

      await onRefresh?.();
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to remove item");
    } finally {
      setLoadingId(null);
    }
  };

  const handleAddToCart = async (item) => {
    const product = getProduct(item);
    const productId = getProductId(item);

    if (!productId) {
      toast.error("Product not found");
      return;
    }

    try {
      if (Number(product.stock || 0) === 0) {
        toast.error("Product is out of stock");
        return;
      }

      await addToCart({ productId, quantity: 1 });
      toast.success("Added to cart!");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Could not add to cart");
    }
  };

  if (!wishlistItems.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-dm-sans font-semibold text-gray-900 mb-6">My Wishlist</h3>
        <div className="text-center py-12">
          <HeartIcon className="size-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Your wishlist is empty</p>
          <Link to="/store" className="text-blue-600 hover:text-blue-700 font-medium">
            Explore products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-dm-sans font-semibold text-gray-900 mb-6">
        My Wishlist ({wishlistItems.length} items)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wishlistItems.map((item) => {
          const product = getProduct(item);
          const productId = getProductId(item);
          const image = getProductImage(item);

          return (
            <div key={item.id || productId} className="border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition-all">
              <div className="flex gap-4">
                <Link to={product.slug ? `/product/${product.slug}` : "#"} className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center p-2 shrink-0">
                  <img
                    src={image}
                    alt={product.name || item.product_name || "Wishlist product"}
                    className="w-full h-full object-contain mix-blend-multiply"
                    onError={(event) => {
                      event.target.onerror = null;
                      event.target.src = fallbackImage;
                    }}
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={product.slug ? `/product/${product.slug}` : "#"} className="hover:text-gray-700 transition-colors">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {product.name || item.product_name || "Unknown Product"}
                    </p>
                  </Link>

                  <p className="text-sm text-gray-500 mt-1">
                    {product.brand || "Brand"}
                  </p>

                  <p className="text-lg font-dm-sans font-bold text-gray-900 mt-2">
                    {formatPrice(product.discount_price || product.price || item.product_price)}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-gradient-to-b from-gray-500 to-gray-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3),_0px_4px_8px_rgba(0,0,0,0.4)] ring-1 ring-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-gray-400 hover:to-gray-700 transition-colors"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() => handleRemove(item)}
                      disabled={loadingId === item.id || loadingId === productId}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <TrashIcon className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistSection;