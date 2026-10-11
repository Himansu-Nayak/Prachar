"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { AuthResponse } from "@/types";
import { logoutUser, refreshAuthToken } from "@/lib/api";

interface AuthContextType {
  user: AuthResponse | null;
  token: string | null;
  loading: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => Promise<void>;
  updateUserSession: (updater: Partial<AuthResponse>) => void;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "prachar_auth_session";

/**
 * Parses JWT expiration timestamp in milliseconds without external libraries.
 */
function parseJwtExpMs(jwt: string): number | null {
  try {
    const parts = jwt.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    return typeof parsed.exp === "number" ? parsed.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  const logout = useCallback(async () => {
    clearRefreshTimer();
    const currentToken = token;
    if (currentToken) {
      try {
        await logoutUser(currentToken);
      } catch {
        // Silently continue local cleanup
      }
    }
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors in restricted browser environments
    }
  }, [token]);

  const scheduleTokenRefresh = useCallback((accessToken: string, refreshTokenStr?: string) => {
    clearRefreshTimer();
    if (!refreshTokenStr) return;

    const expMs = parseJwtExpMs(accessToken);
    if (!expMs) return;

    // Refresh 2 minutes before expiration (or immediately if close to expiry)
    const timeUntilRefreshMs = Math.max(10000, expMs - Date.now() - 120000);

    refreshTimerRef.current = setTimeout(async () => {
      try {
        const res = await refreshAuthToken(refreshTokenStr);
        if (res.success && res.data) {
          setUser(res.data);
          setToken(res.data.accessToken);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
          scheduleTokenRefresh(res.data.accessToken, res.data.refreshToken);
        } else {
          // Refresh token invalid or revoked
          await logout();
        }
      } catch {
        // Network failure during background refresh, will retry on next user action
      }
    }, timeUntilRefreshMs);
  }, [logout]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    if (!user?.refreshToken) return false;

    try {
      const res = await refreshAuthToken(user.refreshToken);
      if (res.success && res.data) {
        setUser(res.data);
        setToken(res.data.accessToken);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
        } catch {
          // Ignore
        }
        scheduleTokenRefresh(res.data.accessToken, res.data.refreshToken);
        return true;
      }
      await logout();
      return false;
    } catch {
      return false;
    }
  }, [user?.refreshToken, scheduleTokenRefresh, logout]);

  const login = useCallback((authData: AuthResponse) => {
    setUser(authData);
    setToken(authData.accessToken);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    } catch {
      // Ignore storage errors
    }
    scheduleTokenRefresh(authData.accessToken, authData.refreshToken);
  }, [scheduleTokenRefresh]);

  const updateUserSession = useCallback((updater: Partial<AuthResponse>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updater };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  // Mount effect: load stored session and inspect expiry
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: AuthResponse = JSON.parse(stored);
          const expMs = parseJwtExpMs(parsed.accessToken);

          if (expMs && expMs <= Date.now()) {
            // Access token already expired; attempt instant refresh
            if (parsed.refreshToken) {
              const res = await refreshAuthToken(parsed.refreshToken);
              if (res.success && res.data) {
                setUser(res.data);
                setToken(res.data.accessToken);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
                scheduleTokenRefresh(res.data.accessToken, res.data.refreshToken);
              } else {
                localStorage.removeItem(STORAGE_KEY);
              }
            } else {
              localStorage.removeItem(STORAGE_KEY);
            }
          } else {
            // Token is still fresh
            setUser(parsed);
            setToken(parsed.accessToken);
            scheduleTokenRefresh(parsed.accessToken, parsed.refreshToken);
          }
        }
      } catch {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Ignore
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      clearRefreshTimer();
    };
  }, [scheduleTokenRefresh]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUserSession,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
