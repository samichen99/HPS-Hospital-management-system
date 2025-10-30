import { createContext, useState, useEffect } from "react";
import api from "../services/apiClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || null);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
    setUser(null);
  }, [token]);
  
  const login = async (Credentials) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", Credentials);
      const { token: t, user: u} = res.data;
      if (!t ) throw new Error("No token received");

      setToken(t);
      setUser(u);
      return { ok: true};
    } catch (error) { const message = err.responce?.data?.message || error.message || "Login failed";
      return { ok: false, message };
    } finally {
      setLoading(false);

    }
  };
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}