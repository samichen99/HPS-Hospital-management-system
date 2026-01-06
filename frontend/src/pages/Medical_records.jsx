import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";

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
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  // Fetch all data
  const fetchData = async () => {
    try {
      const [recordsRes, patientsRes, doctorsRes] = await Promise.all([
        api.get("/api/medical-records", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/api/patients", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/api/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        }),
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

  // Search
  const handleSearch = async () => {
    if (!search.trim()) {
      fetchData();
      return;
    }

    try {
      const res = await api.get(
        `/api/medical-records/search?query=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `/api/medical-records/${editingId}`,
          {
            diagnosis: form.diagnosis,
            prescription: form.prescription,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await api.post("/api/medical-records", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm(emptyForm);
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit
  const editRecord = (record) => {
    setEditingId(record.id);
    setForm({
      patientId: record.patientId,
      doctorId: record.doctorId,
      diagnosis: record.diagnosis,
      prescription: record.prescription,
    });
  };

  // Delete
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

  if (loading) return <p className="text-center">Loading medical records...</p>;

  return (
    <div className="container p-4">
      <h2 className="mb-4">Medical Records</h2>

      {/* Search */}
      <div className="d-flex mb-3">
        <input
          className="form-control me-2"
          placeholder="Search by diagnosis"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-4 mb-4">
        <h5 className="mb-3">
          {editingId ? "Edit Medical Record" : "Add Medical Record"}
        </h5>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Patient</label>
            <select
              className="form-select"
              value={form.patientId}
              disabled={!!editingId}
              onChange={(e) =>
                setForm({ ...form, patientId: e.target.value })
              }
              required
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Doctor</label>
            <select
              className="form-select"
              value={form.doctorId}
              disabled={!!editingId}
              onChange={(e) =>
                setForm({ ...form, doctorId: e.target.value })
              }
              required
            >
              <option value="">Select doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Diagnosis</label>
            <input
              className="form-control"
              value={form.diagnosis}
              onChange={(e) =>
                setForm({ ...form, diagnosis: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Prescription</label>
            <input
              className="form-control"
              value={form.prescription}
              onChange={(e) =>
                setForm({ ...form, prescription: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update Record" : "Create Record"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="card p-3">
        <h5>All Medical Records</h5>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Diagnosis</th>
                <th>Prescription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.length ? (
                records.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.patientFullName}</td>
                    <td>{r.doctorFullName}</td>
                    <td>{r.diagnosis}</td>
                    <td>{r.prescription}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => editRecord(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteRecord(r.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No medical records found
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
