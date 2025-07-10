import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  const lineChartData = {
    labels: karyawan.map((k) => k.nama),
    datasets: [
      {
        label: "Rata-rata Nilai",
        data: karyawan.map((k) => k.rollingAvg ?? 0),
        borderColor: "#2563eb", // biru
        backgroundColor: "rgba(37,99,235,0.2)",
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#2563eb",
        tension: 0.3,
        fill: false,
      },
    ],
  };
  const lineChartOptions = {
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
        ticks: { display: false }, // Sembunyikan label nama
        grid: { display: true },
      },
    },
  };

  // State page per grade
  const [gradePages, setGradePages] = useState({ A: 0, B: 0, C: 0, D: 0, E: 0 });
  const pageSize = 5;
  // Helper: filter dan ambil 5 karyawan per grade sesuai page
  const getPagedByGrade = (grade) => {
    const filtered = karyawan
      .filter((k) => k.grade === grade)
      .sort((a, b) => (b.rollingAvg ?? 0) - (a.rollingAvg ?? 0));
    const page = gradePages[grade] || 0;
    return filtered.slice(page * pageSize, (page + 1) * pageSize);
  };
  const getTotalData = (grade) => karyawan.filter((k) => k.grade === grade).length;
  const grades = ["A", "B", "C", "D", "E"];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Dashboard HRD System
      </h1>

      {/* LINE CHART */}
      <div className="mb-8 w-full min-h-[250px]">
        {loading ? (
          <div className="text-center text-gray-500">Memuat data…</div>
        ) : karyawan.length === 0 ? (
          <div className="text-center text-gray-500">Belum ada data karyawan.</div>
        ) : (
          <Line data={lineChartData} options={lineChartOptions} />
        )}
      </div>

      {/* TABEL PER GRADE */}
      <div className="w-full flex flex-col gap-6 mt-8 mx-auto">
        {grades.map((g) => {
          const list = getPagedByGrade(g);
          const totalData = getTotalData(g);
          const page = gradePages[g] || 0;
          return (
            <div key={g} className="bg-white rounded-lg shadow p-4">
              <h3 className={`font-bold text-lg mb-2 text-center ${
                g === "A"
                  ? "text-green-600"
                  : g === "B"
                  ? "text-blue-600"
                  : g === "C"
                  ? "text-yellow-600"
                  : g === "D"
                  ? "text-orange-600"
                  : "text-red-600"
              }`}>Grade {g}</h3>
              <table className="w-full text-sm border table-fixed">
                <thead>
                  <tr>
                    <th className="border px-2 py-1 w-1/5">Nama</th>
                    <th className="border px-2 py-1 w-2/5">Posisi</th>
                    <th className="border px-2 py-1 w-1/6">Nilai</th>
                    <th className="border px-2 py-1 w-1/6">Grade</th>
                    <th className="border px-2 py-1 w-1/6">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {totalData === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-2">Tidak ada data</td>
                    </tr>
                  ) : (
                    list.map((k) => (
                      <tr key={k.id}>
                        <td className="border px-2 py-1">{k.nama}</td>
                        <td className="border px-2 py-1">{k.posisi}</td>
                        <td className="border px-2 py-1 text-center">{k.rollingAvg?.toFixed(2) ?? '-'}</td>
                        <td className="border px-2 py-1 text-center">{k.grade}</td>
                        <td className="border px-2 py-1 text-center">
                          <button
                            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                            onClick={() => navigate(`/dashboard/karyawan/${k.id}`)}
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                  onClick={() => setGradePages((prev) => ({ ...prev, [g]: page - 1 }))}
                  disabled={page === 0}
                >
                  Back
                </button>
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                  onClick={() => setGradePages((prev) => ({ ...prev, [g]: page + 1 }))}
                  disabled={(page + 1) * pageSize >= totalData}
                >
                  Next
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
