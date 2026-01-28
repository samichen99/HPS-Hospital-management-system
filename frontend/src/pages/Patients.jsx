import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";
import { Search, UserPlus, Pencil, Trash2, X } from "lucide-react";

function Patients() {
  const { token, logout } = useContext(AuthContext);

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    address: "",
    insurance_number: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchPatients = async () => {
    try {
      const res = await api.get("/api/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPatients();
  }, [token]);

  // Real-time dynamic filtering logic
  const filteredPatients = patients.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.full_name.toLowerCase().includes(term) ||
      (p.insurance_number && p.insurance_number.toLowerCase().includes(term)) ||
      p.phone.includes(term)
    );
  });

  const openCreateForm = () => {
    setEditingId(null);
    setForm({ full_name: "", date_of_birth: "", gender: "", phone: "", address: "", insurance_number: "" });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/patients/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/api/patients", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowForm(false);
      setEditingId(null);
      fetchPatients();
    } catch (err) {
      console.error(err);
    }
  };

  const editPatient = (patient) => {
    setEditingId(patient.id);
    setForm({
      full_name: patient.full_name,
      date_of_birth: patient.date_of_birth,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address,
      insurance_number: patient.insurance_number || "",
    });
    setShowForm(true);
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    try {
      await api.delete(`/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(patients.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: "40px", color: "#86868b", fontSize: "13px" }}>Loading patient records...</div>;

  return (
    <div style={{ backgroundColor: "#f1f1f1ff", minHeight: "100vh", padding: "40px", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
      <header className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", margin: 0 }}>Patients Management</h2>
          <p style={{ color: "#86868b", fontSize: "14px", margin: "2px 0 0 0" }}>Registry of medical records and contact info</p>
        </div>
        
        <div className="d-flex gap-2">
            <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#86868b' }} />
                <input
                className="form-control"
                style={{ paddingLeft: '32px', width: '220px', fontSize: "13px" }}
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button className="btn-macos btn-macos-primary" onClick={openCreateForm}>
              <UserPlus size={14} style={{ marginRight: "6px" }} /> Add Patient
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
                {editingId ? "Modify Patient Record" : "Register New Patient"}
            </h5>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#86868b', cursor: 'pointer' }}>
                <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>LEGAL FULL NAME</label>
                <input type="text" className="form-control" style={{ fontSize: "13px" }} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>BIRTH DATE</label>
                <input type="date" className="form-control" style={{ fontSize: "13px" }} value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>GENDER</label>
                <select className="form-select" style={{ fontSize: "13px" }} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>CONTACT PHONE</label>
                <input type="text" className="form-control" style={{ fontSize: "13px" }} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>RESIDENTIAL ADDRESS</label>
                <input type="text" className="form-control" style={{ fontSize: "13px" }} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>INSURANCE POLICY #</label>
                <input type="text" className="form-control" style={{ fontSize: "13px" }} value={form.insurance_number} onChange={(e) => setForm({ ...form, insurance_number: e.target.value })} />
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button type="button" className="btn-macos btn-macos-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-macos btn-macos-primary">
                {editingId ? "Update Record" : "Register Patient"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: "0", border: "1px solid rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)", background: "rgba(255, 255, 255, 0.3)" }}>
            <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>All Patient Records</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-macos m-0">
            <thead>
              <tr style={{ color: "#86868b", fontSize: "11px" }}>
                <th className="px-4 py-3">ID</th>
                <th className="py-3">NAME</th>
                <th className="py-3">DOB</th>
                <th className="py-3">GENDER</th>
                <th className="py-3">PHONE</th>
                <th className="py-3">INSURANCE</th>
                <th className="text-end px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "13px" }}>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <tr key={p.id} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.02)" }}>
                    <td className="px-4 py-3" style={{ color: "#86868b", fontSize: "12px", fontFamily: "monospace" }}>#{p.id}</td>
                    <td className="py-3" style={{ fontWeight: "600", color: "#1d1d1f" }}>{p.full_name}</td>
                    <td className="py-3">{p.date_of_birth}</td>
                    <td className="py-3">{p.gender}</td>
                    <td className="py-3" style={{ color: "#424245" }}>{p.phone}</td>
                    <td className="py-3">
                      <span style={{ color: p.insurance_number ? "#1d1d1f" : "#86868b", fontSize: '12px' }}>
                          {p.insurance_number || "None"}
                      </span>
                    </td>
                    <td className="text-end px-4 py-3">
                      <button className="btn-macos btn-macos-secondary me-2" style={{ padding: "4px 8px", minWidth: '32px' }} onClick={() => editPatient(p)}>
                        <Pencil size={13} color="#007aff" />
                      </button>
                      <button className="btn-macos btn-macos-secondary" style={{ padding: "4px 8px", minWidth: '32px' }} onClick={() => deletePatient(p.id)}>
                        <Trash2 size={13} color="#ff3b30" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5" style={{ color: "#86868b" }}>
                    {search ? `No records found for "${search}"` : "No active patient records found."}
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

export default Patients;