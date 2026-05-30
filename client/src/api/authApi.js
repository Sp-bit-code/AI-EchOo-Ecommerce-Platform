// /*
//   authApi.js

//   REST-based auth/profile version:
//   - Email/password login through Supabase Auth REST
//   - Google OAuth redirect support
//   - Saves session in localStorage
//   - Handles user/admin login mode
//   - Uses REST for profiles
// */

// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!SUPABASE_URL) {
//   throw new Error("Missing VITE_SUPABASE_URL");
// }

// if (!SUPABASE_KEY) {
//   throw new Error("Missing VITE_SUPABASE_ANON_KEY");
// }

// /* -------------------------------------------------------------------------- */
// /* Helper: Normalize Role                                                      */
// /* -------------------------------------------------------------------------- */

// const normalizeRole = (role) => {
//   if (!role) return "User";

//   const lowerRole = String(role).trim().toLowerCase();

//   if (lowerRole === "admin") return "Admin";

//   return "User";
// };

// /* -------------------------------------------------------------------------- */
// /* Token Helpers                                                               */
// /* -------------------------------------------------------------------------- */

// const saveSessionToken = (session) => {
//   if (!session) return;

//   localStorage.setItem("echoo_session", JSON.stringify(session));

//   if (session.access_token) {
//     localStorage.setItem("echoo_access_token", session.access_token);
//   }

//   if (session.refresh_token) {
//     localStorage.setItem("echoo_refresh_token", session.refresh_token);
//   }
// };

// const removeSessionToken = () => {
//   localStorage.removeItem("echoo_session");
//   localStorage.removeItem("echoo_access_token");
//   localStorage.removeItem("echoo_refresh_token");
// };

// const clearAuthStorage = () => {
//   removeSessionToken();
//   window.dispatchEvent(new CustomEvent("auth:logout"));
// };

// const getSavedSession = () => {
//   try {
//     const raw = localStorage.getItem("echoo_session");
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// };

// const getAccessToken = () => {
//   return localStorage.getItem("echoo_access_token") || SUPABASE_KEY;
// };

// /* -------------------------------------------------------------------------- */
// /* REST Helpers                                                                */
// /* -------------------------------------------------------------------------- */

// const authFetch = async (path, options = {}) => {
//   const token = getAccessToken();

//   const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
//     method: options.method || "GET",
//     headers: {
//       apikey: SUPABASE_KEY,
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//     body: options.body ? JSON.stringify(options.body) : undefined,
//   });

//   const text = await response.text();

//   if (!response.ok) {
//     console.error("Auth REST error:", response.status, text);
//     throw new Error(text || "Auth request failed");
//   }

//   return text ? JSON.parse(text) : null;
// };

// const dbFetch = async (path, options = {}) => {
//   const token = getAccessToken();

//   const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
//     method: options.method || "GET",
//     headers: {
//       apikey: SUPABASE_KEY,
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//       Prefer: options.prefer || "return=representation",
//       ...(options.headers || {}),
//     },
//     body: options.body ? JSON.stringify(options.body) : undefined,
//   });

//   const text = await response.text();

//   if (!response.ok) {
//     console.error("DB REST error:", response.status, text);
//     throw new Error(text || "Database request failed");
//   }

//   return text ? JSON.parse(text) : null;
// };

// const dbFetchWithToken = async (path, token, options = {}) => {
//   const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
//     method: options.method || "GET",
//     headers: {
//       apikey: SUPABASE_KEY,
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//       Prefer: options.prefer || "return=representation",
//       ...(options.headers || {}),
//     },
//     body: options.body ? JSON.stringify(options.body) : undefined,
//   });

//   const text = await response.text();

//   if (!response.ok) {
//     console.error("DB token REST error:", response.status, text);
//     throw new Error(text || "Database request failed");
//   }

//   return text ? JSON.parse(text) : null;
// };

// /* -------------------------------------------------------------------------- */
// /* Helper: Profile By OAuth Token                                              */
// /* -------------------------------------------------------------------------- */

// const getOrCreateProfileWithToken = async (user, token) => {
//   if (!user?.id) return null;

//   const data = await dbFetchWithToken(
//     `profiles?select=*&id=eq.${encodeURIComponent(user.id)}&limit=1`,
//     token
//   );

//   if (data?.[0]) {
//     return data[0];
//   }

//   const newProfile = {
//     id: user.id,
//     email: user.email,
//     full_name:
//       user.user_metadata?.full_name ||
//       user.user_metadata?.name ||
//       "",
//     phone: user.user_metadata?.phone || "",
//     role: normalizeRole(user.user_metadata?.role),
//     avatar_url: user.user_metadata?.avatar_url || null,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//   };

//   const created = await dbFetchWithToken("profiles", token, {
//     method: "POST",
//     body: [newProfile],
//   });

//   return created?.[0] || newProfile;
// };

// /* -------------------------------------------------------------------------- */
// /* Handle Google OAuth Redirect                                                */
// /* -------------------------------------------------------------------------- */

// export const handleOAuthRedirect = async () => {
//   const hash = window.location.hash;

//   if (!hash || !hash.includes("access_token")) {
//     return null;
//   }

//   const params = new URLSearchParams(hash.replace("#", ""));

//   const accessToken = params.get("access_token");
//   const refreshToken = params.get("refresh_token");
//   const expiresIn = params.get("expires_in");
//   const tokenType = params.get("token_type");

//   if (!accessToken) {
//     return null;
//   }

//   const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
//     method: "GET",
//     headers: {
//       apikey: SUPABASE_KEY,
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//   });

//   const userText = await userResponse.text();

//   if (!userResponse.ok) {
//     console.error("OAuth user fetch error:", userResponse.status, userText);
//     return null;
//   }

//   const user = userText ? JSON.parse(userText) : null;

//   const session = {
//     access_token: accessToken,
//     refresh_token: refreshToken,
//     expires_in: expiresIn,
//     token_type: tokenType || "bearer",
//     user,
//   };

//   saveSessionToken(session);

//   const profile = await getOrCreateProfileWithToken(user, accessToken);
//   const role = normalizeRole(profile?.role || user?.user_metadata?.role);
//   const loginMode = localStorage.getItem("echoo_login_mode") || "user";

//   window.history.replaceState({}, document.title, window.location.pathname);

//   /*
//     Admin login mode:
//     - Only real Admin can enter dashboard
//     - Normal user blocked and sent to user login
//   */
//   if (loginMode === "admin") {
//     if (role !== "Admin") {
//       clearAuthStorage();
//       localStorage.removeItem("echoo_login_mode");
//       window.location.replace("/sign_in");
//       return null;
//     }

//     localStorage.setItem("echoo_login_mode", "admin");
//     window.location.replace("/admin/dashboard");
//     return session;
//   }

//   /*
//     User login mode:
//     - Everyone behaves like normal user
//     - Even Admin account goes to normal website
//   */
//   localStorage.setItem("echoo_login_mode", "user");
//   window.location.replace("/");
//   return session;
// };

// /* -------------------------------------------------------------------------- */
// /* Register User                                                               */
// /* -------------------------------------------------------------------------- */

// export const register = async ({
//   email,
//   password,
//   fullName = "",
//   phone = "",
//   role = "User",
// }) => {
//   if (!email || !password) {
//     throw new Error("Email and password are required");
//   }

//   localStorage.setItem("echoo_login_mode", "user");

//   const data = await authFetch("signup", {
//     method: "POST",
//     body: {
//       email,
//       password,
//       data: {
//         full_name: fullName,
//         phone,
//         role: normalizeRole(role),
//       },
//     },
//   });

//   const user = data?.user;

//   if (data?.access_token) {
//     saveSessionToken(data);
//   }

//   if (user?.id) {
//     await dbFetch("profiles", {
//       method: "POST",
//       prefer: "resolution=merge-duplicates,return=representation",
//       body: [
//         {
//           id: user.id,
//           email,
//           full_name: fullName,
//           phone,
//           role: normalizeRole(role),
//           avatar_url: user.user_metadata?.avatar_url || null,
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//         },
//       ],
//     });
//   }

//   return data;
// };

// /* -------------------------------------------------------------------------- */
// /* Login User                                                                  */
// /* -------------------------------------------------------------------------- */

// export const login = async ({ email, password }) => {
//   if (!email || !password) {
//     throw new Error("Email and password are required");
//   }

//   const data = await authFetch("token?grant_type=password", {
//     method: "POST",
//     body: {
//       email,
//       password,
//     },
//   });

//   saveSessionToken(data);

//   return {
//     session: data,
//     user: data?.user,
//   };
// };

// /* -------------------------------------------------------------------------- */
// /* Google Login                                                                */
// /* -------------------------------------------------------------------------- */

// export const googleLogin = async () => {
//   const redirectTo = encodeURIComponent(window.location.origin);

//   window.location.href =
//     `${SUPABASE_URL}/auth/v1/authorize` +
//     `?provider=google` +
//     `&redirect_to=${redirectTo}`;

//   return true;
// };

// /* -------------------------------------------------------------------------- */
// /* Logout User                                                                 */
// /* -------------------------------------------------------------------------- */

// export const logout = async () => {
//   try {
//     await authFetch("logout", {
//       method: "POST",
//       body: {},
//     });
//   } catch (error) {
//     console.warn("Logout REST error ignored:", error);
//   }

//   removeSessionToken();
//   localStorage.removeItem("echoo_login_mode");

//   window.dispatchEvent(new CustomEvent("auth:logout"));

//   return true;
// };

// /* -------------------------------------------------------------------------- */
// /* Forgot Password                                                             */
// /* -------------------------------------------------------------------------- */

// export const forgotPassword = async (email) => {
//   if (!email) {
//     throw new Error("Email is required");
//   }

//   return authFetch("recover", {
//     method: "POST",
//     body: {
//       email,
//       redirect_to: `${window.location.origin}/reset-password`,
//     },
//   });
// };

// /* -------------------------------------------------------------------------- */
// /* Reset Password                                                              */
// /* -------------------------------------------------------------------------- */

// export const resetPassword = async ({ password }) => {
//   if (!password) {
//     throw new Error("New password is required");
//   }

//   return authFetch("user", {
//     method: "PUT",
//     body: {
//       password,
//     },
//   });
// };

// /* -------------------------------------------------------------------------- */
// /* Get Current Session                                                         */
// /* -------------------------------------------------------------------------- */

// export const getCurrentSession = async () => {
//   await handleOAuthRedirect();

//   const session = getSavedSession();

//   if (!session?.access_token) {
//     return null;
//   }

//   return session;
// };

// /* -------------------------------------------------------------------------- */
// /* Get Current User                                                            */
// /* -------------------------------------------------------------------------- */

// export const getCurrentUser = async () => {
//   await handleOAuthRedirect();

//   const session = getSavedSession();

//   if (session?.user) {
//     return session.user;
//   }

//   const token = localStorage.getItem("echoo_access_token");

//   if (!token) {
//     return null;
//   }

//   try {
//     const user = await authFetch("user");
//     return user || null;
//   } catch {
//     return null;
//   }
// };

// /* -------------------------------------------------------------------------- */
// /* Get Profile                                                                 */
// /* -------------------------------------------------------------------------- */

// export const getProfile = async () => {
//   const user = await getCurrentUser();

//   if (!user) {
//     return null;
//   }

//   const data = await dbFetch(
//     `profiles?select=*&id=eq.${encodeURIComponent(user.id)}&limit=1`
//   );

//   if (data?.[0]) {
//     return data[0];
//   }

//   const newProfile = {
//     id: user.id,
//     email: user.email,
//     full_name:
//       user.user_metadata?.full_name ||
//       user.user_metadata?.name ||
//       "",
//     phone: user.user_metadata?.phone || "",
//     role: normalizeRole(user.user_metadata?.role),
//     avatar_url: user.user_metadata?.avatar_url || null,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//   };

//   const created = await dbFetch("profiles", {
//     method: "POST",
//     body: [newProfile],
//   });

//   return created?.[0] || newProfile;
// };

// /* -------------------------------------------------------------------------- */
// /* Update Profile                                                              */
// /* -------------------------------------------------------------------------- */

// export const updateProfile = async ({
//   fullName,
//   phone,
//   avatarUrl,
//   address,
// }) => {
//   const user = await getCurrentUser();

//   if (!user) {
//     throw new Error("User not logged in");
//   }

//   const updateData = {
//     updated_at: new Date().toISOString(),
//   };

//   if (fullName !== undefined) updateData.full_name = fullName;
//   if (phone !== undefined) updateData.phone = phone;
//   if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;
//   if (address !== undefined) updateData.address = address;

//   const data = await dbFetch(`profiles?id=eq.${encodeURIComponent(user.id)}`, {
//     method: "PATCH",
//     body: updateData,
//   });

//   return data?.[0] || null;
// };

// /* -------------------------------------------------------------------------- */
// /* Check If User Is Logged In                                                  */
// /* -------------------------------------------------------------------------- */

// export const isLoggedIn = async () => {
//   const session = await getCurrentSession();
//   return Boolean(session?.access_token);
// };

// /* -------------------------------------------------------------------------- */
// /* Check User Role                                                             */
// /* -------------------------------------------------------------------------- */

// export const getUserRole = async () => {
//   const profile = await getProfile();

//   if (!profile) {
//     return null;
//   }

//   return normalizeRole(profile.role);
// };

// export const isAdmin = async () => {
//   const role = await getUserRole();
//   const mode = localStorage.getItem("echoo_login_mode");

//   return mode === "admin" && role === "Admin";
// };

// export const isUser = async () => {
//   const mode = localStorage.getItem("echoo_login_mode");

//   return mode !== "admin";
// };

// /* -------------------------------------------------------------------------- */
// /* Listen To Auth Changes                                                      */
// /* -------------------------------------------------------------------------- */

// export const onAuthStateChange = (callback) => {
//   const handler = async () => {
//     await handleOAuthRedirect();

//     const session = getSavedSession();

//     if (session?.access_token) {
//       callback("SIGNED_IN", session);
//     } else {
//       callback("SIGNED_OUT", null);
//     }
//   };

//   window.addEventListener("storage", handler);
//   window.addEventListener("auth:logout", handler);
//   window.addEventListener("auth:mode-change", handler);

//   setTimeout(handler, 0);

//   return {
//     unsubscribe: () => {
//       window.removeEventListener("storage", handler);
//       window.removeEventListener("auth:logout", handler);
//       window.removeEventListener("auth:mode-change", handler);
//     },
//   };
// };

/*
  authApi.js

  REST-based auth/profile version:
  - Email/password login through Supabase Auth REST
  - Google OAuth redirect support
  - Saves session in localStorage
  - Handles user/admin login mode
  - Uses REST for profiles

  Fixed:
  - getCurrentUser always fetches fresh user from access token
  - Prevents old echoo_session.user mismatch
  - Fixes checkout RLS issue where orders.user_id != auth.uid()
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
/* Helper: Normalize Role                                                      */
/* -------------------------------------------------------------------------- */

const normalizeRole = (role) => {
  if (!role) return "User";

  const lowerRole = String(role).trim().toLowerCase();

  if (lowerRole === "admin") return "Admin";

  return "User";
};

/* -------------------------------------------------------------------------- */
/* Token Helpers                                                               */
/* -------------------------------------------------------------------------- */

const saveSessionToken = (session) => {
  if (!session) return;

  localStorage.setItem("echoo_session", JSON.stringify(session));

  if (session.access_token) {
    localStorage.setItem("echoo_access_token", session.access_token);
  }

  if (session.refresh_token) {
    localStorage.setItem("echoo_refresh_token", session.refresh_token);
  }
};

const removeSessionToken = () => {
  localStorage.removeItem("echoo_session");
  localStorage.removeItem("echoo_access_token");
  localStorage.removeItem("echoo_refresh_token");
};

const clearAuthStorage = () => {
  removeSessionToken();
  window.dispatchEvent(new CustomEvent("auth:logout"));
};

const getSavedSession = () => {
  try {
    const raw = localStorage.getItem("echoo_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const updateSavedSessionUser = (user) => {
  try {
    const session = getSavedSession();

    if (!session) {
      return;
    }

    const updatedSession = {
      ...session,
      user,
    };

    localStorage.setItem("echoo_session", JSON.stringify(updatedSession));
  } catch (error) {
    console.warn("Failed to update saved session user:", error);
  }
};

const getAccessToken = () => {
  return localStorage.getItem("echoo_access_token") || SUPABASE_KEY;
};

/* -------------------------------------------------------------------------- */
/* REST Helpers                                                                */
/* -------------------------------------------------------------------------- */

const authFetch = async (path, options = {}) => {
  const token = getAccessToken();

  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: options.method || "GET",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();

  if (!response.ok) {
    console.error("Auth REST error:", response.status, text);

    const error = new Error(text || "Auth request failed");
    error.status = response.status;
    error.raw = text;

    try {
      const parsed = text ? JSON.parse(text) : null;
      error.code = parsed?.code;
      error.message = parsed?.message || error.message;
    } catch {
      // keep original error
    }

    throw error;
  }

  return text ? JSON.parse(text) : null;
};

const dbFetch = async (path, options = {}) => {
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
    console.error("DB REST error:", response.status, text);

    const error = new Error(text || "Database request failed");
    error.status = response.status;
    error.raw = text;

    try {
      const parsed = text ? JSON.parse(text) : null;
      error.code = parsed?.code;
      error.message = parsed?.message || error.message;
    } catch {
      // keep original error
    }

    throw error;
  }

  return text ? JSON.parse(text) : null;
};

const dbFetchWithToken = async (path, token, options = {}) => {
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
    console.error("DB token REST error:", response.status, text);

    const error = new Error(text || "Database request failed");
    error.status = response.status;
    error.raw = text;

    try {
      const parsed = text ? JSON.parse(text) : null;
      error.code = parsed?.code;
      error.message = parsed?.message || error.message;
    } catch {
      // keep original error
    }

    throw error;
  }

  return text ? JSON.parse(text) : null;
};

/* -------------------------------------------------------------------------- */
/* Helper: Profile By OAuth Token                                              */
/* -------------------------------------------------------------------------- */

const getOrCreateProfileWithToken = async (user, token) => {
  if (!user?.id) return null;

  const data = await dbFetchWithToken(
    `profiles?select=*&id=eq.${encodeURIComponent(user.id)}&limit=1`,
    token
  );

  if (data?.[0]) {
    return data[0];
  }

  const newProfile = {
    id: user.id,
    email: user.email,
    full_name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "",
    phone: user.user_metadata?.phone || "",
    role: normalizeRole(user.user_metadata?.role),
    avatar_url: user.user_metadata?.avatar_url || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const created = await dbFetchWithToken("profiles", token, {
    method: "POST",
    body: [newProfile],
  });

  return created?.[0] || newProfile;
};

/* -------------------------------------------------------------------------- */
/* Handle Google OAuth Redirect                                                */
/* -------------------------------------------------------------------------- */

export const handleOAuthRedirect = async () => {
  const hash = window.location.hash;

  if (!hash || !hash.includes("access_token")) {
    return null;
  }

  const params = new URLSearchParams(hash.replace("#", ""));

  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const expiresIn = params.get("expires_in");
  const tokenType = params.get("token_type");

  if (!accessToken) {
    return null;
  }

  const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: "GET",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const userText = await userResponse.text();

  if (!userResponse.ok) {
    console.error("OAuth user fetch error:", userResponse.status, userText);
    return null;
  }

  const user = userText ? JSON.parse(userText) : null;

  const session = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    token_type: tokenType || "bearer",
    user,
  };

  saveSessionToken(session);

  const profile = await getOrCreateProfileWithToken(user, accessToken);
  const role = normalizeRole(profile?.role || user?.user_metadata?.role);
  const loginMode = localStorage.getItem("echoo_login_mode") || "user";

  window.history.replaceState({}, document.title, window.location.pathname);

  if (loginMode === "admin") {
    if (role !== "Admin") {
      clearAuthStorage();
      localStorage.removeItem("echoo_login_mode");
      window.location.replace("/sign_in");
      return null;
    }

    localStorage.setItem("echoo_login_mode", "admin");
    window.location.replace("/admin/dashboard");
    return session;
  }

  localStorage.setItem("echoo_login_mode", "user");
  window.location.replace("/");
  return session;
};

/* -------------------------------------------------------------------------- */
/* Register User                                                               */
/* -------------------------------------------------------------------------- */

export const register = async ({
  email,
  password,
  fullName = "",
  phone = "",
  role = "User",
}) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  localStorage.setItem("echoo_login_mode", "user");

  const data = await authFetch("signup", {
    method: "POST",
    body: {
      email,
      password,
      data: {
        full_name: fullName,
        phone,
        role: normalizeRole(role),
      },
    },
  });

  const user = data?.user;

  if (data?.access_token) {
    saveSessionToken(data);
  }

  if (user?.id) {
    await dbFetch("profiles", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: [
        {
          id: user.id,
          email,
          full_name: fullName,
          phone,
          role: normalizeRole(role),
          avatar_url: user.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });
  }

  return data;
};

/* -------------------------------------------------------------------------- */
/* Login User                                                                  */
/* -------------------------------------------------------------------------- */

export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const data = await authFetch("token?grant_type=password", {
    method: "POST",
    body: {
      email,
      password,
    },
  });

  saveSessionToken(data);

  return {
    session: data,
    user: data?.user,
  };
};

/* -------------------------------------------------------------------------- */
/* Google Login                                                                */
/* -------------------------------------------------------------------------- */

export const googleLogin = async () => {
  const redirectTo = encodeURIComponent(window.location.origin);

  window.location.href =
    `${SUPABASE_URL}/auth/v1/authorize` +
    `?provider=google` +
    `&redirect_to=${redirectTo}`;

  return true;
};

/* -------------------------------------------------------------------------- */
/* Logout User                                                                 */
/* -------------------------------------------------------------------------- */

export const logout = async () => {
  try {
    await authFetch("logout", {
      method: "POST",
      body: {},
    });
  } catch (error) {
    console.warn("Logout REST error ignored:", error);
  }

  removeSessionToken();
  localStorage.removeItem("echoo_login_mode");

  window.dispatchEvent(new CustomEvent("auth:logout"));

  return true;
};

/* -------------------------------------------------------------------------- */
/* Forgot Password                                                             */
/* -------------------------------------------------------------------------- */

export const forgotPassword = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  return authFetch("recover", {
    method: "POST",
    body: {
      email,
      redirect_to: `${window.location.origin}/reset-password`,
    },
  });
};

/* -------------------------------------------------------------------------- */
/* Reset Password                                                              */
/* -------------------------------------------------------------------------- */

export const resetPassword = async ({ password }) => {
  if (!password) {
    throw new Error("New password is required");
  }

  return authFetch("user", {
    method: "PUT",
    body: {
      password,
    },
  });
};

/* -------------------------------------------------------------------------- */
/* Get Current Session                                                         */
/* -------------------------------------------------------------------------- */

export const getCurrentSession = async () => {
  await handleOAuthRedirect();

  const session = getSavedSession();

  if (!session?.access_token) {
    return null;
  }

  return session;
};

/* -------------------------------------------------------------------------- */
/* Get Current User                                                            */
/* -------------------------------------------------------------------------- */

export const getCurrentUser = async () => {
  await handleOAuthRedirect();

  const token = localStorage.getItem("echoo_access_token");

  if (!token) {
    return null;
  }

  try {
    const user = await authFetch("user");

    if (user?.id) {
      updateSavedSessionUser(user);
      return user;
    }

    return null;
  } catch (error) {
    console.error("Get current user error:", error);

    const message = String(error?.message || "").toLowerCase();

    if (
      message.includes("jwt expired") ||
      message.includes("invalid jwt") ||
      error?.code === "PGRST303" ||
      error?.status === 401
    ) {
      removeSessionToken();
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }

    return null;
  }
};

/* -------------------------------------------------------------------------- */
/* Get Profile                                                                 */
/* -------------------------------------------------------------------------- */

export const getProfile = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const data = await dbFetch(
    `profiles?select=*&id=eq.${encodeURIComponent(user.id)}&limit=1`
  );

  if (data?.[0]) {
    return data[0];
  }

  const newProfile = {
    id: user.id,
    email: user.email,
    full_name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "",
    phone: user.user_metadata?.phone || "",
    role: normalizeRole(user.user_metadata?.role),
    avatar_url: user.user_metadata?.avatar_url || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const created = await dbFetch("profiles", {
    method: "POST",
    body: [newProfile],
  });

  return created?.[0] || newProfile;
};

/* -------------------------------------------------------------------------- */
/* Update Profile                                                              */
/* -------------------------------------------------------------------------- */

export const updateProfile = async ({
  fullName,
  phone,
  avatarUrl,
  address,
}) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not logged in");
  }

  const updateData = {
    updated_at: new Date().toISOString(),
  };

  if (fullName !== undefined) updateData.full_name = fullName;
  if (phone !== undefined) updateData.phone = phone;
  if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;
  if (address !== undefined) updateData.address = address;

  const data = await dbFetch(`profiles?id=eq.${encodeURIComponent(user.id)}`, {
    method: "PATCH",
    body: updateData,
  });

  return data?.[0] || null;
};

/* -------------------------------------------------------------------------- */
/* Check If User Is Logged In                                                  */
/* -------------------------------------------------------------------------- */

export const isLoggedIn = async () => {
  const session = await getCurrentSession();
  return Boolean(session?.access_token);
};

/* -------------------------------------------------------------------------- */
/* Check User Role                                                             */
/* -------------------------------------------------------------------------- */

export const getUserRole = async () => {
  const profile = await getProfile();

  if (!profile) {
    return null;
  }

  return normalizeRole(profile.role);
};

export const isAdmin = async () => {
  const role = await getUserRole();
  const mode = localStorage.getItem("echoo_login_mode");

  return mode === "admin" && role === "Admin";
};

export const isUser = async () => {
  const mode = localStorage.getItem("echoo_login_mode");

  return mode !== "admin";
};

/* -------------------------------------------------------------------------- */
/* Listen To Auth Changes                                                      */
/* -------------------------------------------------------------------------- */

export const onAuthStateChange = (callback) => {
  const handler = async () => {
    await handleOAuthRedirect();

    const session = getSavedSession();

    if (session?.access_token) {
      callback("SIGNED_IN", session);
    } else {
      callback("SIGNED_OUT", null);
    }
  };

  window.addEventListener("storage", handler);
  window.addEventListener("auth:logout", handler);
  window.addEventListener("auth:mode-change", handler);

  setTimeout(handler, 0);

  return {
    unsubscribe: () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("auth:logout", handler);
      window.removeEventListener("auth:mode-change", handler);
    },
  };
};