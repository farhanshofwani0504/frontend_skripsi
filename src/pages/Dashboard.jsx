import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Dashboard HRD System
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Card Skor Karyawan */}
        <Link
          to="/dashboard/skor-karyawan"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2 text-blue-600">
            📋 Skor Karyawan
          </h2>
          <p className="text-gray-600">
            Lihat dan analisa skor penilaian seluruh karyawan.
          </p>
        </Link>

        {/* Card Kesimpulan Global */}
        <Link
          to="/dashboard/kesimpulan-global"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2 text-green-600">
            📊 Kesimpulan Global
          </h2>
          <p className="text-gray-600">
            Ringkasan kinerja keseluruhan berdasarkan kriteria yang ada.
          </p>
        </Link>

        {/* Card Notifikasi Warning */}
        <Link
          to="/dashboard/notifikasi"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2 text-red-600">
            📩 Notifikasi Warning
          </h2>
          <p className="text-gray-600">
            Kirim email peringatan untuk karyawan dengan skor rendah.
          </p>
        </Link>
      </div>
    </div>
  );
}
