import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";
import { CreditCard, Pencil, CheckCircle, X, Receipt, Search, Filter } from "lucide-react";

function Invoices() {
  const { token, logout, user } = useContext(AuthContext);

  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    patientId: "",
    appointmentId: "",
    amount: "",
    dueDate: "",
    notes: "",
  });

  const fetchInvoices = async () => {
    try {
      const res = await api.get("/api/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(res.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    const res = await api.get("/api/patients", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPatients(res.data);
  };

  const fetchAppointments = async () => {
    const res = await api.get("/api/appointments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAppointments(res.data);
  };

  useEffect(() => {
    if (token) {
      fetchInvoices();
      fetchPatients();
      fetchAppointments();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      patient_id: Number(form.patientId),
      appointment_id: form.appointmentId ? Number(form.appointmentId) : null,
      amount: Number(form.amount),
      due_date: form.dueDate,
      notes: form.notes,
    };

    try {
      if (editingId) {
        await api.put(`/api/invoices/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/api/invoices", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      resetForm();
      setShowForm(false);
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const markAsPaid = async (id) => {
    if (!window.confirm("Confirm payment for this invoice?")) return;
    try {
      await api.patch(`/api/invoices/${id}/paid`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const editInvoice = (inv) => {
    if (inv.status === "paid") return;
    setEditingId(inv.id);
    setForm({
      patientId: inv.patient_id,
      appointmentId: inv.appointment_id || "",
      amount: inv.amount,
      dueDate: inv.due_date?.slice(0, 10),
      notes: inv.notes || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      patientId: "",
      appointmentId: "",
      amount: "",
      dueDate: "",
      notes: "",
    });
  };

  const getPatientName = (id) => patients.find((p) => p.id === id)?.fullName || "—";

  if (loading) return <div style={{ padding: "40px", color: "#86868b", fontSize: "13px" }}>Loading financial data...</div>;

  return (
    <div style={{ backgroundColor: "#f1f1f1ff", minHeight: "100vh", padding: "40px", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
      <header className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", margin: 0 }}>Invoices & Billing</h2>
          <p style={{ color: "#86868b", fontSize: "14px", margin: "2px 0 0 0" }}>Manage patient accounts and transaction history</p>
        </div>
        
        {(user.role === "admin" || user.role === "doctor") && (
          <button className="btn-macos btn-macos-primary" onClick={() => { resetForm(); setShowForm(true); }}>
            <Receipt size={14} style={{ marginRight: "6px" }} /> Create New Invoice
          </button>
        )}
      </header>

      {showForm && (
        <div className="glass-card mb-5" style={{ 
            border: "1px solid rgba(0, 122, 255, 0.3)", 
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
        }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 style={{ margin: 0, fontWeight: "600", fontSize: "15px", color: "#1d1d1f" }}>
                {editingId ? "Modify Existing Invoice" : "Generate Patient Invoice"}
            </h5>
            <button onClick={() => {setShowForm(false); resetForm();}} style={{ background: 'none', border: 'none', color: '#86868b', cursor: 'pointer' }}>
                <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>PATIENT</label>
                <select className="form-select" style={{ fontSize: "13px" }} value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} required>
                  <option value="">Select patient</option>
                  {patients.map((p) => (<option key={p.id} value={p.id}>{p.fullName}</option>))}
                </select>
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>LINKED APPOINTMENT (OPTIONAL)</label>
                <select className="form-select" style={{ fontSize: "13px" }} value={form.appointmentId} onChange={(e) => setForm({ ...form, appointmentId: e.target.value })}>
                  <option value="">No linked appointment</option>
                  {appointments.map((a) => (<option key={a.id} value={a.id}>#{a.id} – {getPatientName(a.patient_id)}</option>))}
                </select>
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>AMOUNT (USD)</label>
                <input type="number" className="form-control" style={{ fontSize: "13px" }} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>DUE DATE</label>
                <input type="date" className="form-control" style={{ fontSize: "13px" }} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
              </div>
              <div className="col-md-12">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>BILLING NOTES</label>
                <textarea className="form-control" style={{ fontSize: "13px" }} rows="2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Itemized list of services..." />
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button type="button" className="btn-macos btn-macos-secondary" onClick={() => {setShowForm(false); resetForm();}}>Discard</button>
              <button type="submit" className="btn-macos btn-macos-primary">{editingId ? "Save Changes" : "Post Invoice"}</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: "0", border: "1px solid rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)", background: "rgba(255, 255, 255, 0.3)" }}>
            <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>General Ledger</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-macos m-0">
            <thead>
              <tr style={{ color: "#86868b", fontSize: "11px" }}>
                <th className="px-4 py-3">#INV</th>
                <th className="py-3">PATIENT</th>
                <th className="py-3">AMOUNT</th>
                <th className="py-3">STATUS</th>
                <th className="py-3">DUE DATE</th>
                <th className="py-3">PAID AT</th>
                <th className="text-end px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv.id} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.02)" }}>
                    <td className="px-4 py-3" style={{ color: "#86868b", fontFamily: "monospace" }}>#{inv.id.toString().padStart(4, '0')}</td>
                    <td className="py-3" style={{ fontWeight: "600", color: "#1d1d1f" }}>{getPatientName(inv.patient_id)}</td>
                    <td className="py-3" style={{ fontWeight: "700" }}>${Number(inv.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-3">
                        <span style={{ 
                            padding: "3px 10px", 
                            borderRadius: "100px", 
                            backgroundColor: inv.status === "paid" ? "rgba(40, 200, 64, 0.1)" : "rgba(255, 159, 10, 0.1)", 
                            color: inv.status === "paid" ? "#28c840" : "#ff9f0a", 
                            fontSize: "10px", 
                            fontWeight: "700",
                            textTransform: "uppercase"
                        }}>
                          {inv.status}
                        </span>
                    </td>
                    <td className="py-3" style={{ color: "#424245" }}>{inv.due_date?.slice(0, 10)}</td>
                    <td className="py-3" style={{ color: "#86868b" }}>{inv.paid_at?.slice(0, 10) || "—"}</td>
                    <td className="text-end px-4 py-3">
                      {inv.status !== "paid" && (
                        <>
                          <button className="btn-macos btn-macos-secondary me-2" style={{ padding: "4px 8px" }} onClick={() => editInvoice(inv)}>
                            <Pencil size={13} color="#007aff" />
                          </button>
                          <button className="btn-macos btn-macos-secondary" style={{ padding: "4px 8px" }} onClick={() => markAsPaid(inv.id)}>
                            <CheckCircle size={13} color="#28c840" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5" style={{ color: "#86868b" }}>
                    No financial records found in the ledger.
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

export default Invoices;