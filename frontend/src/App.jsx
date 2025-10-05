import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Patients from "./pages/Patients.jsx";
import Doctors from "./pages/Doctors.jsx";
import Appointments from "./pages/Appointments.jsx";
import Invoices from "./pages/Invoices.jsx";
import Files from "./pages/Files.jsx";

export default function App() {
  return (
    <AuthProvider>
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <Sidebar />
        <div className="flex-grow-1">
          <Navbar />
          <div className="container py-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Patients: doctor + staff + admin */}
              <Route
                path="/patients"
                element={
                  <ProtectedRoute roles={["doctor", "staff", "admin"]}>
                    <Patients />
                  </ProtectedRoute>
                }
              />
              {/* Doctors management: staff + admin  */}

              <Route
                path="/doctors"
                element={
                  <ProtectedRoute roles={["staff", "admin"]}>
                    <Doctors />
                  </ProtectedRoute>
                }
              />

              {/* Appointments: doctor + staff + admin */}
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute roles={["doctor", "staff", "admin"]}>
                    <Appointments />
                  </ProtectedRoute>
                }
              />

              {/* Invoices/Payments: staff + admin */}

              <Route
                path="/invoices"
                element={
                  <ProtectedRoute roles={["staff", "admin"]}>
                    <Invoices />
                  </ProtectedRoute>
                }
              />
              {/* Files (medical docs): doctor + staff + admin */}
              
              <Route
                path="/files"
                element={
                  <ProtectedRoute roles={["doctor", "staff", "admin"]}>
                    <Files />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
