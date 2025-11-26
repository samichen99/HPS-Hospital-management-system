import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark shadow-sm px-3" style={{ backgroundColor: "#005a9bff" }}>
            <span 
                className="navbar-brand fw-bold text-light"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/dashboard")}
            >
                HAP Hospital Management System
            </span>

            <div className="ms-auto">
                {user ? (
                    <button className="btn btn-info btn-sm" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => navigate("/login")}>
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
