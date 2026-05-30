// import axios from "axios";
// import { supabase } from "./supabaseClient";

// /*
//   axiosClient.js

//   Purpose:
//   - This file is used only for custom backend/server APIs.
//   - Supabase database/auth calls will NOT use axios.
//   - Payment, RAG chatbot, webhooks, secure admin actions can use this client.

//   Example:
//   client React app
//       ↓
//   axiosClient
//       ↓
//   server Express API
//       ↓
//   Supabase / Razorpay / RAG backend
// */

// const getBaseUrl = () => {
//   const baseUrl = import.meta.env.VITE_API_BASE_URL;

//   if (!baseUrl) {
//     return "http://localhost:5000/api";
//   }

//   return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
// };

// const axiosClient = axios.create({
//   baseURL: getBaseUrl(),
//   timeout: 30000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// /*
//   Request Interceptor

//   Before every request:
//   - Get current Supabase session
//   - Attach Supabase access token in Authorization header
//   - Server can verify this token later
// */

// axiosClient.interceptors.request.use(
//   async (config) => {
//     try {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       const token = session?.access_token;

//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }

//       return config;
//     } catch (error) {
//       console.error("Axios request interceptor error:", error);
//       return config;
//     }
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// /*
//   Response Interceptor

//   Handles common API errors globally:
//   - 401 means user token expired/invalid
//   - 403 means user is not allowed
//   - 500 means server error
// */

// axiosClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const status = error?.response?.status;

//     if (status === 401) {
//       window.dispatchEvent(new CustomEvent("auth:logout"));
//     }

//     if (status === 403) {
//       console.error("Access denied. You do not have permission.");
//     }

//     if (status >= 500) {
//       console.error("Server error. Please try again later.");
//     }

//     return Promise.reject(error);
//   }
// );

// /*
//   Helper functions

//   These make API calls cleaner in other files.

//   Example:
//   import { apiGet, apiPost } from "./axiosClient";

//   const data = await apiGet("/payments/status");
// */

// export const apiGet = async (url, config = {}) => {
//   const response = await axiosClient.get(url, config);
//   return response.data;
// };

// export const apiPost = async (url, data = {}, config = {}) => {
//   const response = await axiosClient.post(url, data, config);
//   return response.data;
// };

// export const apiPut = async (url, data = {}, config = {}) => {
//   const response = await axiosClient.put(url, data, config);
//   return response.data;
// };

// export const apiPatch = async (url, data = {}, config = {}) => {
//   const response = await axiosClient.patch(url, data, config);
//   return response.data;
// };

// export const apiDelete = async (url, config = {}) => {
//   const response = await axiosClient.delete(url, config);
//   return response.data;
// };

// export default axiosClient;


import axios from "axios";
import { supabase } from "./supabaseClient";

/*
  axiosClient.js

  Purpose:
  - This file is used only for custom backend/server APIs.
  - Supabase database/auth calls will NOT use axios.
  - Payment APIs use this client.

  Local:
  - Frontend: http://localhost:5173
  - Server: http://localhost:5000/api

  Production Render:
  - Frontend + server run on same domain/port
  - API base becomes /api
*/

const getBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (baseUrl && String(baseUrl).trim()) {
    return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  }

  /*
    In production Render:
    same domain serves frontend + backend.
    So API calls should go to:
    https://your-render-url.onrender.com/api
  */
  if (import.meta.env.PROD) {
    return "/api";
  }

  /*
    Local development:
    Vite frontend runs on 5173.
    Express payment server runs on 5000.
  */
  return "http://localhost:5000/api";
};

const axiosClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
  Request Interceptor

  Before every request:
  - Get current Supabase session
  - Attach Supabase access token in Authorization header
  - Server can verify this token later
*/

axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error("Axios request interceptor error:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
  Response Interceptor

  Handles common API errors globally:
  - 401 means user token expired/invalid
  - 403 means user is not allowed
  - 500 means server error
*/

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }

    if (status === 403) {
      console.error("Access denied. You do not have permission.");
    }

    if (status >= 500) {
      console.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

/*
  Helper functions

  Example:
  apiPost("/payments/create-order", data)
  becomes:
  Local: http://localhost:5000/api/payments/create-order
  Render: /api/payments/create-order
*/

export const apiGet = async (url, config = {}) => {
  const response = await axiosClient.get(url, config);
  return response.data;
};

export const apiPost = async (url, data = {}, config = {}) => {
  const response = await axiosClient.post(url, data, config);
  return response.data;
};

export const apiPut = async (url, data = {}, config = {}) => {
  const response = await axiosClient.put(url, data, config);
  return response.data;
};

export const apiPatch = async (url, data = {}, config = {}) => {
  const response = await axiosClient.patch(url, data, config);
  return response.data;
};

export const apiDelete = async (url, config = {}) => {
  const response = await axiosClient.delete(url, config);
  return response.data;
};

export default axiosClient;