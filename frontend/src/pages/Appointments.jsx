import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/apiClient";

function Appointments() {
  const { token, logout } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    status: "scheduled",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);

  // Fetch appointments
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

  // Create / Update
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
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

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

  const editAppointment = (a) => {
    setEditingId(a.id);
    setForm({
      patient_id: a.patient_id,
      doctor_id: a.doctor_id,
      appointment_date: a.appointment_date?.slice(0, 16),
      status: a.status,
      notes: a.notes || "",
    });
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

  if (loading) return <p className="text-center">Loading appointments...</p>;

  return (
    <div className="container p-4">
      <h2 className="mb-4">Appointments Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <h5>{editingId ? "Edit Appointment" : "Add Appointment"}</h5>

        <div className="row g-3">
          <div className="col-md-2">
            <label className="form-label">Patient ID</label>
            <input
              type="number"
              className="form-control"
              value={form.patient_id}
              onChange={(e) =>
                setForm({ ...form, patient_id: Number(e.target.value) })
              }
              required
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Doctor ID</label>
            <input
              type="number"
              className="form-control"
              value={form.doctor_id}
              onChange={(e) =>
                setForm({ ...form, doctor_id: Number(e.target.value) })
              }
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Date & Time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={form.appointment_date}
              onChange={(e) =>
                setForm({ ...form, appointment_date: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Notes</label>
            <input
              className="form-control"
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
            />
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
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {appointments.length ? (
            appointments.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.patient_id}</td>
                <td>{a.doctor_id}</td>
                <td>{a.appointment_date}</td>
                <td>{a.status}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editAppointment(a)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => deleteAppointment(a.id)}
                  >
                    Delete
                  </button>
                  {a.status !== "completed" && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        updateStatus(a.id, "completed")
                      }
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No appointments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Appointments;
