import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  login as apiLogin,
  register as apiRegister,
  googleLogin as apiGoogleLogin,
  logout as apiLogout,
  getCurrentSession,
  getCurrentUser,
  getProfile,
  getUserRole,
  handleOAuthRedirect,
} from "../api/authApi";

const AuthContext = createContext(null);

const normalizeRole = (role) => {
  if (!role) return "User";

  const cleanRole = String(role).trim().toLowerCase();

  if (cleanRole === "admin") return "Admin";

  return "User";
};

const getLoginMode = () => {
  return localStorage.getItem("echoo_login_mode") || "user";
};

const getEffectiveRole = (realRole) => {
  const loginMode = getLoginMode();
  const normalizedRealRole = normalizeRole(realRole);

  /*
    Rule:
    - /admin_login sets echoo_login_mode = admin
    - /sign_in sets echoo_login_mode = user
    - Admin account in user mode behaves like normal User
    - Admin account in admin mode behaves like Admin
  */
  if (loginMode === "admin" && normalizedRealRole === "Admin") {
    return "Admin";
  }

  return "User";
};

const normalizeProfile = (profile, authUser) => {
  if (!authUser && !profile) return null;

  const metadata = authUser?.user_metadata || {};

  const realRole = normalizeRole(profile?.role || metadata?.role);
  const effectiveRole = getEffectiveRole(realRole);

  return {
    id: profile?.id || authUser?.id || "",
    email: profile?.email || authUser?.email || "",
    name:
      profile?.name ||
      profile?.full_name ||
      metadata?.name ||
      metadata?.full_name ||
      authUser?.email ||
      "User",
    full_name:
      profile?.full_name ||
      profile?.name ||
      metadata?.full_name ||
      metadata?.name ||
      "",
    avatar_url: profile?.avatar_url || metadata?.avatar_url || "",
    role: effectiveRole,
    realRole,
    loginMode: getLoginMode(),
    status: profile?.status || "Active",
    created_at: profile?.created_at || authUser?.created_at || null,
    address: profile?.address || "",
    phone: profile?.phone || metadata?.phone || "",
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const applyAuthState = useCallback((nextSession, nextUser, nextProfile) => {
    const normalizedProfile = normalizeProfile(nextProfile, nextUser);

    setSession(nextSession || null);
    setProfile(normalizedProfile);

    if (nextUser || normalizedProfile) {
      setUser({
        ...(nextUser || {}),
        ...(normalizedProfile || {}),
        authUser: nextUser || null,
      });
    } else {
      setUser(null);
    }
  }, []);

  const clearAuthState = useCallback(() => {
    setSession(null);
    setProfile(null);
    setUser(null);
  }, []);

  const fetchProfile = useCallback(async (authUser) => {
    if (!authUser?.id) {
      setProfile(null);
      setUser(null);
      return null;
    }

    try {
      const profileData = await getProfile();
      const normalizedProfile = normalizeProfile(profileData, authUser);

      setProfile(normalizedProfile);
      setUser({
        ...authUser,
        ...normalizedProfile,
        authUser,
      });

      return normalizedProfile;
    } catch (error) {
      console.error("Profile fetch error:", error);

      const normalizedProfile = normalizeProfile(null, authUser);

      setProfile(normalizedProfile);
      setUser({
        ...authUser,
        ...normalizedProfile,
        authUser,
      });

      return normalizedProfile;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    setAuthLoading(true);

    try {
      await handleOAuthRedirect();

      const currentSession = await getCurrentSession();
      const currentUser = await getCurrentUser();

      if (currentSession?.access_token && currentUser) {
        const profileData = await getProfile();
        applyAuthState(currentSession, currentUser, profileData);
      } else {
        clearAuthState();
      }
    } catch (error) {
      console.error("Auth refresh error:", error);
      clearAuthState();
    } finally {
      setAuthLoading(false);
    }
  }, [applyAuthState, clearAuthState]);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        await handleOAuthRedirect();

        const currentSession = await getCurrentSession();
        const currentUser = await getCurrentUser();

        if (!active) return;

        if (currentSession?.access_token && currentUser) {
          const profileData = await getProfile();

          if (!active) return;

          applyAuthState(currentSession, currentUser, profileData);
        } else {
          clearAuthState();
        }
      } catch (error) {
        console.error("Session load error:", error);

        if (active) {
          clearAuthState();
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    };

    loadSession();

    const handleLogout = () => {
      clearAuthState();
      setAuthLoading(false);
    };

    const handleStorage = () => {
      loadSession();
    };

    const handleAuthModeChange = () => {
      loadSession();
    };

    window.addEventListener("auth:logout", handleLogout);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth:mode-change", handleAuthModeChange);

    return () => {
      active = false;
      window.removeEventListener("auth:logout", handleLogout);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth:mode-change", handleAuthModeChange);
    };
  }, [applyAuthState, clearAuthState]);

  const login = useCallback(
    async (payload) => {
      if (payload?.email && payload?.password) {
        const result = await apiLogin({
          email: payload.email,
          password: payload.password,
        });

        const nextSession = result?.session || null;
        const nextUser = result?.user || nextSession?.user || null;

        let nextProfile = null;

        if (nextUser) {
          nextProfile = await getProfile();
        }

        applyAuthState(nextSession, nextUser, nextProfile);

        const normalizedProfile = normalizeProfile(nextProfile, nextUser);

        return {
          user: {
            ...(nextUser || {}),
            ...(normalizedProfile || {}),
            authUser: nextUser,
          },
          profile: normalizedProfile,
          role: normalizedProfile?.role || "User",
          realRole: normalizedProfile?.realRole || "User",
          loginMode: normalizedProfile?.loginMode || getLoginMode(),
          session: nextSession,
        };
      }

      applyAuthState(null, payload, payload);

      const normalizedProfile = normalizeProfile(payload, payload);

      return {
        user: payload,
        profile: normalizedProfile,
        role: normalizedProfile?.role || "User",
        realRole: normalizedProfile?.realRole || "User",
        loginMode: normalizedProfile?.loginMode || getLoginMode(),
        session: null,
      };
    },
    [applyAuthState]
  );

  const register = useCallback(
    async ({ fullName, name, email, password, phone = "" }) => {
      const finalName = fullName || name || "";

      localStorage.setItem("echoo_login_mode", "user");

      const result = await apiRegister({
        email,
        password,
        fullName: finalName,
        phone,
        role: "User",
      });

      const nextSession = result?.session || result || null;
      const nextUser = result?.user || nextSession?.user || null;

      if (nextSession?.access_token && nextUser) {
        const nextProfile = await getProfile();
        applyAuthState(nextSession, nextUser, nextProfile);
      }

      return result;
    },
    [applyAuthState]
  );

  const googleLogin = useCallback(async () => {
    return apiGoogleLogin();
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    clearAuthState();
    return true;
  }, [clearAuthState]);

  const value = useMemo(() => {
    const activeUser = profile || user;

    const realRole = normalizeRole(
      activeUser?.realRole ||
        activeUser?.role ||
        profile?.realRole ||
        profile?.role ||
        user?.authUser?.user_metadata?.role ||
        session?.user?.user_metadata?.role
    );

    const activeRole = getEffectiveRole(realRole);

    const safeActiveUser = activeUser
      ? {
          ...activeUser,
          role: activeRole,
          realRole,
          loginMode: getLoginMode(),
        }
      : null;

    return {
      user: safeActiveUser,
      authUser: session?.user || user?.authUser || null,
      profile: safeActiveUser,
      session,
      role: activeRole,
      realRole,
      loginMode: getLoginMode(),
      authLoading,
      isAuthenticated: Boolean(session?.access_token && safeActiveUser),
      isAdmin: activeRole === "Admin",
      isUser: activeRole === "User",
      login,
      register,
      googleLogin,
      logout,
      refreshUser,
      fetchProfile,
      getUserRole,
    };
  }, [
    user,
    profile,
    session,
    authLoading,
    login,
    register,
    googleLogin,
    logout,
    refreshUser,
    fetchProfile,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
};

export default AuthContext;