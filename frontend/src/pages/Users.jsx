import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";
import { UserPlus, Pencil, Trash2, X } from "lucide-react";

function Users() {
  const { token, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      if (error.response?.status === 401) logout();
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const openCreateForm = () => {
    setEditingUser(null);
    setFormData({ username: "", email: "", role: "", password: "" });
    setShowForm(true);
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingUser) {
        await api.put(`/api/users/${editingUser.id}`,
          {
            username: formData.username,
            email: formData.email,
            role: formData.role,
            ...(formData.password && { password: formData.password }),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await api.post("/api/users", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowForm(false);
      fetchUsers();
    } catch (error) {
      setError("Operation failed");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
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
        <button className="btn-macos btn-macos-primary" onClick={openCreateForm}>
          <UserPlus size={14} style={{ marginRight: "6px" }} /> Add User
        </button>
      </header>

      {error && (
        <div className="alert" style={{ 
          fontSize: "13px", 
          borderRadius: "10px", 
          backgroundColor: "rgba(255, 59, 48, 0.1)", 
          border: "1px solid rgba(255, 59, 48, 0.2)", 
          color: "#ff3b30",
          marginBottom: "20px"
        }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="glass-card mb-5" style={{ 
            border: "1px solid rgba(0, 122, 255, 0.3)", 
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
        }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 style={{ margin: 0, fontWeight: "600", fontSize: "15px", color: "#1d1d1f" }}>
                {editingUser ? "Edit User Account" : "Create New Account"}
            </h5>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#86868b', cursor: 'pointer' }}>
                <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>USERNAME</label>
              <input className="form-control" placeholder="e.g. jdoe" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
            </div>
            <div className="col-md-3">
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>EMAIL ADDRESS</label>
              <input type="email" className="form-control" placeholder="name@hospital.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
            <div className="col-md-3">
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>ASSIGNED ROLE</label>
              <select className="form-select" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>
            <div className="col-md-3">
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>SECURITY</label>
              <input type="password" className="form-control" placeholder={editingUser ? "Update password (optional)" : "Set password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editingUser} />
            </div>
            <div className="col-12 d-flex gap-2 justify-content-end mt-4">
              <button type="button" className="btn-macos btn-macos-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-macos btn-macos-primary">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: "0", border: "1px solid rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
        <table className="table table-macos m-0">
          <thead>
            <tr style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}>
              <th className="px-4 py-3" style={{ color: "#86868b", fontWeight: "500", fontSize: "11px" }}>ID</th>
              <th className="py-3" style={{ color: "#86868b", fontWeight: "500", fontSize: "11px" }}>USERNAME</th>
              <th className="py-3" style={{ color: "#86868b", fontWeight: "500", fontSize: "11px" }}>EMAIL ADDRESS</th>
              <th className="py-3" style={{ color: "#86868b", fontWeight: "500", fontSize: "11px" }}>ROLE</th>
              <th className="py-3" style={{ color: "#86868b", fontWeight: "500", fontSize: "11px" }}>DATE JOINED</th>
              <th className="text-end px-4 py-3" style={{ color: "#86868b", fontWeight: "500", fontSize: "11px" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "13px" }}>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.02)" }}>
                  <td className="px-4 py-3" style={{ color: "#86868b", fontSize: "12px", fontFamily: "monospace" }}>#{user.id}</td>
                  <td className="py-3" style={{ fontWeight: "600", color: "#1d1d1f" }}>{user.username}</td>
                  <td className="py-3" style={{ color: "#424245" }}>{user.email}</td>
                  <td className="py-3">
                    <span style={{ 
                        padding: "3px 10px", 
                        borderRadius: "100px", 
                        backgroundColor: "rgba(0, 122, 255, 0.1)", 
                        color: "#007aff", 
                        fontSize: "11px", 
                        fontWeight: "600"
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3" style={{ color: "#86868b" }}>
                    {user.creation_date ? new Date(user.creation_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
                  </td>
                  <td className="text-end px-4 py-3">
                    <button className="btn-macos btn-macos-secondary me-2" style={{ padding: "4px 8px", minWidth: "32px" }} onClick={() => openEditForm(user)}>
                      <Pencil size={14} color="#007aff" />
                    </button>
                    <button className="btn-macos btn-macos-secondary" style={{ padding: "4px 8px", minWidth: "32px" }} onClick={() => deleteUser(user.id)}>
                      <Trash2 size={14} color="#ff3b30" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5" style={{ color: "#86868b" }}>No active staff found in database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;