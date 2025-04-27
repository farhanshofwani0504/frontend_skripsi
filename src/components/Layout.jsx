import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />

      {/* konten halaman */}
      <main className="min-h-screen bg-gray-100 px-4 md:px-6 py-8">
        {children ? children : <Outlet />}
      </main>
    </>
  );
}
