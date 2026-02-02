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
    const nameMatch = (f?.file_name || f?.fileName || "").toLowerCase().includes(term);
    const patientMatch = (f?.patient_full_name || f?.patientFullName || "").toLowerCase().includes(term);
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

  if (loading) return <div style={{ padding: "40px", color: "#424245", fontSize: "13px" }}>Loading file repository...</div>;

  return (
    <div style={mainContainerStyle}>
      <header className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", marginBottom: "2px" }}>Files Management</h2>
          <p style={{ color: "#424245", fontSize: "14px", margin: 0 }}>Secure storage for medical imaging and documents</p>
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
            border: "1px solid rgba(255, 255, 255, 0.3)", 
            backgroundColor: "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(30px) saturate(180%)",
            padding: "24px"
        }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 style={{ margin: 0, fontWeight: "600", fontSize: "15px" }}>File Upload Portal</h5>
            <X size={18} style={{ cursor: "pointer", color: "#424245" }} onClick={() => setShowForm(false)} />
          </div>
          
          <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Associated Patient</label>
                <select className="form-select" value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} required>
                  <option value="">Select patient</option>
                  {patients.map((p) => (<option key={p.id} value={p.id}>{p.full_name || p.fullName}</option>))}
                </select>
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Referring Doctor</label>
                <select className="form-select" value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required>
                  <option value="">Select doctor</option>
                  {doctors.map((d) => (<option key={d.id} value={d.id}>{d.full_name || d.fullName}</option>))}
                </select>
              </div>
              <div className="col-md-12">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>File Description</label>
                <input type="text" className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g., Chest X-Ray, Lab Results..." />
              </div>
              <div className="col-md-12">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Select File</label>
                <input type="file" className="form-control" onChange={(e) => setForm({ ...form, file: e.target.files[0] })} required />
              </div>
              <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn-macos btn-macos-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-macos btn-macos-primary">Start Upload</button>
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
            <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>Document Directory</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-borderless m-0">
            <thead>
              <tr style={{ color: "#424245", fontSize: "11px", letterSpacing: "0.02em" }}>
                <th className="px-4 py-3 font-weight-normal">NAME</th>
                <th className="py-3 font-weight-normal">PATIENT</th>
                <th className="py-3 font-weight-normal">DOCTOR</th>
                <th className="py-3 font-weight-normal">DESCRIPTION</th>
                <th className="text-end px-4 py-3 font-weight-normal">ACTIONS</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "13px" }}>
              {filteredFiles.length > 0 ? (
                filteredFiles.map((f) => (
                  <tr key={f.id} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.04)" }}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <FileText size={16} color="#007aff" style={{ marginRight: "10px", opacity: 0.8 }} />
                        <span style={{ fontWeight: "600", color: "#1d1d1f" }}>{f.file_name || f.fileName}</span>
                      </div>
                    </td>
                    <td className="py-3" style={{ color: "#1d1d1f" }}>{f.patient_full_name || f.patientFullName}</td>
                    <td className="py-3" style={{ color: "#424245" }}>{f.doctor_full_name || f.doctorFullName}</td>
                    <td className="py-3" style={{ color: "#424245", fontSize: "12px" }}>{f.description}</td>
                    <td className="text-end px-4 py-3">
                      <a href={`/api/files/download/${f.id}`} className="btn-macos btn-macos-secondary me-2" style={{ padding: "4px 8px", background: "rgba(255,255,255,0.4)", display: 'inline-flex', alignItems: 'center' }}>
                        <Download size={12} color="#28c840" />
                      </a>
                      <button className="btn-macos btn-macos-secondary" style={{ padding: "4px 8px", background: "rgba(255,255,255,0.4)" }} onClick={() => deleteFile(f.id)}>
                        <Trash2 size={12} color="#ff3b30" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5" style={{ color: "#424245" }}>
                    {search ? (
                        <>No results found for "{search}"</>
                    ) : (
                        <div style={{ opacity: 0.6 }}>
                            <HardDrive size={32} style={{ marginBottom: '12px' }} /><br/>
                            The file repository is currently empty.
                        </div>
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