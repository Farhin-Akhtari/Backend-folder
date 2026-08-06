import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

function MainLayout(){
    return (
     <>
        <Navbar /> 

        <div className="flex">
            <Sidebar/>

            <main className="flex-1 min-w-0 ml-64 px-8 py-6 mt-16">
            <Outlet />
        </main>
        </div>
     </>
    );
}

export default MainLayout;