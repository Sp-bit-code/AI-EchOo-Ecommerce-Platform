// import { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// import { getCurrentUser, getProfile } from "../../../api/authApi";
// import { getCart, clearCart } from "../../../api/cartApi";
// import { createOrder, cancelOrder } from "../../../api/orderApi";
// import { startPaymentFlow } from "../../../api/paymentApi";
// import "./Checkout.css";

// const initialFormData = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   phone: "",
//   address: "",
//   city: "",
//   state: "",
//   pincode: "",
//   paymentMethod: "razorpay",
// };

// const Checkout = () => {
//   const [loading, setLoading] = useState(false);
//   const [loadingCart, setLoadingCart] = useState(true);
//   const [cartItems, setCartItems] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [formData, setFormData] = useState(initialFormData);

//   const placingOrderRef = useRef(false);
//   const navigate = useNavigate();

//   const fallbackImage =
//     "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' fill='%23e5e7eb'%3E%3Crect width='80' height='80' rx='8'/%3E%3C/svg%3E";

//   useEffect(() => {
//     const loadCheckoutData = async () => {
//       try {
//         const user = await getCurrentUser();

//         if (!user) {
//           setLoadingCart(false);
//           return;
//         }

//         setCurrentUser(user);

//         const userProfile = await getProfile();
//         setProfile(userProfile);

//         const fullName =
//           userProfile?.full_name ||
//           user.user_metadata?.full_name ||
//           user.email?.split("@")[0] ||
//           "";

//         setFormData((prev) => ({
//           ...prev,
//           firstName: fullName?.split(" ")[0] || "",
//           lastName: fullName?.split(" ").slice(1).join(" ") || "",
//           email: userProfile?.email || user.email || "",
//           phone: userProfile?.phone || "",
//         }));

//         const items = await getCart();
//         setCartItems(Array.isArray(items) ? items : []);
//       } catch (error) {
//         console.error("Checkout load error:", error);
//         toast.error("Failed to load checkout");
//       } finally {
//         setLoadingCart(false);
//       }
//     };

//     loadCheckoutData();
//   }, []);

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

//   const subtotal = useMemo(() => {
//     return cartItems.reduce((total, item) => {
//       return total + getProductPrice(item) * Number(item.quantity || 1);
//     }, 0);
//   }, [cartItems]);

//   const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 99;
//   const total = subtotal + shipping;

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const buildShippingAddress = () => {
//     return {
//       full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
//       first_name: formData.firstName.trim(),
//       last_name: formData.lastName.trim(),
//       email: formData.email.trim(),
//       phone: formData.phone.trim(),
//       address: formData.address.trim(),
//       city: formData.city.trim(),
//       state: formData.state.trim(),
//       pincode: formData.pincode.trim(),
//     };
//   };

//   const validateCheckout = () => {
//     if (!currentUser) {
//       toast.error("Please login first");
//       navigate("/login");
//       return false;
//     }

//     if (!cartItems.length) {
//       toast.error("Your cart is empty");
//       return false;
//     }

//     const requiredFields = [
//       "firstName",
//       "lastName",
//       "email",
//       "phone",
//       "address",
//       "city",
//       "state",
//       "pincode",
//     ];

//     if (requiredFields.some((field) => !String(formData[field] || "").trim())) {
//       toast.error("Please complete all shipping fields");
//       return false;
//     }

//     return true;
//   };

//   const cancelUnpaidOrder = async (orderId) => {
//     if (!orderId) return;

//     try {
//       await cancelOrder(orderId);
//     } catch (error) {
//       console.error("Cancel unpaid order error:", error);
//     }
//   };

//   const handlePlaceOrder = async () => {
//     if (placingOrderRef.current || loading) {
//       toast.info("Order is already processing...");
//       return;
//     }

//     if (!validateCheckout()) return;

//     placingOrderRef.current = true;
//     setLoading(true);

//     const shippingAddress = buildShippingAddress();

//     try {
//       const orderResponse = await createOrder({
//         items: cartItems,
//         address: shippingAddress,
//         totalAmount: total,
//         paymentMethod: formData.paymentMethod,
//         notes: "",
//       });

//       const createdOrder = orderResponse?.order;

//       if (!createdOrder?.id) {
//         throw new Error("Order created but order ID missing");
//       }

//       if (formData.paymentMethod === "cod") {
//         await clearCart();
//         setCartItems([]);

//         toast.success(`Order placed! ID: ${createdOrder.id}`);
//         navigate(`/order-confirmation/${createdOrder.id}`, {
//           replace: true,
//           state: {
//             order: createdOrder,
//             orderItems: orderResponse.orderItems,
//           },
//         });

//         return;
//       }

//       await startPaymentFlow({
//         order: createdOrder,
//         user: {
//           ...currentUser,
//           ...profile,
//           name: shippingAddress.full_name,
//           full_name: shippingAddress.full_name,
//           email: shippingAddress.email,
//           phone: shippingAddress.phone,
//         },
//         onSuccess: async () => {
//           try {
//             await clearCart();
//             setCartItems([]);
//           } catch (cartError) {
//             console.error("Clear cart after payment error:", cartError);
//           }

//           toast.success(`Order confirmed! ID: ${createdOrder.id}`);

//           navigate(`/order-confirmation/${createdOrder.id}`, {
//             replace: true,
//             state: {
//               order: createdOrder,
//               orderItems: orderResponse.orderItems,
//             },
//           });
//         },
//         onFailure: async (error) => {
//           await cancelUnpaidOrder(createdOrder.id);

//           toast.error(
//             error?.message === "Payment popup closed by user"
//               ? "Payment cancelled. Order was not placed."
//               : error?.message || "Payment failed. Order was not placed."
//           );
//         },
//       });
//     } catch (error) {
//       console.error("Checkout error:", error);

//       if (error?.code === "PGRST303" || error?.message?.includes("JWT expired")) {
//         toast.error("Session expired. Please login again.");
//         localStorage.clear();
//         sessionStorage.clear();
//         navigate("/login");
//       } else {
//         toast.error(error?.message || "Order failed. Please try again.");
//       }
//     } finally {
//       placingOrderRef.current = false;
//       setLoading(false);
//     }
//   };

//   const inputClass =
//     "w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all placeholder:text-gray-400 text-gray-800 text-sm";
//   const labelClass =
//     "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1";
//   const bubbleButtonClass =
//     "bg-gradient-to-b from-gray-500 to-gray-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3),_0px_4px_8px_rgba(0,0,0,0.4)] ring-1 ring-gray-600 text-white transition-all hover:from-gray-400 hover:to-gray-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
//   const glassPanelClass =
//     "bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-6 lg:p-8";

//   if (loadingCart) {
//     return (
//       <div className="min-h-screen bg-[#d9e8f5] flex items-center justify-center text-gray-600">
//         Loading checkout...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#d9e8f5] via-[#e2ebf4] to-[#f4f7fa] font-sans pt-28 pb-20">
//       <div className="max-w-[1400px] mx-auto px-6">
//         <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
//           <div>
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               disabled={loading}
//               className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold text-xs uppercase tracking-widest mb-4 disabled:opacity-50"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
//               </svg>
//               Review Cart
//             </button>

//             <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 leading-none">
//               Checkout
//             </h1>
//           </div>

//           <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
//             <span className="text-gray-900 border-b-2 border-gray-900 pb-1">Shipping</span>
//             <span>➔</span>
//             <span>Payment</span>
//             <span>➔</span>
//             <span>Success</span>
//           </div>
//         </div>

//         <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
//           <div className="lg:col-span-7 space-y-8 w-full">
//             <div className={glassPanelClass}>
//               <div className="flex items-center gap-3 mb-8">
//                 <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900">Shipping Details</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className={labelClass}>First Name</label>
//                   <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={inputClass} placeholder="John" disabled={loading} />
//                 </div>

//                 <div>
//                   <label className={labelClass}>Last Name</label>
//                   <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={inputClass} placeholder="Doe" disabled={loading} />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className={labelClass}>Email Address</label>
//                   <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass} placeholder="john@example.com" disabled={loading} />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className={labelClass}>Phone Number</label>
//                   <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass} placeholder="+91 00000 00000" disabled={loading} />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className={labelClass}>Street Address</label>
//                   <textarea name="address" value={formData.address} onChange={handleInputChange} rows="2" className={`${inputClass} resize-none`} placeholder="House No, Building, Street..." disabled={loading} />
//                 </div>

//                 <div>
//                   <label className={labelClass}>City</label>
//                   <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={inputClass} disabled={loading} />
//                 </div>

//                 <div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className={labelClass}>State</label>
//                       <input type="text" name="state" value={formData.state} onChange={handleInputChange} className={inputClass} disabled={loading} />
//                     </div>

//                     <div>
//                       <label className={labelClass}>PIN</label>
//                       <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className={inputClass} disabled={loading} />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className={glassPanelClass}>
//               <div className="flex items-center gap-3 mb-8">
//                 <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                   </svg>
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <label className={`relative flex flex-col p-5 rounded-3xl border-2 transition-all cursor-pointer hover:bg-white/40 ${formData.paymentMethod === "card" ? "border-gray-900 bg-white/60 shadow-lg" : "border-transparent bg-white/20"}`}>
//                   <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === "card"} onChange={handleInputChange} className="hidden" disabled={loading} />
//                   <span className="font-bold text-gray-900">Credit / Debit Card</span>
//                   <span className="text-xs text-gray-500 mt-1">Secure Payment via Razorpay</span>
//                 </label>

//                 <label className={`relative flex flex-col p-5 rounded-3xl border-2 transition-all cursor-pointer hover:bg-white/40 ${formData.paymentMethod === "razorpay" ? "border-gray-900 bg-white/60 shadow-lg" : "border-transparent bg-white/20"}`}>
//                   <input type="radio" name="paymentMethod" value="razorpay" checked={formData.paymentMethod === "razorpay"} onChange={handleInputChange} className="hidden" disabled={loading} />
//                   <span className="font-bold text-gray-900">Wallets & Netbanking</span>
//                   <span className="text-xs text-gray-500 mt-1">Secure Pay via Razorpay</span>
//                 </label>

//                 <label className={`relative flex flex-col p-5 rounded-3xl border-2 transition-all cursor-pointer hover:bg-white/40 ${formData.paymentMethod === "upi" ? "border-gray-900 bg-white/60 shadow-lg" : "border-transparent bg-white/20"}`}>
//                   <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === "upi"} onChange={handleInputChange} className="hidden" disabled={loading} />
//                   <span className="font-bold text-gray-900">Direct UPI / QR</span>
//                   <span className="text-xs text-gray-500 mt-1">Pay using UPI</span>
//                 </label>

//                 <label className={`relative flex flex-col p-5 rounded-3xl border-2 transition-all cursor-pointer hover:bg-white/40 ${formData.paymentMethod === "cod" ? "border-gray-900 bg-white/60 shadow-lg" : "border-transparent bg-white/20"}`}>
//                   <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleInputChange} className="hidden" disabled={loading} />
//                   <span className="font-bold text-gray-900">Cash on Delivery</span>
//                   <span className="text-xs text-gray-500 mt-1">Pay at your doorstep</span>
//                 </label>
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-5 w-full sticky top-28">
//             <div className={`${glassPanelClass} !p-0 overflow-hidden`}>
//               <div className="p-8">
//                 <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

//                 <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
//                   {cartItems.map((item) => {
//                     const productName = getProductName(item);
//                     const productImage = getProductImage(item);
//                     const productPrice = getProductPrice(item);

//                     return (
//                       <div key={item.id} className="flex gap-4 group">
//                         <div className="w-20 h-20 bg-white/60 rounded-2xl flex items-center justify-center p-2 border border-white/80 shadow-sm shrink-0">
//                           <img
//                             src={productImage}
//                             alt={productName}
//                             className="w-full h-full object-contain mix-blend-multiply"
//                             onError={(event) => {
//                               event.target.onerror = null;
//                               event.target.src = fallbackImage;
//                             }}
//                           />
//                         </div>

//                         <div className="flex-1 flex flex-col justify-center">
//                           <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
//                             {productName}
//                           </h4>
//                           <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-tighter">
//                             Qty {item.quantity}
//                           </p>
//                           <p className="font-bold text-gray-900 mt-1">
//                             ₹{(productPrice * Number(item.quantity || 1)).toLocaleString("en-IN")}
//                           </p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="bg-black/5 p-8 space-y-4">
//                 <div className="flex justify-between text-sm text-gray-600 font-medium">
//                   <span>Subtotal</span>
//                   <span className="text-gray-900 font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
//                 </div>

//                 <div className="flex justify-between text-sm text-gray-600 font-medium">
//                   <span>Shipping</span>
//                   <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">
//                     {shipping === 0 ? "FREE" : `₹${shipping}`}
//                   </span>
//                 </div>

//                 <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
//                   <div className="flex flex-col">
//                     <span className="text-xs font-bold uppercase text-gray-400">Total Payable</span>
//                     <span className="text-[10px] text-gray-500">Includes all taxes</span>
//                   </div>
//                   <span className="text-3xl font-black text-gray-900 tracking-tight">
//                     ₹{total.toLocaleString("en-IN")}
//                   </span>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={handlePlaceOrder}
//                   disabled={loading || loadingCart || !cartItems.length}
//                   className={`w-full mt-6 py-5 rounded-3xl font-black uppercase tracking-widest text-sm ${bubbleButtonClass}`}
//                 >
//                   {loading ? (
//                     <div className="flex items-center justify-center gap-3">
//                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                       Processing...
//                     </div>
//                   ) : (
//                     "Complete Purchase"
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="mt-6 flex items-center justify-center gap-6 opacity-40">
//               <span className="text-[10px] font-bold">SECURE SSL</span>
//               <span className="text-[10px] font-bold">EASY RETURNS</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;


import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getCurrentUser, getProfile } from "../../../api/authApi";
import { getCart, clearCart } from "../../../api/cartApi";
import { createOrder, markOrderPaymentFailed } from "../../../api/orderApi";
import { startPaymentFlow } from "../../../api/paymentApi";
import "./Checkout.css";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  paymentMethod: "razorpay",
};

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const placingOrderRef = useRef(false);
  const navigate = useNavigate();

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' fill='%23e5e7eb'%3E%3Crect width='80' height='80' rx='8'/%3E%3C/svg%3E";

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const user = await getCurrentUser();

        if (!user) {
          setLoadingCart(false);
          return;
        }

        setCurrentUser(user);

        const userProfile = await getProfile();
        setProfile(userProfile);

        const fullName =
          userProfile?.full_name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "";

        setFormData((prev) => ({
          ...prev,
          firstName: fullName?.split(" ")[0] || "",
          lastName: fullName?.split(" ").slice(1).join(" ") || "",
          email: userProfile?.email || user.email || "",
          phone: userProfile?.phone || "",
        }));

        const items = await getCart();
        setCartItems(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error("Checkout load error:", error);
        toast.error("Failed to load checkout");
      } finally {
        setLoadingCart(false);
      }
    };

    loadCheckoutData();
  }, []);

  const getProduct = (item) => {
    return item.products || item.product || {};
  };

  const getProductName = (item) => {
    const product = getProduct(item);
    return item.productName || item.product_name || product.name || "Product";
  };

  const getProductImage = (item) => {
    const product = getProduct(item);

    return (
      item.productImage ||
      item.product_image ||
      product.product_images?.find((image) => image.is_primary)?.image_url ||
      product.product_images?.[0]?.image_url ||
      product.images?.[0]?.image_url ||
      fallbackImage
    );
  };

  const getProductPrice = (item) => {
    const product = getProduct(item);

    return Number(
      item.productPrice ||
        item.product_price ||
        product.discount_price ||
        product.price ||
        item.price ||
        0
    );
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + getProductPrice(item) * Number(item.quantity || 1);
    }, 0);
  }, [cartItems]);

  const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildShippingAddress = () => {
    return {
      full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
    };
  };

  const validateCheckout = () => {
    if (!currentUser) {
      toast.error("Please login first");
      navigate("/login");
      return false;
    }

    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return false;
    }

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    if (requiredFields.some((field) => !String(formData[field] || "").trim())) {
      toast.error("Please complete all shipping fields");
      return false;
    }

    return true;
  };

  const markPaymentFailedSafely = async ({ createdOrder, error }) => {
    if (!createdOrder?.id) {
      return;
    }

    try {
      await markOrderPaymentFailed({
        orderId: createdOrder.id,
        paymentId: null,
        amount: Number(createdOrder.total_amount || total),
        provider: "razorpay",
        rawResponse: {
          reason: error?.message || "Payment popup closed by user",
        },
      });
    } catch (failError) {
      console.error("Mark payment failed error:", failError);
    }
  };

  const handlePlaceOrder = async () => {
    if (placingOrderRef.current || loading) {
      toast.info("Order is already processing...");
      return;
    }

    if (!validateCheckout()) return;

    placingOrderRef.current = true;
    setLoading(true);

    const shippingAddress = buildShippingAddress();

    try {
      const orderResponse = await createOrder({
        items: cartItems,
        address: shippingAddress,
        totalAmount: total,
        paymentMethod: formData.paymentMethod,
        notes: "",
      });

      const createdOrder = orderResponse?.order;

      if (!createdOrder?.id) {
        throw new Error("Order created but order ID missing");
      }

      if (formData.paymentMethod === "cod") {
        await clearCart();
        setCartItems([]);

        toast.success(`Order placed! ID: ${createdOrder.id}`);

        navigate(`/order-confirmation/${createdOrder.id}`, {
          replace: true,
          state: {
            order: createdOrder,
            orderItems: orderResponse.orderItems,
          },
        });

        return;
      }

      await startPaymentFlow({
        order: createdOrder,
        user: {
          ...currentUser,
          ...profile,
          name: shippingAddress.full_name,
          full_name: shippingAddress.full_name,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
        },
        onSuccess: async () => {
          try {
            await clearCart();
            setCartItems([]);
          } catch (cartError) {
            console.error("Clear cart after payment error:", cartError);
          }

          toast.success(`Order confirmed! ID: ${createdOrder.id}`);

          navigate(`/order-confirmation/${createdOrder.id}`, {
            replace: true,
            state: {
              order: createdOrder,
              orderItems: orderResponse.orderItems,
            },
          });
        },
        onFailure: async (error) => {
          await markPaymentFailedSafely({
            createdOrder,
            error,
          });

          toast.error(
            error?.message === "Payment popup closed by user"
              ? "Payment cancelled. Order marked as payment failed."
              : error?.message || "Payment failed."
          );
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);

      if (error?.code === "PGRST303" || error?.message?.includes("JWT expired")) {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
      } else {
        toast.error(error?.message || "Order failed. Please try again.");
      }
    } finally {
      placingOrderRef.current = false;
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all placeholder:text-gray-400 text-gray-800 text-sm";

  const labelClass =
    "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1";

  const bubbleButtonClass =
    "bg-gradient-to-b from-gray-500 to-gray-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3),_0px_4px_8px_rgba(0,0,0,0.4)] ring-1 ring-gray-600 text-white transition-all hover:from-gray-400 hover:to-gray-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const glassPanelClass =
    "bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-6 lg:p-8";

  if (loadingCart) {
    return (
      <div className="min-h-screen bg-[#d9e8f5] flex items-center justify-center text-gray-600">
        Loading checkout...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d9e8f5] via-[#e2ebf4] to-[#f4f7fa] font-sans pt-28 pb-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold text-xs uppercase tracking-widest mb-4 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              Review Cart
            </button>

            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 leading-none">
              Checkout
            </h1>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
            <span className="text-gray-900 border-b-2 border-gray-900 pb-1">Shipping</span>
            <span>➔</span>
            <span>Payment</span>
            <span>➔</span>
            <span>Success</span>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8 w-full">
            <div className={glassPanelClass}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Shipping Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="John"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className={labelClass}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Doe"
                    disabled={loading}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="john@example.com"
                    disabled={loading}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="+91 00000 00000"
                    disabled={loading}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Street Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className={`${inputClass} resize-none`}
                    placeholder="House No, Building, Street..."
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={inputClass}
                    disabled={loading}
                  />
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={inputClass}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>PIN</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={inputClass}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={glassPanelClass}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex flex-col p-5 rounded-3xl border-2 transition-all cursor-pointer hover:bg-white/40 ${formData.paymentMethod === "card" ? "border-gray-900 bg-white/60 shadow-lg" : "border-transparent bg-white/20"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleInputChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <span className="font-bold text-gray-900">Credit / Debit Card</span>
                  <span className="text-xs text-gray-500 mt-1">Secure Payment via Razorpay</span>
                </label>

                <label className={`relative flex flex-col p-5 rounded-3xl border-2 transition-all cursor-pointer hover:bg-white/40 ${formData.paymentMethod === "razorpay" ? "border-gray-900 bg-white/60 shadow-lg" : "border-transparent bg-white/20"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={formData.paymentMethod === "razorpay"}
                    onChange={handleInputChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <span className="font-bold text-gray-900">Wallets & Netbanking</span>
                  <span className="text-xs text-gray-500 mt-1">Secure Pay via Razorpay</span>
                </label>

                <label className={`relative flex flex-col p-5 rounded-3xl border-2 transition-all cursor-pointer hover:bg-white/40 ${formData.paymentMethod === "upi" ? "border-gray-900 bg-white/60 shadow-lg" : "border-transparent bg-white/20"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === "upi"}
                    onChange={handleInputChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <span className="font-bold text-gray-900">Direct UPI / QR</span>
                  <span className="text-xs text-gray-500 mt-1">Pay using UPI</span>
                </label>

                <label className={`relative flex flex-col p-5 rounded-3xl border-2 transition-all cursor-pointer hover:bg-white/40 ${formData.paymentMethod === "cod" ? "border-gray-900 bg-white/60 shadow-lg" : "border-transparent bg-white/20"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <span className="font-bold text-gray-900">Cash on Delivery</span>
                  <span className="text-xs text-gray-500 mt-1">Pay at your doorstep</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 w-full sticky top-28">
            <div className={`${glassPanelClass} !p-0 overflow-hidden`}>
              <div className="p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => {
                    const productName = getProductName(item);
                    const productImage = getProductImage(item);
                    const productPrice = getProductPrice(item);

                    return (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="w-20 h-20 bg-white/60 rounded-2xl flex items-center justify-center p-2 border border-white/80 shadow-sm shrink-0">
                          <img
                            src={productImage}
                            alt={productName}
                            className="w-full h-full object-contain mix-blend-multiply"
                            onError={(event) => {
                              event.target.onerror = null;
                              event.target.src = fallbackImage;
                            }}
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                            {productName}
                          </h4>

                          <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-tighter">
                            Qty {item.quantity}
                          </p>

                          <p className="font-bold text-gray-900 mt-1">
                            ₹{(productPrice * Number(item.quantity || 1)).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-black/5 p-8 space-y-4">
                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase text-gray-400">
                      Total Payable
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Includes all taxes
                    </span>
                  </div>

                  <span className="text-3xl font-black text-gray-900 tracking-tight">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading || loadingCart || !cartItems.length}
                  className={`w-full mt-6 py-5 rounded-3xl font-black uppercase tracking-widest text-sm ${bubbleButtonClass}`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    "Complete Purchase"
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 opacity-40">
              <span className="text-[10px] font-bold">SECURE SSL</span>
              <span className="text-[10px] font-bold">EASY RETURNS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;