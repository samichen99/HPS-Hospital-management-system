import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Sidebar() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return null;

  const link = (to, text) => (
    <li className="nav-item">
      <NavLink className="nav-link" to={to}>
        {text}
      </NavLink>
    </li>
  );

  return (
    <div className="border-end bg-white" style={{ width: 240 }}>
      <div className="p-3 border-bottom fw-bold">Menu</div>
      <ul className="nav flex-column p-2">
        {link("/", "Dashboard")}
        {link("/patients", "Patients")}
        {(role === "staff" || role === "admin") && link("/doctors", "Doctors")}
        {link("/appointments", "Appointments")}
        {(role === "staff" || role === "admin") && link("/invoices", "Invoices")}
        {link("/files", "Files")}
      </ul>
    </div>
  );
}
