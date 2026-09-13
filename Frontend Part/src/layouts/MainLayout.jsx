import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

function MainLayout(){
    return (
     <>
        <Navbar /> 

        <div className="flex">
            <Sidebar/>

           <main className="flex-1 min-w-0 ml-64 px-8 py-6 mt-16 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen">
            <Outlet />
        </main>
        </div>
     </>
    );
}

export default MainLayout;