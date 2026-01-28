import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";
import { Upload, Trash2, X, FileText, Download, HardDrive, Search } from "lucide-react";

function Files() {
  const { token, logout } = useContext(AuthContext);

  const [files, setFiles] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    description: "",
    file: null,
  });

  const fetchFiles = async () => {
    try {
      const res = await api.get("/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err.response?.status === 401) logout();
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get("/api/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/api/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFiles();
      fetchPatients();
      fetchDoctors();
    }
  }, [token]);

  const filteredFiles = files.filter((f) => {
    const term = search.toLowerCase();
    // Added safety checks (?. and || "") to prevent "toLowerCase of undefined" errors
    const nameMatch = (f?.file_name || "").toLowerCase().includes(term);
    const patientMatch = (f?.patient_full_name || "").toLowerCase().includes(term);
    const descMatch = (f?.description || "").toLowerCase().includes(term);
    return nameMatch || patientMatch || descMatch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) return alert("Please select a file");

    const data = new FormData();
    data.append("file", form.file);
    data.append("patient_id", form.patientId);
    data.append("doctor_id", form.doctorId);
    data.append("description", form.description);

    try {
      await api.post("/api/files/upload", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setForm({ patientId: "", doctorId: "", description: "", file: null });
      setShowForm(false);
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFile = async (id) => {
    if (!window.confirm("Delete this file permanently?")) return;
    try {
      await api.delete(`/api/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(files.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: "40px", color: "#86868b", fontSize: "13px" }}>Loading file repository...</div>;

  return (
    <div style={{ backgroundColor: "#f1f1f1ff", minHeight: "100vh", padding: "40px", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
      <header className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", margin: 0 }}>Files Management</h2>
          <p style={{ color: "#86868b", fontSize: "14px", margin: "2px 0 0 0" }}>Secure storage for medical imaging and documents</p>
        </div>
        
        <div className="d-flex gap-2">
            <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#86868b' }} />
                <input
                className="form-control"
                style={{ paddingLeft: '32px', width: '220px', fontSize: "13px" }}
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button className="btn-macos btn-macos-primary" onClick={() => setShowForm(true)}>
              <Upload size={14} style={{ marginRight: "6px" }} /> Upload Document
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
            <h5 style={{ margin: 0, fontWeight: "600", fontSize: "15px", color: "#1d1d1f" }}>File Upload Portal</h5>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#86868b', cursor: 'pointer' }}>
                <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>ASSOCIATED PATIENT</label>
                <select className="form-select" style={{ fontSize: "13px" }} value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} required>
                  <option value="">Select patient</option>
                  {patients.map((p) => (<option key={p.id} value={p.id}>{p.full_name || p.fullName}</option>))}
                </select>
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>REFERRING DOCTOR</label>
                <select className="form-select" style={{ fontSize: "13px" }} value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required>
                  <option value="">Select doctor</option>
                  {doctors.map((d) => (<option key={d.id} value={d.id}>{d.full_name || d.fullName}</option>))}
                </select>
              </div>
              <div className="col-md-12">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>FILE DESCRIPTION</label>
                <input type="text" className="form-control" style={{ fontSize: "13px" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g., Chest X-Ray, Lab Results..." />
              </div>
              <div className="col-md-12">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>SELECT FILE</label>
                <input type="file" className="form-control" style={{ fontSize: "13px" }} onChange={(e) => setForm({ ...form, file: e.target.files[0] })} required />
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button type="button" className="btn-macos btn-macos-secondary" onClick={() => {setShowForm(false);}}>Cancel</button>
              <button type="submit" className="btn-macos btn-macos-primary">Start Upload</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: "0", border: "1px solid rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)", background: "rgba(255, 255, 255, 0.3)" }}>
            <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>Document Directory</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-macos m-0">
            <thead>
              <tr style={{ color: "#86868b", fontSize: "11px" }}>
                <th className="px-4 py-3">NAME</th>
                <th className="py-3">PATIENT</th>
                <th className="py-3">DOCTOR</th>
                <th className="py-3">DESCRIPTION</th>
                <th className="text-end px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "13px" }}>
              {filteredFiles.length > 0 ? (
                filteredFiles.map((f) => (
                  <tr key={f.id} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.02)" }}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <FileText size={16} color="#007aff" style={{ marginRight: "10px" }} />
                        <span style={{ fontWeight: "500", color: "#1d1d1f" }}>{f.file_name}</span>
                      </div>
                    </td>
                    <td className="py-3" style={{ color: "#424245" }}>{f.patient_full_name}</td>
                    <td className="py-3" style={{ color: "#424245" }}>{f.doctor_full_name}</td>
                    <td className="py-3" style={{ color: "#86868b" }}>{f.description}</td>
                    <td className="text-end px-4 py-3">
                      <a href={`/api/files/download/${f.id}`} className="btn-macos btn-macos-secondary me-2" style={{ padding: "4px 8px", display: 'inline-flex', alignItems: 'center' }}>
                        <Download size={13} color="#28c840" />
                      </a>
                      <button className="btn-macos btn-macos-secondary" style={{ padding: "4px 8px" }} onClick={() => deleteFile(f.id)}>
                        <Trash2 size={13} color="#ff3b30" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5" style={{ color: "#86868b" }}>
                    {search ? (
                        <>No results found for "{search}"</>
                    ) : (
                        <>
                            <HardDrive size={32} style={{ opacity: 0.2, marginBottom: '10px' }} /><br/>
                            The file repository is currently empty.
                        </>
                    )}
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

export default Files;