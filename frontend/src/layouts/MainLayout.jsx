import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function MainLayout() {
    const [isVisible, setIsVisible] = useState(false);

    // This effect triggers the "Slide up and Fade in" animation
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const layoutStyle = {
        backgroundColor: "#f1f1f1ff", // Updated background color
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        // Entrance animation properties
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.8s ease-out, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
    };

    return (
        <div style={layoutStyle}>
            <Navbar />
            <div className="d-flex flex-grow-1">
                <Sidebar />
                <div className="flex-grow-1 p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default MainLayout;