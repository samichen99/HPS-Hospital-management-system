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
  const [search, setSearch] = useState("");

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

  const getPatientName = (id) => patients.find((p) => p.id === id)?.fullName || "—";

  const filteredInvoices = invoices.filter((inv) => {
    const term = search.toLowerCase();
    const patientName = getPatientName(inv.patient_id).toLowerCase();
    const status = (inv.status || "").toLowerCase();
    const invId = inv.id.toString().toLowerCase();

    return (
      patientName.includes(term) ||
      status.includes(term) ||
      invId.includes(term)
    );
  });

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
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
    transition: "opacity 0.4s ease-in-out"
  };

  if (loading) return <div style={{ padding: "40px", color: "#424245", fontSize: "13px" }}>Loading financial data...</div>;

  return (
    <div style={{ ...mainContainerStyle, opacity: loading ? 0 : 1 }}>
      <header className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", marginBottom: "2px" }}>Invoices & Billing</h2>
          <p style={{ color: "#424245", fontSize: "14px", margin: 0 }}>Manage patient accounts and transaction history</p>
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
                placeholder="Search ledger..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {(user.role === "admin" || user.role === "doctor") && (
              <button className="btn-macos btn-macos-primary" onClick={() => { resetForm(); setShowForm(true); }}>
                <Receipt size={14} style={{ marginRight: "6px" }} /> Create New Invoice
              </button>
            )}
        </div>
      </header>

      {showForm && (
        <div className="glass-card mb-5" style={{ 
            border: "1px solid rgba(0, 122, 255, 0.25)", 
            backgroundColor: "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(30px) saturate(180%)",
            padding: "24px"
        }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 style={{ margin: 0, fontWeight: "600", fontSize: "15px" }}>
                {editingId ? "Modify Existing Invoice" : "Generate Patient Invoice"}
            </h5>
            <X size={18} style={{ cursor: "pointer", color: "#424245" }} onClick={() => {setShowForm(false); resetForm();}} />
          </div>
          
          <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Patient</label>
                <select className="form-select" value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} required>
                  <option value="">Select patient</option>
                  {patients.map((p) => (<option key={p.id} value={p.id}>{p.fullName}</option>))}
                </select>
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Linked Appointment (Optional)</label>
                <select className="form-select" value={form.appointmentId} onChange={(e) => setForm({ ...form, appointmentId: e.target.value })}>
                  <option value="">No linked appointment</option>
                  {appointments.map((a) => (<option key={a.id} value={a.id}>#{a.id} – {getPatientName(a.patient_id)}</option>))}
                </select>
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Amount (USD)</label>
                <input type="number" className="form-control" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Due Date</label>
                <input type="date" className="form-control" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
              </div>
              <div className="col-md-12">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Billing Notes</label>
                <textarea className="form-control" rows="2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Itemized list of services..." />
              </div>
              <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn-macos btn-macos-secondary" onClick={() => {setShowForm(false); resetForm();}}>Discard</button>
                <button type="submit" className="btn-macos btn-macos-primary">{editingId ? "Save Changes" : "Post Invoice"}</button>
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
            <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>General Ledger</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-borderless m-0">
            <thead>
              <tr style={{ color: "#424245", fontSize: "11px", letterSpacing: "0.02em" }}>
                <th className="px-4 py-3 font-weight-normal">#INV</th>
                <th className="py-3 font-weight-normal">PATIENT</th>
                <th className="py-3 font-weight-normal">AMOUNT</th>
                <th className="py-3 font-weight-normal">STATUS</th>
                <th className="py-3 font-weight-normal">DUE DATE</th>
                <th className="py-3 font-weight-normal">PAID AT</th>
                <th className="text-end px-4 py-3 font-weight-normal">ACTIONS</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.04)" }}>
                    <td className="px-4 py-3" style={{ color: "#424245", fontFamily: "monospace", fontSize: "11px" }}>#{inv.id.toString().padStart(4, '0')}</td>
                    <td className="py-3" style={{ fontWeight: "600", color: "#1d1d1f" }}>{getPatientName(inv.patient_id)}</td>
                    <td className="py-3" style={{ fontWeight: "700", color: "#1d1d1f" }}>${Number(inv.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-3">
                        <span style={{ 
                            padding: "3px 10px", 
                            borderRadius: "100px", 
                            backgroundColor: inv.status === "paid" ? "rgba(40, 200, 64, 0.15)" : "rgba(255, 159, 10, 0.15)", 
                            color: inv.status === "paid" ? "#24b33d" : "#e68a00", 
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
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn-macos btn-macos-secondary" style={{ padding: "4px 8px", background: "rgba(255,255,255,0.4)" }} onClick={() => editInvoice(inv)}>
                            <Pencil size={12} color="#007aff" />
                          </button>
                          <button className="btn-macos btn-macos-secondary" style={{ padding: "4px 8px", background: "rgba(255,255,255,0.4)" }} onClick={() => markAsPaid(inv.id)}>
                            <CheckCircle size={12} color="#28c840" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5" style={{ color: "#424245" }}>
                    {search ? `No invoices found matching "${search}"` : "No financial records found in the ledger."}
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