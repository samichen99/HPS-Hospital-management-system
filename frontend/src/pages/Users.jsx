import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";
import { Search, UserPlus, Pencil, Trash2, X } from "lucide-react";

function Users() {
  const { token, logout } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
  });

  const [editingId, setEditingId] = useState(null);

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

  // Dynamic filtering logic
  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  });

  const openCreateForm = () => {
    setEditingId(null);
    setForm({ username: "", email: "", role: "", password: "" });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/api/users/${editingId}`, 
          {
            ...form,
            ...(form.password === "" && { password: undefined })
          }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await api.post("/api/users", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowForm(false);
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setError("Operation failed");
    }
  };

  const editUser = (user) => {
    setEditingId(user.id);
    setForm({
      username: user.username,
      email: user.email,
      role: user.role,
      password: "",
    });
    setShowForm(true);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      setError("Delete failed");
    }
  };

  if (loading) return <div style={{ padding: "40px", color: "#86868b", fontSize: "13px" }}>Loading system users...</div>;

  return (
    <div style={{ backgroundColor: "#f1f1f1ff", minHeight: "100vh", padding: "40px", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
      <header className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", margin: 0 }}>Users Management</h2>
          <p style={{ color: "#86868b", fontSize: "14px", margin: "2px 0 0 0" }}>Manage hospital staff and permissions</p>
        </div>
        
        <div className="d-flex gap-2">
            <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#86868b' }} />
                <input
                className="form-control"
                style={{ paddingLeft: '32px', width: '220px', fontSize: "13px" }}
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button className="btn-macos btn-macos-primary" onClick={openCreateForm}>
              <UserPlus size={14} style={{ marginRight: "6px" }} /> Add User
            </button>
        </div>
      </header>

      {error && (
        <div className="alert mb-4" style={{ fontSize: "12px", borderRadius: "8px", backgroundColor: "rgba(255, 59, 48, 0.1)", border: "1px solid rgba(255, 59, 48, 0.2)", color: "#ff3b30" }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="glass-card mb-5" style={{ 
            border: "1px solid rgba(0, 122, 255, 0.3)", 
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
        }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 style={{ margin: 0, fontWeight: "600", fontSize: "15px", color: "#1d1d1f" }}>
                {editingId ? "Modify User Account" : "Register New Users"}
            </h5>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#86868b', cursor: 'pointer' }}>
                <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>USERNAME</label>
                <input type="text" className="form-control" style={{ fontSize: "13px" }} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>EMAIL ADDRESS</label>
                <input type="email" className="form-control" style={{ fontSize: "13px" }} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>ASSIGNED ROLE</label>
                <select className="form-select" style={{ fontSize: "13px" }} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required>
                  <option value="">Select</option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </div>
              <div className="col-md-3">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>PASSWORD</label>
                <input type="password" className="form-control" style={{ fontSize: "13px" }} placeholder={editingId ? "Leave blank to keep" : "Enter password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} />
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button type="button" className="btn-macos btn-macos-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-macos btn-macos-primary">
                {editingId ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: "0", border: "1px solid rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)", background: "rgba(255, 255, 255, 0.3)" }}>
            <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>System Access Directory</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-macos m-0">
            <thead>
              <tr style={{ color: "#86868b", fontSize: "11px" }}>
                <th className="px-4 py-3">ID</th>
                <th className="py-3">USERNAME</th>
                <th className="py-3">EMAIL</th>
                <th className="py-3">ROLE</th>
                <th className="py-3">DATE JOINED</th>
                <th className="text-end px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "13px" }}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.02)" }}>
                    <td className="px-4 py-3" style={{ color: "#86868b", fontSize: "12px", fontFamily: "monospace" }}>#{u.id}</td>
                    <td className="py-3" style={{ fontWeight: "600", color: "#1d1d1f" }}>{u.username}</td>
                    <td className="py-3" style={{ color: "#424245" }}>{u.email}</td>
                    <td className="py-3">
                        <span style={{ 
                            padding: "3px 10px", 
                            borderRadius: "100px", 
                            backgroundColor: "rgba(0, 122, 255, 0.1)", 
                            color: "#007aff", 
                            fontSize: "11px", 
                            fontWeight: "600",
                            textTransform: "capitalize"
                        }}>
                        {u.role}
                        </span>
                    </td>
                    <td className="py-3" style={{ color: "#86868b" }}>
                        {u.creation_date ? new Date(u.creation_date).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="text-end px-4 py-3">
                      <button className="btn-macos btn-macos-secondary me-2" style={{ padding: "4px 8px", minWidth: '32px' }} onClick={() => editUser(u)}>
                        <Pencil size={13} color="#007aff" />
                      </button>
                      <button className="btn-macos btn-macos-secondary" style={{ padding: "4px 8px", minWidth: '32px' }} onClick={() => deleteUser(u.id)}>
                        <Trash2 size={13} color="#ff3b30" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5" style={{ color: "#86868b" }}>
                    {search ? `No results found for "${search}"` : "No system users found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;