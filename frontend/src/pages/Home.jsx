import axios from "axios"
import React, { useEffect, useState } from "react";

// Tailwind is loaded via src/index.css in main.jsx

function Home() {
	const tabs = ["Users", "Patients", "Doctors", "Appointments"];
	// Tab state
	const [activeTab, setActiveTab] = useState("Users");
	// Users
	const [users, setUsers] = useState([]);
	const [userForm, setUserForm] = useState({ username: "", email: "", password: "", role: "user" });
	// Patients
	const [patients, setPatients] = useState([]);
	const [patientForm, setPatientForm] = useState({ full_name: "", date_of_birth: "", gender: "", phone: "", address: "", insurance_number: "" });
	// Doctors
	const [doctors, setDoctors] = useState([]);
	const [doctorForm, setDoctorForm] = useState({ full_name: "", specialty: "", phone: "" });
	// Appointments
	const [appointments, setAppointments] = useState([]);
	const [appointmentForm, setAppointmentForm] = useState({ patient_id: "", doctor_id: "", date: "", time: "" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [toasts, setToasts] = useState([]);

	// search + pagination
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const pageSize = 10;

	const showToast = (message, type = 'success') => {
		const id = Date.now();
		setToasts(prev => [...prev, { id, message, type }]);
		setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500);
	};

	// Fetch all entities
	useEffect(() => {
		if (activeTab === "Users") fetchUsers();
		if (activeTab === "Patients") fetchPatients();
		if (activeTab === "Doctors") fetchDoctors();
		if (activeTab === "Appointments") fetchAppointments();
		// eslint-disable-next-line
	}, [activeTab]);
  
const fetchUsers = async () => {
  setLoading(true);
  setError("");
  try {
    const res = await axios.get("/api/users");
    console.log("Users API response:", res.data);

    if (Array.isArray(res.data)) setUsers(res.data); else if (Array.isArray(res.data.users)) setUsers(res.data.users); else setUsers([]);
  } catch {
    setError("Failed to fetch users");
  }
  setLoading(false);
};

      const handleAddUser = async e => {
        e.preventDefault(); setError("");
        try {
          await axios.post("/api/users", userForm);
          showToast('User added', 'success');
          setUserForm({ username: "", email: "", password: "", role: "user" });
          fetchUsers();
        } catch { setError("Failed to add user"); }
      };
      const handleDeleteUser = async id => {
        setError("");
        try {
          await axios.delete(`/api/users/${id}`);
          showToast('User deleted', 'success');
          fetchUsers();
        } catch { setError("Failed to delete user"); }
      };

      // Patients
      const fetchPatients = async () => {
        setLoading(true); setError("");
        try {
          const res = await axios.get("/api/patients");
          setPatients(res.data);
        } catch { setError("Failed to fetch patients"); }
        setLoading(false);
      };
      const handleAddPatient = async e => {
        e.preventDefault(); setError("");
        try {
          await axios.post("/api/patients", patientForm);
          showToast('Patient added', 'success');
          setPatientForm({ full_name: "", date_of_birth: "", gender: "", phone: "", address: "", insurance_number: "" });
          fetchPatients();
        } catch { setError("Failed to add patient"); }
      };
      const handleDeletePatient = async id => {
        setError("");
        try {
          await axios.delete(`/api/patients/${id}`);
          showToast('Patient deleted', 'success');
          fetchPatients();
        } catch { setError("Failed to delete patient"); }
      };

      // Doctors
      const fetchDoctors = async () => {
        setLoading(true); setError("");
        try {
          const res = await axios.get("/api/doctors");
          setDoctors(res.data);
        } catch { setError("Failed to fetch doctors"); }
        setLoading(false);
      };
      const handleAddDoctor = async e => {
        e.preventDefault(); setError("");
        try {
          await axios.post("/api/doctors", doctorForm);
          showToast('Doctor added', 'success');
          setDoctorForm({ full_name: "", specialty: "", phone: "" });
          fetchDoctors();
        } catch { setError("Failed to add doctor"); }
      };
      const handleDeleteDoctor = async id => {
        setError("");
        try {
          await axios.delete(`/api/doctors/${id}`);
          showToast('Doctor deleted', 'success');
          fetchDoctors();
        } catch { setError("Failed to delete doctor"); }
      };

      // Appointments
      const fetchAppointments = async () => {
        setLoading(true); setError("");
        try {
          const res = await axios.get("/api/appointments");
          setAppointments(res.data);
        } catch { setError("Failed to fetch appointments"); }
        setLoading(false);
      };
      const handleAddAppointment = async e => {
        e.preventDefault(); setError("");
        try {
          await axios.post("/api/appointments", appointmentForm);
          showToast('Appointment added', 'success');
          setAppointmentForm({ patient_id: "", doctor_id: "", date: "", time: "" });
          fetchAppointments();
        } catch { setError("Failed to add appointment"); }
      };
      const handleDeleteAppointment = async id => {
        setError("");
        try {
          await axios.delete(`/api/appointments/${id}`);
          showToast('Appointment deleted', 'success');
          fetchAppointments();
        } catch { setError("Failed to delete appointment"); }
      };

      // Tab content renderers
		const renderUsers = () => (
			<>
				<form onSubmit={handleAddUser} className="form-grid form-grid--5">
					<input type="text" placeholder="Username" value={userForm.username} onChange={e => setUserForm({ ...userForm, username: e.target.value })} required className="input" />
					<input type="email" placeholder="Email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required className="input" />
					<input type="password" placeholder="Password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required className="input" />
					<select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })} className="select">
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</select>
					<button type="submit" className="btn btn--primary">Add User</button>
				</form>
				{loading ? <div>Loading users...</div> : (
					<div className="card-table">
						<table className="table">
							<thead>
								<tr>
									<th>ID</th>
									<th>Username</th>
									<th>Email</th>
									<th>Role</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{users.map(user => (
									<tr key={user.ID}>
										<td>{user.ID}</td>
										<td>{user.Username}</td>
										<td>{user.Email}</td>
										<td>{user.Role}</td>
										<td>
											<button onClick={() => handleDeleteUser(user.ID)} className="btn btn--danger btn--xs">Delete</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</>
		);

		const renderPatients = () => (
			<>
				<form onSubmit={handleAddPatient} className="form-grid form-grid--6">
					<input type="text" placeholder="Full Name" value={patientForm.full_name} onChange={e => setPatientForm({ ...patientForm, full_name: e.target.value })} required className="input" />
					<input type="date" placeholder="Date of Birth" value={patientForm.date_of_birth} onChange={e => setPatientForm({ ...patientForm, date_of_birth: e.target.value })} required className="input" />
					<input type="text" placeholder="Gender" value={patientForm.gender} onChange={e => setPatientForm({ ...patientForm, gender: e.target.value })} required className="input" />
					<input type="text" placeholder="Phone" value={patientForm.phone} onChange={e => setPatientForm({ ...patientForm, phone: e.target.value })} required className="input" />
					<input type="text" placeholder="Address" value={patientForm.address} onChange={e => setPatientForm({ ...patientForm, address: e.target.value })} required className="input" />
					<input type="text" placeholder="Insurance Number" value={patientForm.insurance_number} onChange={e => setPatientForm({ ...patientForm, insurance_number: e.target.value })} required className="input" />
					<button type="submit" className="btn btn--primary">Add Patient</button>
				</form>
				{loading ? <div>Loading patients...</div> : (
					<div className="card-table">
						<table className="table">
							<thead>
								<tr>
									<th>ID</th>
									<th>Full Name</th>
									<th>Gender</th>
									<th>Phone</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{patients.map(patient => (
									<tr key={patient.ID}>
										<td>{patient.ID}</td>
										<td>{patient.FullName}</td>
										<td>{patient.Gender}</td>
										<td>{patient.Phone}</td>
										<td>
											<button onClick={() => handleDeletePatient(patient.ID)} className="btn btn--danger btn--xs">Delete</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</>
		);

		const renderDoctors = () => (
			<>
				<form onSubmit={handleAddDoctor} className="form-grid form-grid--4">
					<input type="text" placeholder="Full Name" value={doctorForm.full_name} onChange={e => setDoctorForm({ ...doctorForm, full_name: e.target.value })} required className="input" />
					<input type="text" placeholder="Specialty" value={doctorForm.specialty} onChange={e => setDoctorForm({ ...doctorForm, specialty: e.target.value })} required className="input" />
					<input type="text" placeholder="Phone" value={doctorForm.phone} onChange={e => setDoctorForm({ ...doctorForm, phone: e.target.value })} required className="input" />
					<button type="submit" className="btn btn--primary">Add Doctor</button>
				</form>
				{loading ? <div>Loading doctors...</div> : (
					<div className="card-table">
						<table className="table">
							<thead>
								<tr>
									<th>ID</th>
									<th>Full Name</th>
									<th>Specialty</th>
									<th>Phone</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{doctors.map(doctor => (
									<tr key={doctor.ID}>
										<td>{doctor.ID}</td>
										<td>{doctor.FullName}</td>
										<td>{doctor.Specialty}</td>
										<td>{doctor.Phone}</td>
										<td>
											<button onClick={() => handleDeleteDoctor(doctor.ID)} className="btn btn--danger btn--xs">Delete</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</>
		);

		const renderAppointments = () => (
			<>
				<form onSubmit={handleAddAppointment} className="form-grid form-grid--5">
					<input type="number" placeholder="Patient ID" value={appointmentForm.patient_id} onChange={e => setAppointmentForm({ ...appointmentForm, patient_id: e.target.value })} required className="input" />
					<input type="number" placeholder="Doctor ID" value={appointmentForm.doctor_id} onChange={e => setAppointmentForm({ ...appointmentForm, doctor_id: e.target.value })} required className="input" />
					<input type="date" placeholder="Date" value={appointmentForm.date} onChange={e => setAppointmentForm({ ...appointmentForm, date: e.target.value })} required className="input" />
					<input type="time" placeholder="Time" value={appointmentForm.time} onChange={e => setAppointmentForm({ ...appointmentForm, time: e.target.value })} required className="input" />
					<button type="submit" className="btn btn--primary">Add Appointment</button>
				</form>
				{loading ? <div>Loading appointments...</div> : (
					<div className="card-table">
						<table className="table">
							<thead>
								<tr>
									<th>ID</th>
									<th>Patient ID</th>
									<th>Doctor ID</th>
									<th>Date</th>
									<th>Time</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{appointments.map(app => (
									<tr key={app.ID}>
										<td>{app.ID}</td>
										<td>{app.PatientID}</td>
										<td>{app.DoctorID}</td>
										<td>{app.Date}</td>
										<td>{app.Time}</td>
										<td>
											<button onClick={() => handleDeleteAppointment(app.ID)} className="btn btn--danger btn--xs">Delete</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</>
		);

		return (
			<>
			<div className="page">
				<header className="page__header">
					<div className="page__header-inner">
						<h1 className="page__title">HAP Hospital Management System</h1>
					</div>
				</header>
				<main className="page__main">
					<div className="form-grid" style={{marginBottom: 8}}>
						<input className="input" placeholder={`Search ${activeTab.toLowerCase()}...`} value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />
					</div>
					<div className="tabs">
						{tabs.map(tab => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`tab ${activeTab === tab ? 'tab--active' : ''}`}
							>
								{tab}
							</button>
						))}
					</div>
					{error && <div className="alert alert--error">{error}</div>}
					{activeTab === "Users" && renderUsers()}
					{activeTab === "Patients" && renderPatients()}
					{activeTab === "Doctors" && renderDoctors()}
					{activeTab === "Appointments" && renderAppointments()}
				</main>
			</div>
			<div className="toast-container">
				{toasts.map(t => (
					<div key={t.id} className={`toast ${t.type === 'error' ? 'toast--error' : 'toast--success'}`}>{t.message}</div>
				))}
			</div>
			</>
		);
    }

export default Home;
