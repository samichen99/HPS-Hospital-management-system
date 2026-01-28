import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";
import { Search, FilePlus, Pencil, Trash2, X, ClipboardList } from "lucide-react";

const emptyForm = {
  patientId: "",
  doctorId: "",
  diagnosis: "",
  prescription: "",
};

function MedicalRecords() {
  const { token, logout } = useContext(AuthContext);

  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const [recordsRes, patientsRes, doctorsRes] = await Promise.all([
        api.get("/api/medical-records", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/api/patients", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/api/doctors", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setRecords(recordsRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Dynamic filtering logic for real-time search
  const filteredRecords = records.filter((r) => {
    const term = search.toLowerCase();
    const patientName = (r.patientFullName || r.patient_full_name || "").toLowerCase();
    const doctorName = (r.doctorFullName || r.doctor_full_name || "").toLowerCase();
    const diagnosis = (r.diagnosis || "").toLowerCase();

    return (
      patientName.includes(term) ||
      doctorName.includes(term) ||
      diagnosis.includes(term) ||
      r.id.toString().includes(term)
    );
  });

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/medical-records/${editingId}`, 
          { diagnosis: form.diagnosis, prescription: form.prescription },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await api.post("/api/medical-records", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const editRecord = (record) => {
    setEditingId(record.id);
    setForm({
      patientId: record.patientId,
      doctorId: record.doctorId,
      diagnosis: record.diagnosis,
      prescription: record.prescription,
    });
    setShowForm(true);
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this medical record?")) return;
    try {
      await api.delete(`/api/medical-records/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(records.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: "40px", color: "#86868b", fontSize: "13px" }}>Loading patient history...</div>;

  return (
    <div style={{ backgroundColor: "#f1f1f1ff", minHeight: "100vh", padding: "40px", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
      <header className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", margin: 0 }}>Medical Records</h2>
          <p style={{ color: "#86868b", fontSize: "14px", margin: "2px 0 0 0" }}>Clinical documentation and prescription tracking</p>
        </div>
        
        <div className="d-flex gap-2">
            <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#86868b' }} />
                <input
                className="form-control"
                style={{ paddingLeft: '32px', width: '220px', fontSize: "13px" }}
                placeholder="Search history..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button className="btn-macos btn-macos-primary" onClick={openCreateForm}>
              <FilePlus size={14} style={{ marginRight: "6px" }} /> Create Record
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
                {editingId ? "Edit Medical Entry" : "New Clinical Entry"}
            </h5>
            <button onClick={() => {setShowForm(false); setEditingId(null);}} style={{ background: 'none', border: 'none', color: '#86868b', cursor: 'pointer' }}>
                <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>PATIENT</label>
                <select className="form-select" style={{ fontSize: "13px" }} value={form.patientId} disabled={!!editingId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} required>
                  <option value="">Select patient</option>
                  {patients.map((p) => (<option key={p.id} value={p.id}>{p.fullName || p.full_name}</option>))}
                </select>
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>ATTENDING DOCTOR</label>
                <select className="form-select" style={{ fontSize: "13px" }} value={form.doctorId} disabled={!!editingId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required>
                  <option value="">Select doctor</option>
                  {doctors.map((d) => (<option key={d.id} value={d.id}>{d.fullName || d.full_name}</option>))}
                </select>
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>DIAGNOSIS</label>
                <input type="text" className="form-control" style={{ fontSize: "13px" }} value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>PRESCRIPTION / TREATMENT</label>
                <input type="text" className="form-control" style={{ fontSize: "13px" }} value={form.prescription} onChange={(e) => setForm({ ...form, prescription: e.target.value })} required />
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button type="button" className="btn-macos btn-macos-secondary" onClick={() => {setShowForm(false); setEditingId(null);}}>Cancel</button>
              <button type="submit" className="btn-macos btn-macos-primary">
                {editingId ? "Save Changes" : "Finalize Record"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: "0", border: "1px solid rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)", background: "rgba(255, 255, 255, 0.3)" }}>
            <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>Clinical History Logs</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-macos m-0">
            <thead>
              <tr style={{ color: "#86868b", fontSize: "11px" }}>
                <th className="px-4 py-3">#ID</th>
                <th className="py-3">PATIENT</th>
                <th className="py-3">DOCTOR</th>
                <th className="py-3">DIAGNOSIS</th>
                <th className="py-3">PRESCRIPTION</th>
                <th className="text-end px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "13px" }}>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => (
                  <tr key={r.id} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.02)" }}>
                    <td className="px-4 py-3" style={{ color: "#86868b", fontSize: "12px", fontFamily: "monospace" }}>#{r.id}</td>
                    <td className="py-3" style={{ fontWeight: "600", color: "#1d1d1f" }}>{r.patientFullName || r.patient_full_name}</td>
                    <td className="py-3" style={{ color: "#424245" }}>Dr. {r.doctorFullName || r.doctor_full_name}</td>
                    <td className="py-3">
                        <span style={{ backgroundColor: "rgba(0,0,0,0.04)", padding: "2px 6px", borderRadius: "4px" }}>{r.diagnosis}</span>
                    </td>
                    <td className="py-3" style={{ color: "#86868b", fontStyle: "italic" }}>{r.prescription}</td>
                    <td className="text-end px-4 py-3">
                      <button className="btn-macos btn-macos-secondary me-2" style={{ padding: "4px 8px" }} onClick={() => editRecord(r)}>
                        <Pencil size={13} color="#007aff" />
                      </button>
                      <button className="btn-macos btn-macos-secondary" style={{ padding: "4px 8px" }} onClick={() => deleteRecord(r.id)}>
                        <Trash2 size={13} color="#ff3b30" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5" style={{ color: "#86868b" }}>
                    {search ? `No records matching "${search}"` : "No clinical records available."}
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

export default MedicalRecords;