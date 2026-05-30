// import React from "react";
// import { Link } from "react-router-dom";
// import { ShoppingBagIcon, TrashIcon } from "@heroicons/react/24/outline";
// import "./CartSection.css";

// const CartSection = ({ user, onRemoveCartItem }) => {
//   const cartItems = user?.cart || [];

//   const fallbackImage =
//     "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' fill='%23e5e7eb'%3E%3Crect width='64' height='64' rx='4'/%3E%3C/svg%3E";

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(price || 0);
//   };

//   const getProduct = (item) => {
//     return item.products || item.product || {};
//   };

//   const getProductName = (item) => {
//     const product = getProduct(item);
//     return item.productName || item.product_name || product.name || "Product";
//   };

//   const getProductImage = (item) => {
//     const product = getProduct(item);

//     return (
//       item.productImage ||
//       item.product_image ||
//       product.product_images?.find((image) => image.is_primary)?.image_url ||
//       product.product_images?.[0]?.image_url ||
//       product.images?.[0]?.image_url ||
//       fallbackImage
//     );
//   };

//   const getProductPrice = (item) => {
//     const product = getProduct(item);

//     return Number(
//       item.productPrice ||
//         item.product_price ||
//         product.discount_price ||
//         product.price ||
//         item.price ||
//         0
//     );
//   };

//   const getProductStorage = (item) => {
//     return item.storage || item.selected_options?.storage || item.options?.storage;
//   };

//   const getProductRam = (item) => {
//     return item.ram || item.selected_options?.ram || item.options?.ram;
//   };

//   const getCartTotal = () => {
//     return cartItems.reduce((total, item) => {
//       return total + getProductPrice(item) * Number(item.quantity || 1);
//     }, 0);
//   };

//   const handleRemoveCartItem = (item) => {
//     if (typeof onRemoveCartItem === "function") {
//       onRemoveCartItem(item);
//     }
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <h3 className="text-lg font-dm-sans font-semibold text-gray-900 mb-6">
//           My Cart
//         </h3>
//         <div className="text-center py-12">
//           <ShoppingBagIcon className="size-16 text-gray-300 mx-auto mb-4" />
//           <p className="text-gray-500 mb-2">Your cart is empty</p>
//           <Link
//             to="/store"
//             className="text-blue-600 hover:text-blue-700 font-medium"
//           >
//             Continue shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//       <h3 className="text-lg font-dm-sans font-semibold text-gray-900 mb-6">
//         My Cart ({cartItems.length} items)
//       </h3>

//       <div className="space-y-4">
//         {cartItems.map((item) => {
//           const productName = getProductName(item);
//           const productImage = getProductImage(item);
//           const productPrice = getProductPrice(item);
//           const storage = getProductStorage(item);
//           const ram = getProductRam(item);

//           return (
//             <div
//               key={item.id}
//               className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl"
//             >
//               <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center p-2">
//                 <img
//                   src={productImage}
//                   alt={productName}
//                   className="w-full h-full object-contain"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = fallbackImage;
//                   }}
//                 />
//               </div>

//               <div className="flex-1">
//                 <p className="font-medium text-gray-900">
//                   {productName}
//                 </p>

//                 <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
//                   {storage && <span>Storage: {storage}</span>}
//                   {ram && <span>RAM: {ram}</span>}
//                 </div>

//                 <p className="text-lg font-dm-sans font-bold text-gray-900 mt-2">
//                   {formatPrice(productPrice)} × {item.quantity || 1}
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => handleRemoveCartItem(item)}
//                 className="text-gray-400 hover:text-red-500 transition-colors"
//               >
//                 <TrashIcon className="size-4" />
//               </button>
//             </div>
//           );
//         })}

//         <div className="flex justify-between items-center pt-4 border-t border-gray-200">
//           <span className="font-semibold text-gray-900">
//             Total: {formatPrice(getCartTotal())}
//           </span>

//           <Link
//             to="/cart"
//             className="bg-gradient-to-b from-gray-500 to-gray-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3),_0px_4px_8px_rgba(0,0,0,0.4)] ring-1 ring-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:from-gray-400 hover:to-gray-700 transition-colors"
//           >
//             Go to Cart
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartSection;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBagIcon, TrashIcon } from "@heroicons/react/24/outline";
import "./CartSection.css";

const CartSection = ({ user, onRemoveCartItem }) => {
  const [removingItemId, setRemovingItemId] = useState(null);

  const cartItems = Array.isArray(user?.cart) ? user.cart : [];

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' fill='%23e5e7eb'%3E%3Crect width='64' height='64' rx='4'/%3E%3C/svg%3E";

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price || 0));
  };

  const getProduct = (item) => {
    return item?.products || item?.product || {};
  };

  const getProductName = (item) => {
    const product = getProduct(item);

    return (
      item?.productName ||
      item?.product_name ||
      product?.name ||
      "Product"
    );
  };

  const getProductImage = (item) => {
    const product = getProduct(item);

    return (
      item?.productImage ||
      item?.product_image ||
      product?.product_images?.find((image) => image.is_primary)?.image_url ||
      product?.product_images?.[0]?.image_url ||
      product?.images?.[0]?.image_url ||
      fallbackImage
    );
  };

  const getProductPrice = (item) => {
    const product = getProduct(item);

    return Number(
      item?.productPrice ||
        item?.product_price ||
        product?.discount_price ||
        product?.price ||
        item?.price ||
        0
    );
  };

  const getProductStorage = (item) => {
    return (
      item?.storage ||
      item?.selected_options?.storage ||
      item?.options?.storage ||
      ""
    );
  };

  const getProductRam = (item) => {
    return (
      item?.ram ||
      item?.selected_options?.ram ||
      item?.options?.ram ||
      ""
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + getProductPrice(item) * Number(item?.quantity || 1);
    }, 0);
  };

  const handleRemoveCartItem = async (item) => {
    if (!item?.id) {
      return;
    }

    if (removingItemId) {
      return;
    }

    const confirmRemove = window.confirm("Remove this item from cart?");

    if (!confirmRemove) {
      return;
    }

    try {
      setRemovingItemId(item.id);

      if (typeof onRemoveCartItem === "function") {
        await onRemoveCartItem(item);
      }
    } catch (error) {
      console.error("Remove cart item error:", error);
    } finally {
      setRemovingItemId(null);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-dm-sans font-semibold text-gray-900 mb-6">
          My Cart
        </h3>

        <div className="text-center py-12">
          <ShoppingBagIcon className="size-16 text-gray-300 mx-auto mb-4" />

          <p className="text-gray-500 mb-2">
            Your cart is empty
          </p>

          <Link
            to="/store"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-dm-sans font-semibold text-gray-900 mb-6">
        My Cart ({cartItems.length} items)
      </h3>

      <div className="space-y-4">
        {cartItems.map((item) => {
          const productName = getProductName(item);
          const productImage = getProductImage(item);
          const productPrice = getProductPrice(item);
          const storage = getProductStorage(item);
          const ram = getProductRam(item);
          const quantity = Number(item?.quantity || 1);
          const isRemoving = removingItemId === item.id;

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center p-2 shrink-0">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-full h-full object-contain"
                  onError={(event) => {
                    event.target.onerror = null;
                    event.target.src = fallbackImage;
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {productName}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-600">
                  {storage && <span>Storage: {storage}</span>}
                  {ram && <span>RAM: {ram}</span>}
                </div>

                <p className="text-lg font-dm-sans font-bold text-gray-900 mt-2">
                  {formatPrice(productPrice)} × {quantity}
                </p>

                <p className="text-sm text-gray-500">
                  Item total: {formatPrice(productPrice * quantity)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveCartItem(item)}
                disabled={isRemoving || Boolean(removingItemId)}
                className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Remove item"
              >
                {isRemoving ? (
                  <span className="text-xs text-gray-500">Removing...</span>
                ) : (
                  <TrashIcon className="size-4" />
                )}
              </button>
            </div>
          );
        })}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 border-t border-gray-200">
          <span className="font-semibold text-gray-900">
            Total: {formatPrice(getCartTotal())}
          </span>

          <Link
            to="/cart"
            className="bg-gradient-to-b from-gray-500 to-gray-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3),_0px_4px_8px_rgba(0,0,0,0.4)] ring-1 ring-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:from-gray-400 hover:to-gray-700 transition-colors text-center"
          >
            Go to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartSection;