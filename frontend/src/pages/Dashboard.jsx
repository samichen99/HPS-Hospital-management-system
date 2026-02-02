import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Download, Plus, Search, Filter } from "lucide-react";

function StatCard({ stat }) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const dynamicStyle = {
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        background: isHovered 
            ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.49) 0%, rgba(255,255,255,0.05) 70%), rgba(235, 235, 235, 0.68)`
            : "rgba(225, 225, 225, 0.40)",
        transition: "all 0.15s ease-out",
        padding: "16px 20px",
        borderRadius: "18px",
        backdropFilter: "blur(10px) saturate(150%)",
        WebkitBackdropFilter: "blur(10px) saturate(150%)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: isHovered ? "0 8px 32px rgba(0, 0, 0, 0.06)" : "0 4px 24px rgba(0, 0, 0, 0.02)",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)"
    };

    return (
        <div 
            style={dynamicStyle}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#424245", marginBottom: "4px", letterSpacing: "0.02em", textTransform: "uppercase" }}>
                {stat.label}
            </div>
            <div style={{ fontSize: "26px", fontWeight: "700", color: "#1d1d1f", letterSpacing: "-0.02em" }}>
                {stat.value}
            </div>
            {stat.trend && (
                <div style={{ fontSize: "11px", marginTop: "4px", color: stat.trend.startsWith('+') ? "#28c840" : "#ff5f57", fontWeight: "600" }}>
                    {stat.trend} from last month
                </div>
            )}
        </div>
    );
}

function Dashboard() {
    const { user, token } = useContext(AuthContext);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (user && token) {
            setIsReady(true);
        }
    }, [user, token]);

    const mainContainerStyle = {
        backgroundColor: "rgba(226, 226, 226, 0.40)",
        borderRadius: "18px",
        minHeight: "100vh",
        padding: "40px",
        color: "#1d1d1f",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        backdropFilter: "blur(4px) saturate(150%)",
        WebkitBackdropFilter: "blur(4px) saturate(150%)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)"
    };

    const stats = [
        { label: "Total Patients", value: "1,284", trend: "+12%" },
        { label: "Active Doctors", value: "42", trend: "+2" },
        { label: "Scheduled Today", value: "58", trend: "-5%" },
        { label: "Pending Invoices", value: "4,290 MAD", trend: "+8%" }
    ];

    const activities = [
        { type: "Appointment", details: "Dr. Ahmed with Patient #45", date: "2026-01-20", status: "Confirmed", color: "#007aff" },
        { type: "Record Update", details: "Medical file updated for Patient #102", date: "2026-01-20", status: "Completed", color: "#28c840" },
        { type: "Billing", details: "Invoice #9021 generated for Dr. Sarah", date: "2026-01-19", status: "Pending", color: "#febc2e" },
        { type: "New User", details: "New nursing staff account created", date: "2026-01-19", status: "Active", color: "#007aff" },
        { type: "Emergency", details: "Urgent consultation: Patient #12", date: "2026-01-18", status: "Critical", color: "#ff5f57" }
    ];

    if (!isReady) {
        return <div style={{ padding: "40px", color: "#424245", fontSize: "13px" }}>Initializing secure session...</div>;
    }

    return (
        <div style={mainContainerStyle}>
            <header className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", marginBottom: "2px" }}>Clinic Overview</h2>
                    <p style={{ color: "#424245", fontSize: "14px", margin: 0 }}>
                        Welcome back, <span style={{ fontWeight: "600", color: "#1d1d1f" }}>{user?.username || "Staff"}</span>. Here is what's happening today.
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn-macos btn-macos-secondary">
                        <Download size={14} style={{ marginRight: "6px" }} />
                        Export
                    </button>
                    <button className="btn-macos btn-macos-primary">
                        <Plus size={14} style={{ marginRight: "6px" }} />
                        New Entry
                    </button>
                </div>
            </header>

            <div className="row g-4">
                {stats.map((stat, i) => (
                    <div className="col-md-3" key={i}>
                        <StatCard stat={stat} />
                    </div>
                ))}
            </div>

            <div className="glass-card" style={{ 
                marginTop: "40px", 
                padding: "0", 
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                overflow: "hidden",
                backdropFilter: "blur(20px) saturate(160%)"
            }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)", background: "rgba(255, 255, 255, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>Recent Clinic Activity</h6>
                    <div className="d-flex gap-3">
                        <Search size={14} style={{ cursor: "pointer", opacity: 0.6 }} />
                        <Filter size={14} style={{ cursor: "pointer", opacity: 0.6 }} />
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-borderless m-0">
                        <thead>
                            <tr style={{ color: "#424245", fontSize: "11px", letterSpacing: "0.02em" }}>
                                <th className="px-4 py-3 font-weight-normal">CATEGORY</th>
                                <th className="py-3 font-weight-normal">DETAILS</th>
                                <th className="text-center py-3 font-weight-normal">STATUS</th>
                                <th className="text-end px-4 py-3 font-weight-normal">TIMESTAMP</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: "12px" }}>
                            {activities.map((act, index) => (
                                <tr key={index} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.04)" }}>
                                    <td className="px-4 py-3">
                                        <span style={{ 
                                            padding: "3px 10px", 
                                            borderRadius: "100px", 
                                            backgroundColor: `${act.color}25`, 
                                            color: act.color, 
                                            fontWeight: "600", 
                                            fontSize: "10px",
                                            textTransform: "uppercase"
                                        }}>
                                            {act.type}
                                        </span>
                                    </td>
                                    <td className="py-3" style={{ fontWeight: "500", color: "#1d1d1f" }}>{act.details}</td>
                                    <td className="text-center py-3">
                                        <span style={{ color: "#424245", fontSize: "12px", fontWeight: "500" }}>{act.status}</span>
                                    </td>
                                    <td className="text-end px-4 py-3" style={{ color: "#424245" }}>{act.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;