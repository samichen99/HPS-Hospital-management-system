import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";

function Patients() {
  const { token, logout } = useContext(AuthContext);

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    address: "",
    insurance_number: "",
  });

  const [editingId, setEditingId] = useState(null);

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const res = await api.get("/api/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPatients();
  }, [token]);

  // Search patients
  const handleSearch = async () => {
    if (!search.trim()) {
      fetchPatients();
      return;
    }
    try {
      const res = await api.get(`/api/patients/search?name=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/api/patients/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/api/patients", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({
        full_name: "",
        date_of_birth: "",
        gender: "",
        phone: "",
        address: "",
        insurance_number: "",
      });
      setEditingId(null);
      fetchPatients();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit patient
  const editPatient = (patient) => {
    setEditingId(patient.id);
    setForm({
      full_name: patient.full_name,
      date_of_birth: patient.date_of_birth,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address,
      insurance_number: patient.insurance_number || "",
    });
  };

  // Delete patient
  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient?")) return;

    try {
      await api.delete(`/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(patients.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };


  if (loading) return <p className="text-center">Loading patients...</p>;

  return (
    <div className="container p-4">
      <h2 className="mb-4">Patients Management</h2>

      {/* Search */}
      <div className="d-flex mb-3">
        <input
          className="form-control me-2"
          placeholder="Search by name"
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
          {editingId ? "Edit Patient" : "Add Patient"}
        </h5>

        <div className="row g-3">
          {/* Full name */}
          <div className="col-md-6">
            <label className="form-label">Full name</label>
            <input
              type="text"
              className="form-control"
              value={form.full_name}
              onChange={(e) =>
                setForm({ ...form, full_name: e.target.value })
              }
              required
            />
          </div>

          {/* Date of birth */}
          <div className="col-md-3">
            <label className="form-label">Date of birth</label>
            <input
              type="date"
              className="form-control"
              value={form.date_of_birth}
              onChange={(e) =>
                setForm({ ...form, date_of_birth: e.target.value })
              }
              required
            />
          </div>

          {/* Gender */}
          <div className="col-md-3">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              value={form.gender}
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value })
              }
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Phone */}
          <div className="col-md-4">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              required
            />
          </div>

          {/* Address */}
          <div className="col-md-4">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              required
            />
          </div>

          {/* Insurance number */}
          <div className="col-md-4">
            <label className="form-label">Insurance number</label>
            <input
              type="text"
              className="form-control"
              value={form.insurance_number}
              onChange={(e) =>
                setForm({ ...form, insurance_number: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update Patient" : "Create Patient"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditingId(null);
                setForm({
                  full_name: "",
                  date_of_birth: "",
                  gender: "",
                  phone: "",
                  address: "",
                  insurance_number: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Patients Table */}
      <div className="card p-3">
        <h5>All Patients</h5>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Insurance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.full_name}</td>
                  <td>{p.date_of_birth}</td>
                  <td>{p.gender}</td>
                  <td>{p.phone}</td>
                  <td>{p.address}</td>
                  <td>{p.insurance_number}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => editPatient(p)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => deletePatient(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Patients;
