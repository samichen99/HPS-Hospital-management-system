import { NavLink } from "react-router-dom";
import { useState } from "react";

import houseIcon from "../assets/icons/house.png";
import usersIcon from "../assets/icons/person.2.png"; 
import patientsIcon from "../assets/icons/person.crop.square.png";
import doctorsIcon from "../assets/icons/bandage.png";
import appointmentsIcon from "../assets/icons/calendar.png";
import recordsIcon from "../assets/icons/tray.full.png";
import filesIcon from "../assets/icons/doc.append.png";
import invoicesIcon from "../assets/icons/tag.png";
import paymentsIcon from "../assets/icons/creditcard.png";
import panelIcon from "../assets/icons/sidebar.left.png"; 

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    const menuItems = [
        { to: "/dashboard", label: "Dashboard", icon: houseIcon },
        { to: "/users", label: "Users", icon: usersIcon },
        { to: "/patients", label: "Patients", icon: patientsIcon },
        { to: "/doctors", label: "Doctors", icon: doctorsIcon },
        { to: "/appointments", label: "Appointments", icon: appointmentsIcon },
        { to: "/medical-records", label: "Medical Records", icon: recordsIcon },
        { to: "/files", label: "Files", icon: filesIcon },
        { to: "/invoices", label: "Invoices", icon: invoicesIcon },
        { to: "/payments", label: "Payments", icon: paymentsIcon },
    ];

    return (
        <aside className={`sidebar-macos ${isCollapsed ? 'collapsed' : ''}`}>
            {/* macOS Traffic Lights*/}
            {!isCollapsed && (
                <div style={{ display: 'flex', gap: '8px', padding: '16px 16px 8px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#ff5f57', border: '0.5px solid rgba(0,0,0,0.1)' }}></div>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#febc2e', border: '0.5px solid rgba(0,0,0,0.1)' }}></div>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#28c840', border: '0.5px solid rgba(0,0,0,0.1)' }}></div>
                </div>
            )}

            <div style={{ 
                display: 'flex', 
                justifyContent: isCollapsed ? 'center' : 'space-between', 
                alignItems: 'center', 
                padding: isCollapsed ? "15px 0" : "10px 16px",
                marginTop: isCollapsed ? "10px" : "0"
            }}>
                {!isCollapsed && (
                    <span style={{ 
                        fontSize: '11.5px', 
                        fontWeight: '700', 
                        color: 'rgba(29, 29, 31, 0.5)', 
                        textTransform: 'none',
                        letterSpacing: '0.3px'
                    }}>
                        Navigation
                    </span>
                )}
                
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', opacity: 0.6 }}
                >
                    <img src={panelIcon} alt="toggle" style={{ 
                        width: '15px', 
                        height: '15px', 
                        transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', 
                        transition: 'transform 0.4s' 
                    }} />
                </button>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "0 8px" }}>
                {menuItems.map((item) => (
                    <NavLink 
                        key={item.to}
                        to={item.to} 
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                        style={{ height: '30px' }} // idebar row height
                    >
                        {({ isActive }) => (
                            <>
                                <img 
                                    src={item.icon} 
                                    alt={item.label}
                                    style={{ 
                                        width: "22px", //icon size
                                        height: "22px", 
                                        objectFit: "contain",
                                        marginRight: isCollapsed ? "0" : "7px",
                                        transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                                        filter: isActive 
                                            ? "invert(31%) sepia(94%) saturate(4156%) hue-rotate(211deg) brightness(101%) contrast(105%)" 
                                            : "invert(40%) sepia(0%) saturate(0%) brightness(50%) contrast(100%)"
                                    }} 
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}
                                />
                                {!isCollapsed && (
                                    <span className="nav-label" style={{ 
                                        fontSize: '13px', // text size
                                        fontWeight: isActive ? '545' : '5',
                                        color: isActive ? "var(--apple-text)" : "rgb(29, 29, 31)",
                                        letterSpacing: '0.5px'
                                    }}>
                                        {item.label}
                                    </span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;