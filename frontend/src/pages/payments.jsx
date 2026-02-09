import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";
import { CreditCard, Wallet, Landmark, Plus, X, Receipt, History, Search } from "lucide-react";

function Payments() {
  const { token, logout, user } = useContext(AuthContext);

  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

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

  const filteredPayments = payments.filter((p) => {
    const term = search.toLowerCase();
    const payId = (p.id?.toString() || "").toLowerCase();
    const invId = (p.invoice_id?.toString() || "").toLowerCase();
    const memo = (p.notes || "").toLowerCase();
    const method = (p.method || "").toLowerCase();

    return payId.includes(term) || invId.includes(term) || memo.includes(term) || method.includes(term);
  });

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

  if (loading) return <div style={{ padding: "40px", color: "#424245", fontSize: "13px" }}>Loading transaction history...</div>;

  if (user.role !== "admin" && user.role !== "doctor") {
    return (
      <div style={{ ...mainContainerStyle, opacity: loading ? 0 : 1 }} className="d-flex align-items-center justify-content-center">
        <div className="text-center p-5 glass-card" style={{ border: "1px solid rgba(255, 59, 48, 0.2)" }}>
          <p style={{ color: "#ff3b30", fontSize: "14px", margin: 0, fontWeight: "600" }}>Restricted Access: Billing permissions required.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...mainContainerStyle, opacity: loading ? 0 : 1 }}>
      <header className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 style={{ fontWeight: "700", fontSize: "24px", letterSpacing: "-0.01em", margin: 0 }}>Transaction Ledger</h2>
          <p style={{ color: "#424245", fontSize: "14px", margin: "2px 0 0 0" }}>Process payments and audit inbound revenue</p>
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
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button className="btn-macos btn-macos-primary" onClick={() => setShowForm(true)}>
              <Plus size={14} style={{ marginRight: "6px" }} /> Log Payment
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
            <h5 style={{ margin: 0, fontWeight: "600", fontSize: "15px" }}>Register Receipt</h5>
            <X size={18} style={{ cursor: "pointer", color: "#424245" }} onClick={() => setShowForm(false)} />
          </div>
          
          <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-5">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Target Invoice</label>
                <select className="form-select" value={form.invoiceId} onChange={(e) => setForm({ ...form, invoiceId: e.target.value })} required>
                  <option value="">Choose an invoice</option>
                  {invoices.filter(i => i.status !== 'paid').map((inv) => (
                    <option key={inv.id} value={inv.id}>#{inv.id.toString().padStart(4, '0')} — {inv.amount} MAD</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Amount Received</label>
                <input type="number" className="form-control" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Payment Method</label>
                <select className="form-select" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="col-md-12">
                <label style={{ fontSize: "11px", fontWeight: "600", color: "#424245", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>Transaction Notes</label>
                <textarea className="form-control" rows="2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Reference numbers or specific details..." />
              </div>
              <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn-macos btn-macos-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-macos btn-macos-primary">Post Payment</button>
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
            <h6 style={{ margin: 0, fontWeight: "600", fontSize: "14px", display: 'flex', alignItems: 'center' }}>
              <History size={16} className="me-2" style={{ opacity: 0.7 }} /> Recent Collections
            </h6>
        </div>
        <div className="table-responsive">
          <table className="table table-borderless m-0">
            <thead>
              <tr style={{ color: "#424245", fontSize: "11px", letterSpacing: "0.02em" }}>
                <th className="px-4 py-3 font-weight-normal">#PAYMENT</th>
                <th className="py-3 font-weight-normal">INVOICE</th>
                <th className="py-3 font-weight-normal">AMOUNT</th>
                <th className="py-3 font-weight-normal">METHOD</th>
                <th className="py-3 font-weight-normal">SETTLEMENT DATE</th>
                <th className="px-4 py-3 font-weight-normal">MEMO</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => (
                  <tr key={p.id} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.04)" }}>
                    <td className="px-4 py-3" style={{ color: "#424245", fontFamily: "monospace" }}>#{p.id.toString().padStart(5, '0')}</td>
                    <td className="py-3"><span style={{ color: "#007aff", fontWeight: "600" }}>#{p.invoice_id?.toString().padStart(4, '0')}</span></td>
                    <td className="py-3" style={{ fontWeight: "700", color: "#1d1d1f" }}>{Number(p.amount).toLocaleString()} MAD</td>
                    <td className="py-3">
                        <span className="d-inline-flex align-items-center" style={{ 
                            textTransform: 'capitalize', 
                            backgroundColor: 'rgba(0,0,0,0.05)', 
                            padding: '3px 10px', 
                            borderRadius: '100px',
                            fontSize: '10px',
                            fontWeight: '600'
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
                  <td colSpan="6" className="text-center py-5" style={{ color: "#424245" }}>
                    {search ? `No payments match "${search}"` : "No payment history recorded."}
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