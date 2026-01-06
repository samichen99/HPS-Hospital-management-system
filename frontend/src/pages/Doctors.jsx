import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";

function Doctors() {
  const { token, logout } = useContext(AuthContext);

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    user_id: "",
    full_name: "",
    speciality: "",
    phone: "",
    status: true,
  });

  const [editingId, setEditingId] = useState(null);

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const res = await api.get("/api/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDoctors();
  }, [token]);

  // Search doctors
  const handleSearch = async () => {
    if (!search.trim()) {
      fetchDoctors();
      return;
    }

    try {
      const res = await api.get(`/api/doctors/search?name=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/api/doctors/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/api/doctors", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetForm();
      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setForm({
      user_id: "",
      full_name: "",
      speciality: "",
      phone: "",
      status: true,
    });
    setEditingId(null);
  };

  const editDoctor = (doctor) => {
    setEditingId(doctor.id);
    setForm({
      user_id: doctor.user_id,
      full_name: doctor.full_name,
      speciality: doctor.speciality,
      phone: doctor.phone,
      status: doctor.status,
    });
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;

    try {
      await api.delete(`/api/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(doctors.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center">Loading doctors...</p>;

  return (
    <div className="container p-4">
      <h2 className="mb-4">Doctors Management</h2>

      {/* Search */}
      <div className="d-flex mb-3">
        <label htmlFor="searchDoctor" className="visually-hidden">
          Search doctor
        </label>
        <input
          id="searchDoctor"
          className="form-control me-2"
          placeholder="Search by name or speciality"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <h5>{editingId ? "Edit Doctor" : "Add Doctor"}</h5>

        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="userId" className="form-label">
              User ID
            </label>
            <input
              id="userId"
              type="number"
              className="form-control"
              value={form.user_id}
              onChange={(e) =>
                setForm({ ...form, user_id: Number(e.target.value) })
              }
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="fullName" className="form-label">
              Full name
            </label>
            <input
              id="fullName"
              className="form-control"
              value={form.full_name}
              onChange={(e) =>
                setForm({ ...form, full_name: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="speciality" className="form-label">
              Speciality
            </label>
            <input
              id="speciality"
              className="form-control"
              value={form.speciality}
              onChange={(e) =>
                setForm({ ...form, speciality: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-2">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              id="phone"
              className="form-control"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          <div className="col-md-2">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              className="form-select"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value === "true" })
              }
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-3">
          <button className="btn btn-primary me-2">
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-primary">
          <tr>
            <th>ID</th>
            <th>Full name</th>
            <th>Speciality</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {doctors.length ? (
            doctors.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.full_name}</td>
                <td>{d.speciality}</td>
                <td>{d.phone}</td>
                <td>{d.status ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editDoctor(d)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteDoctor(d.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No doctors found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Doctors;
