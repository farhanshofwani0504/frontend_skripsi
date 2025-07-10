import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <>
      <Sidebar />
      <main className="min-h-screen bg-gray-100 px-4 md:px-6 py-8 ml-64">
        {children ? children : <Outlet />}
      </main>
    </>
  );
}
