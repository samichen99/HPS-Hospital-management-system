import {Link} from "react-router-dom";


function Sidebar(){
    return(
        <div className="sidebar sidebar-sticky flex-column p-3" style={{width: '250px', height: '100vh', backgroundColor: '#c4d5e6ff'}}>
           
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item mb-2">
                    <Link to="/dashboard" className="nav-link nav-align-items-center text-dark flex-column">Home</Link>
                    </li>
                <li className="nav-item mb-2">
                    <Link to="/users" className="nav-link text-dark ">users</Link>
                    </li>
                <li className="nav-item mb-2">
                    <Link to="/patients" className="nav-link text-dark">Patients</Link>
                    </li>
                <li className="nav-item mb-2">
                    <Link to="/doctors" className="nav-link text-dark">Doctors</Link>
                    </li>
                <li className="nav-item mb-2">
                    <Link to="/appointments" className="nav-link text-dark">Appointments</Link>
                    </li>
                <li className="nav-item mb-2">
                    <Link to="/medical-records" className="nav-link text-dark">Medical Records</Link>
                    </li>
                <li className="nav-item mb-2">
                    <Link to="/files" className="nav-link text-dark">Files</Link>
                    </li>
                <li className="nav-item mb-2">
                    <Link to="/invoices" className="nav-link text-dark">Invoices</Link>
                    </li>
                <li className="nav-item mb-2">
                    <Link to="/payments" className="nav-link text-dark">Payments</Link>
                    </li>
                
            </ul>
        </div>
    )
}
export default Sidebar;