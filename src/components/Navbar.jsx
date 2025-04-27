import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo_landscape1.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const pages = [
    { to: "/dashboard/skor-karyawan", label: "Skor Karyawan" },
    { to: "/dashboard/kesimpulan", label: "Kesimpulan Global" },
  ];

  const link =
    "block px-4 py-2 md:px-0 md:py-0 text-base text-gray-700 hover:text-blue-600";

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logout berhasil");
    nav("/login");
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 py-4">
        {/* brand */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            className="h-8 w-auto origin-left scale-125 -my-[3px]" /* logo ≈ 40 px */
          />
          <span className="sr-only">Dashboard</span>
        </Link>

        {/* hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-gray-600 hover:text-blue-600 md:hidden"
        >
          {open ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* desktop menu */}
        <ul className="hidden items-center gap-12 md:flex">
          {pages.map((p) => (
            <li key={p.to}>
              <Link to={p.to} className={link}>
                {p.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={logout}
              className="rounded-md bg-red-500 px-5 py-2 text-base font-semibold text-white hover:bg-red-600"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* mobile drawer */}
      <div
        className={`md:hidden transition-max-h duration-300 overflow-hidden ${
          open ? "max-h-48 border-t" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col bg-white px-4 py-2">
          {pages.map((p) => (
            <li key={p.to}>
              <Link to={p.to} className={link} onClick={() => setOpen(false)}>
                {p.label}
              </Link>
            </li>
          ))}
          <li className="mt-2">
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full rounded-md bg-red-500 px-4 py-2 text-base font-semibold text-white hover:bg-red-600"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
