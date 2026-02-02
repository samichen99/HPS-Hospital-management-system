import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";
import { Calendar, Pencil, Trash2, X, CheckCircle, Search } from "lucide-react";

function Appointments() {
  const { token, logout } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    status: "scheduled",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token]);

  const filteredAppointments = appointments.filter((a) => {
    const term = search.toLowerCase();
    return (
      a.patient_id.toString().includes(term) ||
      a.doctor_id.toString().includes(term) ||
      (a.notes && a.notes.toLowerCase().includes(term)) ||
      a.status.toLowerCase().includes(term)
    );
  });

  const resetForm = () => {
    setForm({
      patient_id: "",
      doctor_id: "",
      appointment_date: "",
      status: "scheduled",
      notes: "",
    });
    setEditingId(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/appointments/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/api/appointments", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      resetForm();
      setShowForm(false);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const editAppointment = (a) => {
    setEditingId(a.id);
    setForm({
      patient_id: a.patient_id,
      doctor_id: a.doctor_id,
      appointment_date: a.appointment_date?.slice(0, 16),
      status: a.status,
      notes: a.notes || "",
    });
    setShowForm(true);
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await api.delete(`/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(
        `/api/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return { bg: "rgba(40, 200, 64, 0.12)", color: "#28c840" };
      case 'cancelled': return { bg: "rgba(255, 59, 48, 0.12)", color: "#ff3b30" };
      default: return { bg: "rgba(0, 122, 255, 0.12)", color: "#007aff" };
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

  if (loading) return <div style={{ padding: "40px", color: "#424245", fontSize: "13px" }}>Loading clinical schedule...</div>;

  return (
    <div style={mainContainerStyle}>
      <header className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", marginBottom: "2px" }}>Appointments Management</h2>
          <p style={{ color: "#424245", fontSize: "14px", margin: 0 }}>Schedule and monitor patient visits</p>
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
                placeholder="Search visits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button className="btn-macos btn-macos-primary" onClick={openCreateForm}>
              <Calendar size={14} style={{ marginRight: "6px" }} /> New Appointment
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
                {editingId ? "Edit Appointment Detail" : "Schedule New Visit"}
            </h5>
            <X size={18} style={{ cursor: "pointer", color: "#424245" }} onClick={() => {setShowForm(false); resetForm();}} />
          </div>
          
          <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-2">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Patient ID</label>
                <input type="number" className="form-control" value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: Number(e.target.value) })} required />
              </div>
              <div className="col-md-2">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Doctor ID</label>
                <input type="number" className="form-control" value={form.doctor_id} onChange={(e) => setForm({ ...form, doctor_id: Number(e.target.value) })} required />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Date & Time</label>
                <input type="datetime-local" className="form-control" value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Visit Notes</label>
                <input type="text" className="form-control" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Reason for visit..." />
              </div>
              <div className="col-md-3">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Current Status</label>
                <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn-macos btn-macos-secondary" onClick={() => {setShowForm(false); resetForm();}}>Cancel</button>
                <button type="submit" className="btn-macos btn-macos-primary">
                  {editingId ? "Update Details" : "Confirm Schedule"}
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
            <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>Upcoming & Past Visits</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-borderless m-0">
            <thead>
              <tr style={{ color: "#424245", fontSize: "11px", letterSpacing: "0.02em" }}>
                <th className="px-4 py-3 font-weight-normal">#ID</th>
                <th className="py-3 font-weight-normal">PATIENT ID</th>
                <th className="py-3 font-weight-normal">DOCTOR ID</th>
                <th className="py-3 font-weight-normal">SCHEDULED FOR</th>
                <th className="py-3 font-weight-normal">STATUS</th>
                <th className="text-end px-4 py-3 font-weight-normal">ACTIONS</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "13px" }}>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((a) => {
                  const statusStyle = getStatusStyle(a.status);
                  return (
                    <tr key={a.id} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.04)" }}>
                      <td className="px-4 py-3" style={{ color: "#424245", fontSize: "12px", fontFamily: "monospace" }}>#{a.id}</td>
                      <td className="py-3" style={{ fontWeight: "600", color: "#1d1d1f" }}>P-{a.patient_id}</td>
                      <td className="py-3" style={{ fontWeight: "600", color: "#1d1d1f" }}>D-{a.doctor_id}</td>
                      <td className="py-3" style={{ color: "#424245" }}>{new Date(a.appointment_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                      <td className="py-3">
                        <span style={{ 
                          padding: "3px 10px", 
                          borderRadius: "100px", 
                          backgroundColor: statusStyle.bg, 
                          color: statusStyle.color, 
                          fontSize: "11px", 
                          fontWeight: "600",
                          textTransform: "capitalize"
                        }}>
                          {a.status}
                        </span>
                      </td>
                      <td className="text-end px-4 py-3">
                        {a.status === "scheduled" && (
                          <button className="btn-macos btn-macos-secondary me-2" style={{ padding: "4px 8px", background: "rgba(255,255,255,0.4)" }} onClick={() => updateStatus(a.id, "completed")}>
                            <CheckCircle size={12} color="#28c840" />
                          </button>
                        )}
                        <button className="btn-macos btn-macos-secondary me-2" style={{ padding: "4px 8px", background: "rgba(255,255,255,0.4)" }} onClick={() => editAppointment(a)}>
                          <Pencil size={12} color="#007aff" />
                        </button>
                        <button className="btn-macos btn-macos-secondary" style={{ padding: "4px 8px", background: "rgba(255,255,255,0.4)" }} onClick={() => deleteAppointment(a.id)}>
                          <Trash2 size={12} color="#ff3b30" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5" style={{ color: "#424245" }}>
                    {search ? `No results for "${search}"` : "No scheduled appointments found."}
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

export default Appointments;