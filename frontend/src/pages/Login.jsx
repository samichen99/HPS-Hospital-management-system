import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (data?.token) {
        login(data.token);
        const redirectTo = loc.state?.from?.pathname || "/";
        nav(redirectTo, { replace: true });
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError(err?.response?.data || "Login failed.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow" style={{ width: 420 }}>
        <div className="card-body">
          <h4 className="mb-3">Sign in</h4>
          {error && <div className="alert alert-danger">{String(error)}</div>}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary w-100" type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
