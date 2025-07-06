import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/karyawan", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Server error (${res.status})`);
        const ranking = await res.json();
        setKaryawan(ranking);
      } catch {
        setKaryawan([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const barChartData = {
    labels: karyawan.map((k) => k.nama),
    datasets: [
      {
        label: "Rata-rata Nilai",
        data: karyawan.map((k) => k.rollingAvg ?? 0),
        backgroundColor: "#2563eb",
        borderRadius: 6,
        maxBarThickness: 40,
      },
    ],
  };
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Rata-rata Nilai Tiap Karyawan",
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `Nilai: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        title: { display: true, text: "Nilai" },
      },
      x: {
        title: { display: true, text: "Nama Karyawan" },
      },
    },
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Dashboard HRD System
      </h1>

      {/* BAR CHART */}
      <div className="mb-8 w-full max-w-5xl min-h-[250px]">
        {loading ? (
          <div className="text-center text-gray-500">Memuat data…</div>
        ) : karyawan.length === 0 ? (
          <div className="text-center text-gray-500">Belum ada data karyawan.</div>
        ) : (
          <Bar data={barChartData} options={barChartOptions} />
        )}
      </div>

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
          to="/dashboard/kesimpulan"
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
