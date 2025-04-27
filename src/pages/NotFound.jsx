import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-700 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Halaman tidak ditemukan</p>
      <Link
        to="/dashboard/skor-karyawan"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
