import {Link} from "react-router-dom";


function Sidebar(){
    return(
        <div className="d-flex flex-column p-3 bg-light" style={{width: '250px', height: '100vh'}}>
            <h5 className="text-center mb-4 text-primary">Dashboard</h5>
            <ul className="nav flex-column">
                <li className="nav-item mb-2">
                    <Link to="/dashboard" className="nav-link text-dark">Home</Link>
                    </li>
                <li className="nav-item mb-2">
                    <Link to="/users" className="nav-link text-dark">users</Link>
                    </li>
                <li className="nav-item mb-2">
                    <Link to="/patients" className="nav-link text-dark">Patients</Link>
                    </li>
                <li className="nav-item mb-2">
                    <Link to="/appointments" className="nav-link text-dark">Appointments</Link>
                    </li>
                <li className="nav-item mb-2">
                    <Link to="/doctors" className="nav-link text-dark">Doctors</Link>
                    </li>
            </ul>
        </div>
    )
}
export default Sidebar;