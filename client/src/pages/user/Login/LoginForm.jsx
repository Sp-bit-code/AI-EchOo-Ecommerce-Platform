// import { ArrowUpRightIcon, EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";

// import { login as apiLogin, googleLogin as apiGoogleLogin, getProfile } from "../../../api/authApi";
// import { useAuth } from "../../../context/AuthContext.jsx";

// import "./LoginForm.css";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     rememberMe: false,
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const { refreshUser } = useAuth();

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const savedEmail = localStorage.getItem("rememberedEmail");

//     if (savedEmail) {
//       setFormData((prev) => ({
//         ...prev,
//         email: savedEmail,
//         rememberMe: true,
//       }));
//     }
//   }, []);

//   const handleChange = (event) => {
//     const { name, value, type, checked } = event.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       setLoading(true);
//       await apiGoogleLogin();
//     } catch (error) {
//       toast.error(error.message || "Google login failed.");
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!formData.email || !formData.password) {
//       toast.error("Please enter email and password.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const result = await apiLogin({
//         email: formData.email,
//         password: formData.password,
//       });

//       console.log("LOGIN RESULT:", result);
//       console.log("SAVED SESSION:", localStorage.getItem("echoo_session"));
//       console.log("SAVED TOKEN:", localStorage.getItem("echoo_access_token"));

//       if (formData.rememberMe) {
//         localStorage.setItem("rememberedEmail", formData.email);
//       } else {
//         localStorage.removeItem("rememberedEmail");
//       }

//       let profile = null;

//       try {
//         profile = await getProfile();
//       } catch (profileError) {
//         console.warn("Profile fetch after login failed:", profileError);
//       }

//       if (refreshUser) {
//         await refreshUser();
//       }

//       toast.success("Welcome back!", {
//         style: { width: "360px" },
//       });

//       const redirectTo = location.state?.from?.pathname;

//       if (redirectTo) {
//         navigate(redirectTo, { replace: true });
//         return;
//       }

//       const role = profile?.role || result?.user?.user_metadata?.role || "User";

//       navigate(role === "Admin" ? "/admin" : "/", { replace: true });
//     } catch (error) {
//       console.error("LOGIN ERROR:", error);
//       toast.error(error.message || "Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-5xl flex flex-col md:flex-row shadow-2xl rounded-[40px] overflow-hidden">
//         <div className="hidden md:flex md:w-1/2 bg-[#1a1a1a] p-12 flex-col justify-between relative overflow-hidden">
//           <div className="z-10">
//             <p className="text-gray-400 text-sm mb-20">
//               Join the EchOo community – start your journey today.
//             </p>

//             <h1 className="text-white text-6xl font-bold leading-tight tracking-tight max-w-xs">
//               Login to <br /> your account
//             </h1>
//           </div>

//           <div className="absolute bottom-0 right-0 w-3/4 translate-y-20 translate-x-10 opacity-40">
//             <div className="w-full aspect-[9/16] bg-gradient-to-tr from-neutral-800 to-neutral-700 rounded-t-[40px] border-t border-l border-neutral-600 shadow-2xl"></div>
//           </div>

//           <div className="z-10 flex items-center gap-2">
//             <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-[10px] text-gray-400">
//               ©
//             </div>
//             <span className="text-gray-500 text-xs">2025-2026 EchOo Inc.</span>
//           </div>
//         </div>

//         <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col relative">
//           <div className="flex justify-between items-center mb-16">
//             <img
//               alt="EchOo."
//               src="/Echoo-transparent.png"
//               className="h-8 w-auto"
//             />

//             <Link
//               to="/sign_up"
//               className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
//             >
//               Sign Up
//               <div className="bg-gray-100 p-1 rounded-full">
//                 <ArrowUpRightIcon className="size-3" />
//               </div>
//             </Link>
//           </div>

//           <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
//             <h2 className="text-4xl font-bold text-gray-900 mb-8">Sign In</h2>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <input
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 placeholder="Email Address"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
//               />

//               <div className="relative">
//                 <input
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="current-password"
//                   required
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((prev) => !prev)}
//                   className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? (
//                     <EyeIcon className="size-5" />
//                   ) : (
//                     <EyeSlashIcon className="size-5" />
//                   )}
//                 </button>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="rememberMe"
//                     checked={formData.rememberMe}
//                     onChange={handleChange}
//                     className="h-4 w-4 accent-black"
//                   />
//                   Remember me
//                 </label>

//                 <Link
//                   to="/forgot-password"
//                   className="text-sm font-medium text-gray-900 hover:underline"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   disabled={!formData.email || !formData.password || loading}
//                   className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-b from-gray-500 to-gray-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3),_0px_4px_8px_rgba(0,0,0,0.4)] ring-1 ring-gray-600 text-white rounded-full text-base font-semibold hover:from-gray-400 hover:to-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <span className="translate-x-3">
//                     {loading ? "Signing in..." : "Sign In"}
//                   </span>

//                   <div className="ml-auto bg-white/20 p-1 rounded-full">
//                     <ArrowUpRightIcon className="size-4" />
//                   </div>
//                 </button>

//                 <div className="relative flex items-center py-2">
//                   <div className="flex-grow border-t border-gray-200"></div>
//                   <span className="flex-shrink mx-4 text-gray-400 text-sm font-light">
//                     Or login with
//                   </span>
//                   <div className="flex-grow border-t border-gray-200"></div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={handleGoogleLogin}
//                   disabled={loading}
//                   className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-gray-200 rounded-full text-gray-700 font-semibold text-sm shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Google
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import {
  ArrowUpRightIcon,
  EyeSlashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import {
  login as apiLogin,
  googleLogin as apiGoogleLogin,
  getProfile,
} from "../../../api/authApi";

import { useAuth } from "../../../context/AuthContext.jsx";

import "./LoginForm.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { refreshUser } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");

    if (savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        rememberMe: true,
      }));
    }
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const clearLocalAuth = () => {
    localStorage.removeItem("echoo_session");
    localStorage.removeItem("echoo_access_token");
    localStorage.removeItem("echoo_refresh_token");
    sessionStorage.clear();
    window.dispatchEvent(new CustomEvent("auth:logout"));
  };

  const setUserMode = () => {
    localStorage.setItem("echoo_login_mode", "user");
    window.dispatchEvent(new CustomEvent("auth:mode-change"));
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      clearLocalAuth();
      setUserMode();

      await apiGoogleLogin();
    } catch (error) {
      toast.error(error.message || "Google login failed.");
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      clearLocalAuth();
      setUserMode();

      await apiLogin({
        email: formData.email,
        password: formData.password,
      });

      try {
        await getProfile();
      } catch (profileError) {
        console.warn("Profile fetch after login failed:", profileError);
      }

      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      if (refreshUser) {
        await refreshUser();
      }

      toast.success("Welcome back!", {
        style: { width: "360px" },
      });

      const redirectTo = location.state?.from?.pathname;

      if (redirectTo && !redirectTo.startsWith("/admin")) {
        navigate(redirectTo, { replace: true });
        return;
      }

      navigate("/", { replace: true });
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      toast.error(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl flex flex-col md:flex-row shadow-2xl rounded-[40px] overflow-hidden">
        <div className="hidden md:flex md:w-1/2 bg-[#1a1a1a] p-12 flex-col justify-between relative overflow-hidden">
          <div className="z-10">
            <p className="text-gray-400 text-sm mb-20">
              Join the EchOo community – start your journey today.
            </p>

            <h1 className="text-white text-6xl font-bold leading-tight tracking-tight max-w-xs">
              Login to <br /> your account
            </h1>
          </div>

          <div className="absolute bottom-0 right-0 w-3/4 translate-y-20 translate-x-10 opacity-40">
            <div className="w-full aspect-[9/16] bg-gradient-to-tr from-neutral-800 to-neutral-700 rounded-t-[40px] border-t border-l border-neutral-600 shadow-2xl"></div>
          </div>

          <div className="z-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-[10px] text-gray-400">
              ©
            </div>
            <span className="text-gray-500 text-xs">2025-2026 EchOo Inc.</span>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col relative">
          <div className="flex justify-between items-center mb-16">
            <img
              alt="EchOo."
              src="/Echoo-transparent.png"
              className="h-8 w-auto"
            />

            <Link
              to="/sign_up"
              className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Sign Up
              <div className="bg-gray-100 p-1 rounded-full">
                <ArrowUpRightIcon className="size-3" />
              </div>
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Sign In</h2>

            <p className="text-sm text-gray-500 mb-8">
              Login as a customer. Admin dashboard access is available from Admin Login.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
              />

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeIcon className="size-5" />
                  ) : (
                    <EyeSlashIcon className="size-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 accent-black"
                  />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-gray-900 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!formData.email || !formData.password || loading}
                  className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-b from-gray-500 to-gray-800 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3),_0px_4px_8px_rgba(0,0,0,0.4)] ring-1 ring-gray-600 text-white rounded-full text-base font-semibold hover:from-gray-400 hover:to-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="translate-x-3">
                    {loading ? "Signing in..." : "Sign In"}
                  </span>

                  <div className="ml-auto bg-white/20 p-1 rounded-full">
                    <ArrowUpRightIcon className="size-4" />
                  </div>
                </button>

                <Link
                  to="/admin_login"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-full text-gray-800 font-semibold text-sm shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Login as Admin
                  <ArrowUpRightIcon className="size-4" />
                </Link>

                <div className="relative flex items-center py-3">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-sm font-light">
                    Or login with
                  </span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-gray-200 rounded-full text-gray-700 font-semibold text-sm shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Google
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-400 text-center mt-6">
              Admin dashboard opens only when you login through Admin Login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;