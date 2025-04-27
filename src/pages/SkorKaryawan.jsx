import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailModal from "../components/EmailModal";

export default function SkorKaryawan() {
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/skor-karyawan", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setKaryawan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = (k) => {
    setSelectedKaryawan(k);
    setShowModal(true);
  };

  if (loading) return <p>Loading...</p>;

  const getStatus = (skor) => {
    if (skor >= 4) return "sangat-baik";
    if (skor >= 2.5) return "perlu-peningkatan";
    return "peringatan";
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Skor Karyawan</h2>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nama</th>
            <th className="border p-2">Posisi</th>
            <th className="border p-2">Skor</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {karyawan.map((k) => (
            <tr key={k.id} className="hover:bg-gray-100">
              <td className="border p-2">{k.nama}</td>
              <td className="border p-2">{k.posisi}</td>
              <td className="border p-2">{k.totalSkor.toFixed(2)}</td>
              <td className={`border p-2 ${getStatus(k.totalSkor)}`}>
                {k.totalSkor >= 4
                  ? "Sangat Baik"
                  : k.totalSkor >= 2.5
                  ? "Perlu Ditingkatkan"
                  : "Warning"}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleSendEmail(k)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Kirim Email
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedKaryawan && (
        <EmailModal
          karyawan={selectedKaryawan}
          onClose={() => setShowModal(false)}
          refreshData={fetchData}
        />
      )}
    </div>
  );
}
