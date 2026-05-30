// import React from "react";
// import { BrowserRouter } from "react-router-dom";
// import { ToastContainer } from "react-toastify";

// import AppRouter from "./app/router";
// import Navbar from "./components/layout/Navbar/Navbar";

// import "./index.css";
// import "./styles/toast.css";

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="bg-white">
//         <Navbar />

//         <AppRouter />

//         <ToastContainer
//           position="top-right"
//           autoClose={1500}
//           hideProgressBar={true}
//           newestOnTop
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="light"
//           style={{ zIndex: 9999 }}
//         />
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AppRouter from "./app/router";
import Navbar from "./components/layout/Navbar/Navbar";

import "./index.css";
import "./styles/toast.css";

const AppContent = () => {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/sign_in",
    "/sign_up",
    "/admin_login",
    "/forgot-password",
    "/reset-password",
  ];

  const isAdminPage = location.pathname.startsWith("/admin");

  const shouldHideNavbar =
    isAdminPage || hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="bg-white">
      {!shouldHideNavbar && <Navbar />}

      <AppRouter />

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;