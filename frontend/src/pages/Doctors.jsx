import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";
import { Search, UserPlus, Pencil, Trash2, X, Stethoscope } from "lucide-react";

function Doctors() {
  const { token, logout } = useContext(AuthContext);

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    user_id: "",
    full_name: "",
    speciality: "",
    phone: "",
    status: true,
  });

  const [editingId, setEditingId] = useState(null);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/api/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDoctors();
  }, [token]);

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchDoctors();
      return;
    }
    try {
      const res = await api.get(`/api/doctors/search?name=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/doctors/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/api/doctors", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      resetForm();
      setShowForm(false);
      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setForm({
      user_id: "",
      full_name: "",
      speciality: "",
      phone: "",
      status: true,
    });
    setEditingId(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const editDoctor = (doctor) => {
    setEditingId(doctor.id);
    setForm({
      user_id: doctor.user_id,
      full_name: doctor.full_name,
      speciality: doctor.speciality,
      phone: doctor.phone,
      status: doctor.status,
    });
    setShowForm(true);
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    try {
      await api.delete(`/api/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(doctors.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: "40px", color: "#86868b", fontSize: "13px" }}>Loading medical staff...</div>;

  return (
    <div style={{ backgroundColor: "#f1f1f1ff", minHeight: "100vh", padding: "40px", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
      <header className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", margin: 0 }}>Doctors Management</h2>
          <p style={{ color: "#86868b", fontSize: "14px", margin: "2px 0 0 0" }}>Manage practitioner profiles and availability</p>
        </div>
        
        <div className="d-flex gap-2">
            <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#86868b' }} />
                <input
                  className="form-control"
                  style={{ paddingLeft: '32px', width: '220px', fontSize: "13px" }}
                  placeholder="Search name or speciality..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
            </div>
            <button className="btn-macos btn-macos-primary" onClick={openCreateForm}>
              <Stethoscope size={14} style={{ marginRight: "6px" }} /> Add Doctor
            </button>
        </div>
      </header>

      {showForm && (
        <div className="glass-card mb-5" style={{ 
            border: "1px solid rgba(0, 122, 255, 0.3)", 
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
        }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 style={{ margin: 0, fontWeight: "600", fontSize: "15px", color: "#1d1d1f" }}>
                {editingId ? "Modify Doctor Profile" : "Register New Practitioner"}
            </h5>
            <button onClick={() => {setShowForm(false); resetForm();}} style={{ background: 'none', border: 'none', color: '#86868b', cursor: 'pointer' }}>
                <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-2">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>USER ID</label>
                <input type="number" className="form-control" style={{ fontSize: "13px" }} value={form.user_id} onChange={(e) => setForm({ ...form, user_id: Number(e.target.value) })} required />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>FULL NAME</label>
                <input type="text" className="form-control" style={{ fontSize: "13px" }} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>SPECIALITY</label>
                <input type="text" className="form-control" style={{ fontSize: "13px" }} value={form.speciality} onChange={(e) => setForm({ ...form, speciality: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>CONTACT PHONE</label>
                <input type="text" className="form-control" style={{ fontSize: "13px" }} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>EMPLOYMENT STATUS</label>
                <select className="form-select" style={{ fontSize: "13px" }} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value === "true" })}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button type="button" className="btn-macos btn-macos-secondary" onClick={() => {setShowForm(false); resetForm();}}>Cancel</button>
              <button type="submit" className="btn-macos btn-macos-primary">
                {editingId ? "Update Doctor" : "Add Practitioner"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: "0", border: "1px solid rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)", background: "rgba(255, 255, 255, 0.3)" }}>
            <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>Medical Staff Directory</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-macos m-0">
            <thead>
              <tr style={{ color: "#86868b", fontSize: "11px" }}>
                <th className="px-4 py-3">ID</th>
                <th className="py-3">FULL NAME</th>
                <th className="py-3">SPECIALITY</th>
                <th className="py-3">PHONE</th>
                <th className="py-3">STATUS</th>
                <th className="text-end px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "13px" }}>
              {doctors.length > 0 ? (
                doctors.map((d) => (
                  <tr key={d.id} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.02)" }}>
                    <td className="px-4 py-3" style={{ color: "#86868b", fontSize: "12px", fontFamily: "monospace" }}>#{d.id}</td>
                    <td className="py-3" style={{ fontWeight: "600", color: "#1d1d1f" }}>{d.full_name}</td>
                    <td className="py-3" style={{ color: "#424245" }}>{d.speciality}</td>
                    <td className="py-3">{d.phone}</td>
                    <td className="py-3">
                      <span style={{ 
                        padding: "3px 10px", 
                        borderRadius: "100px", 
                        backgroundColor: d.status ? "rgba(40, 200, 64, 0.1)" : "rgba(142, 142, 147, 0.1)", 
                        color: d.status ? "#28c840" : "#8e8e93", 
                        fontSize: "11px", 
                        fontWeight: "600" 
                      }}>
                        {d.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-end px-4 py-3">
                      <button className="btn-macos btn-macos-secondary me-2" style={{ padding: "4px 8px", minWidth: '32px' }} onClick={() => editDoctor(d)}>
                        <Pencil size={13} color="#007aff" />
                      </button>
                      <button className="btn-macos btn-macos-secondary" style={{ padding: "4px 8px", minWidth: '32px' }} onClick={() => deleteDoctor(d.id)}>
                        <Trash2 size={13} color="#ff3b30" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5" style={{ color: "#86868b" }}>No practitioner records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Doctors;