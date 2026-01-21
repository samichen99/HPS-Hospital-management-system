import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";
import { Calendar, Pencil, Trash2, X, CheckCircle, Clock } from "lucide-react";

function Appointments() {
  const { token, logout } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
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
      case 'completed': return { bg: "rgba(40, 200, 64, 0.1)", color: "#28c840" };
      case 'cancelled': return { bg: "rgba(255, 59, 48, 0.1)", color: "#ff3b30" };
      default: return { bg: "rgba(0, 122, 255, 0.1)", color: "#007aff" };
    }
  };

  if (loading) return <div style={{ padding: "40px", color: "#86868b", fontSize: "13px" }}>Loading clinical schedule...</div>;

  return (
    <div style={{ backgroundColor: "#f1f1f1ff", minHeight: "100vh", padding: "40px", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
      <header className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", margin: 0 }}>Appointments Management</h2>
          <p style={{ color: "#86868b", fontSize: "14px", margin: "2px 0 0 0" }}>Schedule and monitor patient visits</p>
        </div>
        
        <button className="btn-macos btn-macos-primary" onClick={openCreateForm}>
          <Calendar size={14} style={{ marginRight: "6px" }} /> New Appointment
        </button>
      </header>

      {showForm && (
        <div className="glass-card mb-5" style={{ 
            border: "1px solid rgba(0, 122, 255, 0.3)", 
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
        }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 style={{ margin: 0, fontWeight: "600", fontSize: "15px", color: "#1d1d1f" }}>
                {editingId ? "Edit Appointment Detail" : "Schedule New Visit"}
            </h5>
            <button onClick={() => {setShowForm(false); resetForm();}} style={{ background: 'none', border: 'none', color: '#86868b', cursor: 'pointer' }}>
                <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-2">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>PATIENT ID</label>
                <input type="number" className="form-control" style={{ fontSize: "13px" }} value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: Number(e.target.value) })} required />
              </div>
              <div className="col-md-2">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>DOCTOR ID</label>
                <input type="number" className="form-control" style={{ fontSize: "13px" }} value={form.doctor_id} onChange={(e) => setForm({ ...form, doctor_id: Number(e.target.value) })} required />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>DATE & TIME</label>
                <input type="datetime-local" className="form-control" style={{ fontSize: "13px" }} value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>VISIT NOTES</label>
                <input type="text" className="form-control" style={{ fontSize: "13px" }} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Reason for visit..." />
              </div>
              <div className="col-md-3">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>CURRENT STATUS</label>
                <select className="form-select" style={{ fontSize: "13px" }} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button type="button" className="btn-macos btn-macos-secondary" onClick={() => {setShowForm(false); resetForm();}}>Cancel</button>
              <button type="submit" className="btn-macos btn-macos-primary">
                {editingId ? "Update Details" : "Confirm Schedule"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: "0", border: "1px solid rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)", background: "rgba(255, 255, 255, 0.3)" }}>
            <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>Upcoming & Past Visits</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-macos m-0">
            <thead>
              <tr style={{ color: "#86868b", fontSize: "11px" }}>
                <th className="px-4 py-3">#ID</th>
                <th className="py-3">PATIENT ID</th>
                <th className="py-3">DOCTOR ID</th>
                <th className="py-3">SCHEDULED FOR</th>
                <th className="py-3">STATUS</th>
                <th className="text-end px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "13px" }}>
              {appointments.length > 0 ? (
                appointments.map((a) => {
                  const statusStyle = getStatusStyle(a.status);
                  return (
                    <tr key={a.id} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.02)" }}>
                      <td className="px-4 py-3" style={{ color: "#86868b", fontSize: "12px", fontFamily: "monospace" }}>#{a.id}</td>
                      <td className="py-3" style={{ fontWeight: "600" }}>P-{a.patient_id}</td>
                      <td className="py-3" style={{ fontWeight: "600" }}>D-{a.doctor_id}</td>
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
                          <button className="btn-macos btn-macos-secondary me-2" style={{ padding: "4px 8px" }} onClick={() => updateStatus(a.id, "completed")}>
                            <CheckCircle size={13} color="#28c840" />
                          </button>
                        )}
                        <button className="btn-macos btn-macos-secondary me-2" style={{ padding: "4px 8px" }} onClick={() => editAppointment(a)}>
                          <Pencil size={13} color="#007aff" />
                        </button>
                        <button className="btn-macos btn-macos-secondary" style={{ padding: "4px 8px" }} onClick={() => deleteAppointment(a.id)}>
                          <Trash2 size={13} color="#ff3b30" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5" style={{ color: "#86868b" }}>No scheduled appointments found.</td>
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