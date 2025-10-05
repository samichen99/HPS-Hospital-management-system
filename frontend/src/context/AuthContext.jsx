import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    if (!t) return null;
    try {
      const decoded = jwtDecode(t);
      return { id: decoded.user_id, role: decoded.role };
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.user_id, role: decoded.role });
      } catch {
        setUser(null);
      }
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!user,
      role: user?.role || null,
      login: (t) => setToken(t),
      logout: () => setToken(""),
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
