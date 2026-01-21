import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        }).replace(/,/g, '');
    };

    const navStyle = {
        
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        backgroundImage: "linear-gradient(to bottom, rgba(246, 246, 246, 0.85), rgba(221, 221, 221, 0.82))",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.05)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.15)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999, // Ensure it stays above all other content
        
        height: "24px", 
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        userSelect: "none"
    };

    const menuLinkStyle = {
        fontSize: "11.5px",
        fontWeight: "600",
        color: "#1d1d1fbd",
        padding: "0 10px",
        cursor: "default",
        letterSpacing: "0.2px",
        display: "flex",
        alignItems: "center"
    };

    const statusIconStyle = {
        marginLeft: "14px",
        color: "#1d1d1f83",
        display: "flex",
        alignItems: "center",
        fontSize: "11.5px",
        fontWeight: "600"
    };

    return (
        <>
            {/* Spacer to prevent content from hiding under the fixed navbar */}
            <div style={{ height: "24px" }}></div>
            
            <nav style={navStyle}>
                {/* Left Side: System Menus */}
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ ...menuLinkStyle, paddingLeft: "4px" }}>
                        <svg width="13" height="13" viewBox="0 0 17 20" fill="#1d1d1f">
                            <path d="M15.073 10.522c.026 2.71 2.361 3.633 2.39 3.646-.022.072-.375 1.285-1.233 2.535-.74 1.082-1.509 2.16-2.723 2.182-1.192.022-1.577-.704-2.937-.704-1.36 0-1.787.683-2.917.725-1.173.043-2.049-1.166-2.793-2.245-1.522-2.204-2.684-6.225-1.115-8.943.78-1.35 2.167-2.206 3.666-2.228 1.13-.021 2.196.76 2.887.76.69 0 2-.96 3.335-.823.56.023 2.13.224 3.14 1.701-.08.05-1.873 1.09-1.85 3.268zM12.446 3.51c.607-.737 1.017-1.76.905-2.778-.875.035-1.933.582-2.56 1.32-.56.647-1.05 1.688-.919 2.686.974.076 1.967-.492 2.574-1.228z"/>
                        </svg>
                    </div>
                    <div 
                        style={{ ...menuLinkStyle, fontWeight: "700", color: "#1d1d1f", cursor: "pointer" }} 
                        onClick={() => navigate("/dashboard")}
                    >
                        HAP Hospital management
                    </div>
                </div>

                {/* Right Side: Status Items */}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", paddingRight: "4px" }}>
                    {user && (
                        <div style={{ ...menuLinkStyle, color: "#007aff" }}>
                            Active: {user.role}
                        </div>
                    )}
                    
                    <div style={statusIconStyle}>
                        {formatTime(currentTime)}
                    </div>

                    {user && (
                        <button 
                            onClick={logout}
                            style={{
                                background: "none",
                                border: "none",
                                padding: "0 8px",
                                fontSize: "11.5px",
                                fontWeight: "600",
                                color: "#ff3b30",
                                cursor: "pointer"
                            }}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </nav>
        </>
    );
}

export default Navbar;