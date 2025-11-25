
function 
Navbar(){
    return(
        <nav className="navbar navbar-expand-lg navbar-dark shadow-sm px-3" style={{backgroundColor: "#005a9bff"}}>
            <a className="navbar-brand fw-bold text-light" href="/">
                HAP Hospital Management System
            </a>
            <div className="ms-auto">
                <button className="btn btn-info btn-sm" >Logout</button>
            </div>
        </nav>
    )
}
export default Navbar;