import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../pages/ProtectedRoute.jsx";

const Home = lazy(() => import("../pages/user/Home/Home.jsx"));
const Register = lazy(() => import("../pages/user/Register/RegisterForm.jsx"));
const Login = lazy(() => import("../pages/user/Login/LoginForm.jsx"));
const Terms = lazy(() => import("../pages/user/Terms/Terms.jsx"));
const Apple = lazy(() => import("../pages/user/Apple/Apple.jsx"));
const Laptop = lazy(() => import("../pages/user/Laptop/Laptop.jsx"));
const Profile = lazy(() => import("../pages/user/Profile/Profile.jsx"));
const ProductPage = lazy(() => import("../pages/user/Product/Product.jsx"));
const StorePage = lazy(() => import("../pages/user/Store/Store.jsx"));
const CartPage = lazy(() => import("../pages/user/Cart/Cart.jsx"));
const Chatbot = lazy(() => import("../pages/user/Chatbot/Chatbot.jsx"));

const AccessoriesPage = lazy(() =>
  import("../pages/user/Accessories/Accessories.jsx")
);

const EchooSupport = lazy(() =>
  import("../pages/user/Support/Support.jsx")
);

const UserLayout = lazy(() =>
  import("../pages/user/UserLayout/UserLayout.jsx")
);

const CheckoutPage = lazy(() =>
  import("../components/order/Checkout/Checkout.jsx")
);

const OrderConfirmation = lazy(() =>
  import("../components/order/OrderConfirmation/OrderConfirmation.jsx")
);

const ForgotPassword = lazy(() =>
  import("../components/auth/ForgotPassword/ForgotPassword.jsx")
);

const ResetPassword = lazy(() =>
  import("../components/auth/ResetPassword/ResetPassword.jsx")
);

const AdminLogin = lazy(() =>
  import("../pages/admin/AdminLogin/AdminLogin.jsx")
);

const AdminLayout = lazy(() =>
  import("../pages/admin/AdminLayout/AdminLayout.jsx")
);

const AdminDashboard = lazy(() =>
  import("../pages/admin/Dashboard/AdminDashboard.jsx")
);

const AdminUsers = lazy(() =>
  import("../pages/admin/AdminUsers/AdminUsers.jsx")
);

const AdminProducts = lazy(() =>
  import("../pages/admin/AdminProducts/AdminProducts.jsx")
);

const AdminOrders = lazy(() =>
  import("../pages/admin/AdminOrders/AdminOrder.jsx")
);

const RouteLoader = () => {
  return (
    <div className="route-loader">
      <div className="route-loader-box">
        <div className="route-loader-spinner"></div>
        <span>Loading page...</span>
      </div>
    </div>
  );
};

const AppRouter = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="/sign_up" element={<Register />} />
        <Route path="/sign_in" element={<Login />} />
        <Route path="/admin_login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms_conditions" element={<Terms />} />

        {/* AI Chat public routes */}
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/ai-chat" element={<Chatbot />} />
        <Route path="/chat" element={<Chatbot />} />

        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="store" element={<StorePage />} />
          <Route path="apple" element={<Apple />} />
          <Route path="lap" element={<Laptop />} />
          <Route path="laptop" element={<Laptop />} />

          <Route
            path="profile"
            element={
              <ProtectedRoute requiredRole="User">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile/overview"
            element={
              <ProtectedRoute requiredRole="User">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile/orders"
            element={
              <ProtectedRoute requiredRole="User">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile/wishlist"
            element={
              <ProtectedRoute requiredRole="User">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile/cart"
            element={
              <ProtectedRoute requiredRole="User">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />

          <Route
            path="checkout"
            element={
              <ProtectedRoute requiredRole="User">
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="order-confirmation/:orderId"
            element={
              <ProtectedRoute requiredRole="User">
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />

          <Route path="accessories" element={<AccessoriesPage />} />
          <Route path="support" element={<EchooSupport />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;