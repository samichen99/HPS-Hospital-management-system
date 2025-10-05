import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <span className="navbar-brand">HMS</span>
        <div className="d-flex align-items-center gap-3">
          {user && <span className="badge text-bg-primary text-uppercase">{user.role}</span>}
          {user ? (
            <button className="btn btn-outline-danger btn-sm" onClick={logout}>
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
