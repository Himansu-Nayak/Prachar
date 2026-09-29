"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthResponse } from "@/types";
import { logoutUser, refreshAuthToken } from "@/lib/api";

interface AuthContextType {
  user: AuthResponse | null;
  token: string | null;
  loading: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => Promise<void>;
  updateUserSession: (updater: Partial<AuthResponse>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "prachar_auth_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: AuthResponse = JSON.parse(stored);
        setUser(parsed);
        setToken(parsed.accessToken);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (authData: AuthResponse) => {
    setUser(authData);
    setToken(authData.accessToken);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await logoutUser(token);
      } catch {
        // Silently continue local cleanup
      }
    }
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const updateUserSession = (updater: Partial<AuthResponse>) => {
    if (!user) return;
    const updated = { ...user, ...updater };
    setUser(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUserSession }}>
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
