import { useContext, useState } from "react";
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
            ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 70%), rgba(255, 255, 255, 0.6)`
            : "rgba(255, 255, 255, 0.7)",
        transition: "all 0.15s ease-out",
        padding: "16px 20px",
        borderRadius: "18px",
        backdropFilter: "blur(30px) saturate(180%)",
        WebkitBackdropFilter: "blur(30px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: isHovered ? "0 8px 32px rgba(0, 0, 0, 0.04)" : "0 4px 24px rgba(0, 0, 0, 0.02)",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)"
    };

    return (
        <div 
            style={dynamicStyle}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", marginBottom: "4px", letterSpacing: "0.02em", textTransform: "uppercase" }}>
                {stat.label}
            </div>
            <div style={{ fontSize: "26px", fontWeight: "700", color: "#1d1d1f", letterSpacing: "-0.02em" }}>
                {stat.value}
            </div>
            {stat.trend && (
                <div style={{ fontSize: "11px", marginTop: "4px", color: stat.trend.startsWith('+') ? "#28c840" : "#ff5f57", fontWeight: "500" }}>
                    {stat.trend} from last month
                </div>
            )}
        </div>
    );
}

function Dashboard() {
    const { user } = useContext(AuthContext);

    const mainContainerStyle = {
        backgroundColor: "#f1f1f1ff",
        minHeight: "100vh",
        padding: "40px",
        color: "#1d1d1f",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
    };

    const stats = [
        { label: "Total Patients", value: "1,284", trend: "+12%" },
        { label: "Active Doctors", value: "42", trend: "+2" },
        { label: "Scheduled Today", value: "58", trend: "-5%" },
        { label: "Pending Invoices", value: "$4,290", trend: "+8%" }
    ];

    const activities = [
        { type: "Appointment", details: "Dr. Ahmed with Patient #45", date: "2026-01-20", status: "Confirmed", color: "#007aff" },
        { type: "Record Update", details: "Medical file updated for Patient #102", date: "2026-01-20", status: "Completed", color: "#28c840" },
        { type: "Billing", details: "Invoice #9021 generated for Dr. Sarah", date: "2026-01-19", status: "Pending", color: "#febc2e" },
        { type: "New User", details: "New nursing staff account created", date: "2026-01-19", status: "Active", color: "#007aff" },
        { type: "Emergency", details: "Urgent consultation: Patient #12", date: "2026-01-18", status: "Critical", color: "#ff5f57" }
    ];

    return (
        <div style={mainContainerStyle}>
            <header className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", marginBottom: "2px" }}>Clinic Overview</h2>
                    <p style={{ color: "#86868b", fontSize: "14px", margin: 0 }}>
                        Welcome back, <span style={{ fontWeight: "600", color: "#1d1d1f" }}>{user?.username || user?.email}</span>. Here is what's happening today.
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
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                overflow: "hidden" 
            }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)", background: "rgba(255, 255, 255, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>Recent Clinic Activity</h6>
                    <div className="d-flex gap-3">
                        <Search size={14} style={{ cursor: "pointer", opacity: 0.5 }} />
                        <Filter size={14} style={{ cursor: "pointer", opacity: 0.5 }} />
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-borderless m-0">
                        <thead>
                            <tr style={{ color: "#86868b", fontSize: "11px", textTransform: "none" }}>
                                <th className="px-4 py-3 font-weight-normal">CATEGORY</th>
                                <th className="py-3 font-weight-normal">DETAILS</th>
                                <th className="text-center py-3 font-weight-normal">STATUS</th>
                                <th className="text-end px-4 py-3 font-weight-normal">TIMESTAMP</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: "13px" }}>
                            {activities.map((act, index) => (
                                <tr key={index} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.02)" }}>
                                    <td className="px-4 py-3">
                                        <span style={{ 
                                            padding: "3px 10px", 
                                            borderRadius: "100px", 
                                            backgroundColor: `${act.color}15`, 
                                            color: act.color, 
                                            fontWeight: "600", 
                                            fontSize: "11px" 
                                        }}>
                                            {act.type}
                                        </span>
                                    </td>
                                    <td className="py-3" style={{ fontWeight: "400" }}>{act.details}</td>
                                    <td className="text-center py-3">
                                        <span style={{ color: "#86868b", fontSize: "12px" }}>{act.status}</span>
                                    </td>
                                    <td className="text-end px-4 py-3" style={{ color: "#86868b" }}>{act.date}</td>
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