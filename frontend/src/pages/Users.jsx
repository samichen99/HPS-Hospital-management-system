import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";
import { Search, UserPlus, Pencil, Trash2, X, ShieldCheck } from "lucide-react";

function Users() {
  const { token, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", email: "", role: "", password: "" });
  const [editingId, setEditingId] = useState(null);

  const getRoleStyle = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return { bg: "rgba(0, 122, 255, 0.12)", color: "#007aff" };
      case "doctor":
        return { bg: "rgba(40, 200, 64, 0.12)", color: "#28c840" };
      case "receptionist":
        return { bg: "rgba(255, 159, 10, 0.12)", color: "#ff9f0a" };
      default:
        return { bg: "rgba(142, 142, 147, 0.12)", color: "#8e8e93" };
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/api/users/${editingId}`, 
          { ...form, ...(form.password === "" && { password: undefined }) }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await api.post("/api/users", form, { headers: { Authorization: `Bearer ${token}` } });
      }
      setShowForm(false);
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setError("Operation failed");
    }
  };

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
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
    transition: "opacity 0.4s ease-in-out" // Added for internal smoothing
  };

  return (
    <div style={{ ...mainContainerStyle, opacity: loading ? 0 : 1 }}>
      {!loading && (
        <>
          <header className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", marginBottom: "2px" }}>Users Management</h2>
              <p style={{ color: "#424245", fontSize: "14px", margin: 0 }}>Manage hospital staff and permissions</p>
            </div>
            
            <div className="d-flex gap-2">
                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#424245', opacity: 0.6 }} />
                    <input
                    className="form-control"
                    style={{ 
                      paddingLeft: '34px', 
                      width: '240px', 
                      fontSize: "13px",
                      height: "32px",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      backdropFilter: "blur(10px)"
                    }}
                    placeholder="Search directory..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="btn-macos btn-macos-primary" onClick={() => { setEditingId(null); setForm({username:"", email:"", role:"", password:""}); setShowForm(true); }}>
                  <UserPlus size={14} style={{ marginRight: "6px" }} /> New User
                </button>
            </div>
          </header>

          {showForm && (
            <div className="glass-card mb-5" style={{ 
                border: "1px solid rgba(255, 255, 255, 0.3)", 
                backgroundColor: "rgba(255, 255, 255, 0.45)",
                backdropFilter: "blur(30px) saturate(180%)",
                padding: "24px"
            }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 style={{ margin: 0, fontWeight: "600", fontSize: "15px" }}>{editingId ? "Modify Staff Profile" : "Create Access Credentials"}</h5>
                <X size={18} style={{ cursor: "pointer", color: "#424245" }} onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-md-3">
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Username</label>
                    <input type="text" className="form-control" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
                  </div>
                  <div className="col-md-3">
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Email Address</label>
                    <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="col-md-3">
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Security Role</label>
                    <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required>
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="doctor">Doctor</option>
                      <option value="receptionist">Receptionist</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Password</label>
                    <input type="password" className="form-control" placeholder={editingId ? "••••••" : "Required"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} />
                  </div>
                  <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn-macos btn-macos-secondary" onClick={() => setShowForm(false)}>Discard</button>
                    <button type="submit" className="btn-macos btn-macos-primary">{editingId ? "Update Account" : "Confirm Creation"}</button>
                  </div>
              </form>
            </div>
          )}

          <div className="glass-card" style={{ 
              padding: "0", 
              backgroundColor: "rgba(255, 255, 255, 0.35)", 
              border: "1px solid rgba(255, 255, 255, 0.3)",
              overflow: "hidden",
              backdropFilter: "blur(20px) saturate(160%)"
          }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)", background: "rgba(255, 255, 255, 0.1)", display: "flex", alignItems: "center" }}>
                <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>
                  <ShieldCheck size={16} className="me-2" style={{ opacity: 0.7 }} /> System Access Directory
                </h6>
            </div>
            <div className="table-responsive">
              <table className="table table-borderless m-0">
                <thead>
                  <tr style={{ color: "#424245", fontSize: "11px", letterSpacing: "0.02em" }}>
                    <th className="px-4 py-3 font-weight-normal">ID</th>
                    <th className="py-3 font-weight-normal">USERNAME</th>
                    <th className="py-3 font-weight-normal">EMAIL</th>
                    <th className="py-3 font-weight-normal">ROLE</th>
                    <th className="text-end px-4 py-3 font-weight-normal">ACTIONS</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "12px" }}>
                  {filteredUsers.map((u) => {
                    const roleStyle = getRoleStyle(u.role);
                    return (
                      <tr key={u.id} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.04)" }}>
                        <td className="px-4 py-3" style={{ color: "#424245", fontFamily: "monospace", fontSize: "11px" }}>#{u.id.toString().padStart(3, '0')}</td>
                        <td className="py-3" style={{ fontWeight: "600", color: "#1d1d1f" }}>{u.username}</td>
                        <td className="py-3" style={{ color: "#424245" }}>{u.email}</td>
                        <td className="py-3">
                          <span style={{ 
                              padding: "4px 12px", 
                              borderRadius: "100px", 
                              backgroundColor: roleStyle.bg, 
                              color: roleStyle.color, 
                              fontSize: "10px", 
                              fontWeight: "700",
                              textTransform: "uppercase",
                              letterSpacing: "0.02em"
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td className="text-end px-4 py-3">
                          <button className="btn-macos btn-macos-secondary me-2" style={{ padding: "4px 8px", background: "rgba(255,255,255,0.4)" }} onClick={() => { setEditingId(u.id); setForm({username: u.username, email: u.email, role: u.role, password: ""}); setShowForm(true); }}>
                            <Pencil size={12} color="#007aff" />
                          </button>
                          <button className="btn-macos btn-macos-secondary" style={{ padding: "4px 8px", background: "rgba(255,255,255,0.4)" }} onClick={() => { if(window.confirm("Permanently remove this user's system access?")) api.delete(`/api/users/${u.id}`, { headers: { Authorization: `Bearer ${token}` } }).then(fetchUsers); }}>
                            <Trash2 size={12} color="#ff3b30" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Users;