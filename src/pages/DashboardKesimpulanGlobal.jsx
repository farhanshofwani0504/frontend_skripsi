import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from "react-router-dom";


export default function DashboardKesimpulanGlobal() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch('http://localhost:3000/api/dashboard/kesimpulan', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal fetch kesimpulan:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <p>Data tidak tersedia.</p>;

  return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">&larr; Kembali</button>
      <h2 className="text-2xl font-bold mb-4">Kesimpulan Global</h2>

      {/* Kesimpulan Utama */}
      <div className="bg-green-100 text-green-800 p-4 rounded mb-6">
        {data.kesimpulan}
      </div>

      {/* Detail Total Kriteria */}
      <h4 className="text-lg font-semibold mb-2">Total Nilai per Kriteria:</h4>
      <ul className="list-disc list-inside">
        {data.detail.map((item, i) => (
          <li key={i}>
            {item.kriteria}: {item.total}
          </li>
        ))}
      </ul>
    </div>
  );
}
