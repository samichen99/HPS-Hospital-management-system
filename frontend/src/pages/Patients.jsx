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

  if (loading) return <div style={{ padding: "40px", color: "#424245", fontSize: "13px" }}>Loading patient records...</div>;

  return (
    <div style={mainContainerStyle}>
      <header className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", marginBottom: "2px" }}>Patients Management</h2>
          <p style={{ color: "#424245", fontSize: "14px", margin: 0 }}>Registry of medical records and contact info</p>
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
                placeholder="Search records..."
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
            border: "1px solid rgba(255, 255, 255, 0.3)", 
            backgroundColor: "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(30px) saturate(180%)",
            padding: "24px"
        }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 style={{ margin: 0, fontWeight: "600", fontSize: "15px" }}>
                {editingId ? "Modify Patient Record" : "Register New Patient"}
            </h5>
            <X size={18} style={{ cursor: "pointer", color: "#424245" }} onClick={() => setShowForm(false)} />
          </div>
          
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Legal Full Name</label>
              <input type="text" className="form-control" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
            </div>
            <div className="col-md-3">
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Birth Date</label>
              <input type="date" className="form-control" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} required />
            </div>
            <div className="col-md-3">
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Gender</label>
              <select className="form-select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="col-md-4">
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Contact Phone</label>
              <input type="text" className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div className="col-md-4">
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Residential Address</label>
              <input type="text" className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div className="col-md-4">
              <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Insurance Policy #</label>
              <input type="text" className="form-control" value={form.insurance_number} onChange={(e) => setForm({ ...form, insurance_number: e.target.value })} />
            </div>
            <div className="col-12 d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn-macos btn-macos-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-macos btn-macos-primary">
                {editingId ? "Update Record" : "Register Patient"}
              </button>
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
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)", background: "rgba(255, 255, 255, 0.1)" }}>
            <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>All Patient Records</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-borderless m-0">
            <thead>
              <tr style={{ color: "#424245", fontSize: "11px", letterSpacing: "0.02em" }}>
                <th className="px-4 py-3 font-weight-normal">ID</th>
                <th className="py-3 font-weight-normal">NAME</th>
                <th className="py-3 font-weight-normal">DOB</th>
                <th className="py-3 font-weight-normal">GENDER</th>
                <th className="py-3 font-weight-normal">PHONE</th>
                <th className="py-3 font-weight-normal">INSURANCE</th>
                <th className="text-end px-4 py-3 font-weight-normal">ACTIONS</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "13px" }}>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <tr key={p.id} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.04)" }}>
                    <td className="px-4 py-3" style={{ color: "#424245", fontSize: "12px", fontFamily: "monospace" }}>#{p.id}</td>
                    <td className="py-3" style={{ fontWeight: "600", color: "#1d1d1f" }}>{p.full_name}</td>
                    <td className="py-3" style={{ color: "#424245" }}>{p.date_of_birth}</td>
                    <td className="py-3" style={{ color: "#424245" }}>{p.gender}</td>
                    <td className="py-3" style={{ color: "#424245" }}>{p.phone}</td>
                    <td className="py-3">
                      <span style={{ 
                        color: p.insurance_number ? "#1d1d1f" : "#424245", 
                        opacity: p.insurance_number ? 1 : 0.5,
                        fontSize: '12px' 
                      }}>
                        {p.insurance_number || "None"}
                      </span>
                    </td>
                    <td className="text-end px-4 py-3">
                      <button className="btn-macos btn-macos-secondary me-2" style={{ padding: "4px 8px", background: "rgba(255,255,255,0.4)" }} onClick={() => editPatient(p)}>
                        <Pencil size={12} color="#007aff" />
                      </button>
                      <button className="btn-macos btn-macos-secondary" style={{ padding: "4px 8px", background: "rgba(255,255,255,0.4)" }} onClick={() => deletePatient(p.id)}>
                        <Trash2 size={12} color="#ff3b30" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5" style={{ color: "#424245" }}>
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