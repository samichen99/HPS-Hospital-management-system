import {Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout(){
    return(
        <div>
            <Navbar/>
            <div className="d-flex">
                <Sidebar />
                <div className="flex-grow-1 p-4">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}
export default MainLayout;