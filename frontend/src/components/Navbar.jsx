function Navbar(){
    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-3">
            <a className="navbar-brand fw-bold text-primary" href="/">
                HAP Hospital Management System
            </a>
            <div className="ms-auto">
                <button className="btn btn-outline-danger btn-sm">Logout</button>
            </div>
        </nav>
    )
}
export default Navbar;