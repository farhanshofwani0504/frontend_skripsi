import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImg from "../assets/logo1.png";

export default function Sidebar() {
  const [user] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const location = useLocation();
  const navigate = useNavigate();

  const nav = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/dashboard/skor-karyawan", label: "Daftar Karyawan" },
    { to: "/dashboard/kesimpulan", label: "Kesimpulan Global" },
  ];
  if (user && user.role && ["admin","owner"].includes(user.role.toLowerCase())) {
    nav.push({ to: "/dashboard/proposal", label: "Proposal Kontrak" });
  }
  if (user && user.role && user.role.toLowerCase() === "admin") {
    nav.push({ to: "/dashboard/users", label: "Manajemen User" });
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="h-screen w-64 bg-white shadow-lg flex flex-col fixed left-0 top-0 z-40">
      <div className="flex flex-col items-center py-6 border-b">
        <img src={logoImg} alt="Logo" className="h-12 mb-2" />
      </div>
      <div className="flex flex-col items-center py-6 border-b">
        {user ? (
          <>
            <div className="font-semibold text-gray-800">{user.nama || user.username || user.name || "-"}</div>
            <div className="text-xs text-gray-500">{user.email || "-"}</div>
            {user.role && (
              <div className="text-xs font-bold text-blue-700 mt-1">{user.role.toUpperCase()}</div>
            )}
          </>
        ) : (
          <div className="text-red-500 text-sm">User tidak ditemukan</div>
        )}
      </div>
      <nav className="flex-1 flex flex-col gap-1 mt-4 px-4">
        {nav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={`rounded px-3 py-2 font-medium text-left transition
              ${location.pathname === n.to ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"}`}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold"
        >
          Logout
        </button>
      </div>
    </aside>
  );
} 