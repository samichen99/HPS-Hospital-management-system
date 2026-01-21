import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";
import { CreditCard, Wallet, Landmark, Plus, X, Receipt, History } from "lucide-react";

function Payments() {
  const { token, logout, user } = useContext(AuthContext);

  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    invoiceId: "",
    amount: "",
    method: "cash",
    notes: "",
  });

  const fetchPayments = async () => {
    try {
      const res = await api.get("/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    const res = await api.get("/api/invoices", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setInvoices(res.data);
  };

  useEffect(() => {
    if (token) {
      fetchPayments();
      fetchInvoices();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.invoiceId || !form.amount) return;

    try {
      await api.post("/api/payments",
        {
          invoice_id: Number(form.invoiceId),
          amount: Number(form.amount),
          method: form.method,
          notes: form.notes,
          date: new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      resetForm();
      setShowForm(false);
      fetchPayments();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setForm({ invoiceId: "", amount: "", method: "cash", notes: "" });
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'card': return <CreditCard size={12} className="me-1" />;
      case 'transfer': return <Landmark size={12} className="me-1" />;
      default: return <Wallet size={12} className="me-1" />;
    }
  };

  if (loading) return <div style={{ padding: "40px", color: "#86868b", fontSize: "13px" }}>Loading transaction history...</div>;

  if (user.role !== "admin" && user.role !== "doctor") {
    return <div className="text-center p-5" style={{ color: "#ff3b30", fontSize: "14px" }}>Restricted Access: Billing permissions required.</div>;
  }

  return (
    <div style={{ backgroundColor: "#f1f1f1ff", minHeight: "100vh", padding: "40px", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
      <header className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", margin: 0 }}>Transaction Ledger</h2>
          <p style={{ color: "#86868b", fontSize: "14px", margin: "2px 0 0 0" }}>Process payments and audit inbound revenue</p>
        </div>
        
        <button className="btn-macos btn-macos-primary" onClick={() => setShowForm(true)}>
          <Plus size={14} style={{ marginRight: "6px" }} /> Log Payment
        </button>
      </header>

      {showForm && (
        <div className="glass-card mb-5" style={{ 
            border: "1px solid rgba(0, 122, 255, 0.3)", 
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
        }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 style={{ margin: 0, fontWeight: "600", fontSize: "15px" }}>Register Receipt</h5>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#86868b', cursor: 'pointer' }}>
                <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-5">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>TARGET INVOICE</label>
                <select className="form-select" style={{ fontSize: "13px" }} value={form.invoiceId} onChange={(e) => setForm({ ...form, invoiceId: e.target.value })} required>
                  <option value="">Choose an invoice</option>
                  {invoices.filter(i => i.status !== 'paid').map((inv) => (
                    <option key={inv.id} value={inv.id}>#{inv.id.toString().padStart(4, '0')} — {inv.amount} MAD</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>AMOUNT RECEIVED</label>
                <input type="number" className="form-control" style={{ fontSize: "13px" }} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>PAYMENT METHOD</label>
                <select className="form-select" style={{ fontSize: "13px" }} value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="col-md-12">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#86868b", display: "block", marginBottom: "5px" }}>TRANSACTION NOTES</label>
                <textarea className="form-control" style={{ fontSize: "13px" }} rows="2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Reference numbers or specific details..." />
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button type="button" className="btn-macos btn-macos-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-macos btn-macos-primary">Post Payment</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ padding: "0", border: "1px solid rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)", background: "rgba(255, 255, 255, 0.3)" }}>
            <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}><History size={16} className="me-2" /> Recent Collections</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-macos m-0">
            <thead>
              <tr style={{ color: "#86868b", fontSize: "11px" }}>
                <th className="px-4 py-3">#PAYMENT</th>
                <th className="py-3">INVOICE</th>
                <th className="py-3">AMOUNT</th>
                <th className="py-3">METHOD</th>
                <th className="py-3">SETTLEMENT DATE</th>
                <th className="px-4 py-3">MEMO</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p.id} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.02)" }}>
                    <td className="px-4 py-3" style={{ color: "#86868b", fontFamily: "monospace" }}>#{p.id.toString().padStart(5, '0')}</td>
                    <td className="py-3"><span style={{ color: "#007aff", fontWeight: "600" }}>#{p.invoice_id.toString().padStart(4, '0')}</span></td>
                    <td className="py-3" style={{ fontWeight: "700", color: "#1d1d1f" }}>{p.amount} MAD</td>
                    <td className="py-3">
                        <span className="d-inline-flex align-items-center" style={{ 
                            textTransform: 'capitalize', 
                            backgroundColor: 'rgba(0,0,0,0.05)', 
                            padding: '2px 8px', 
                            borderRadius: '4px',
                            fontSize: '11px'
                        }}>
                          {getMethodIcon(p.method)} {p.method}
                        </span>
                    </td>
                    <td className="py-3" style={{ color: "#424245" }}>{p.date?.slice(0, 10)}</td>
                    <td className="px-4 py-3" style={{ color: "#86868b", fontStyle: "italic" }}>{p.notes || "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5" style={{ color: "#86868b" }}>
                    No payment history recorded in the current period.
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

export default Payments;