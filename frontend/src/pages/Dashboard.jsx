import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();


  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
      </div>  
      <p>Welcome back, <stong>{user?.username || user?.email}</stong>!</p>
      
          {/* Summary Cards */}
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow border-1">
            <div className="card-body">
              <h5 className="card-title">Patients</h5>
              <h3 className="fw-bold text-primary">124</h3>
              <p className="text-muted small">Total registered</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center shadow border-1">
            <div className="card-body">
              <h5 className="card-title">Doctors</h5>
              <h3 className="fw-bold text-success">32</h3>
              <p className="text-muted small">Active specialists</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center shadow border-1">
            <div className="card-body">
              <h5 className="card-title">Appointments</h5>
              <h3 className="fw-bold text-warning">58</h3>
              <p className="text-muted small">Scheduled today</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center shadow border-1">
            <div className="card-body">
              <h5 className="card-title">Invoices</h5>
              <h3 className="fw-bold text-danger">14</h3>
              <p className="text-muted small">Pending payments</p>
            </div>
          </div>
        </div>
      </div>
      {/* overview table */}
      <div className="card shadow-sm mt-4"></div>
        <div className="card-header bg-light">
          <h5 className="mb-0">Recent activities</h5>
        </div>
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Type</th>
                <th>Details</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Appointment</td>
                <td>Dr. ahmed with Patient #45</td>
                <td>2025-11-12</td>
              </tr>
              <tr>
                <td>Invoice</td>
                <td>Invoice #4 paid by Patient #23</td>
                <td>25-11-10</td>
              </tr>
            </tbody>
          </table>
        </div>


        

    </div>
  );
}

export default Dashboard;
