import { createContext, useState, useEffect } from "react";
import api from "../services/apiClient";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Fix: Initialize user and token together to prevent navigation "blinks"
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        // Initial expiry check
        if (decoded.exp * 1000 > Date.now()) return decoded;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const decodeToken = (t) => {
    try {
      return jwtDecode(t);
    } catch {
      return null;
    }
  };

  // Keep the effect for token changes (like login/logout/expiry)
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded || decoded.exp * 1000 < Date.now()) {
      logout();
    } else {
      setUser(decoded);
    }
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", credentials);
      const { token: newToken } = res.data;
      if (!newToken) throw new Error("No token received");

      const decoded = decodeToken(newToken);
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(decoded);

      return { ok: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Login failed";
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const handleStorage = () => {
      if (!localStorage.getItem("token")) {
        logout();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;