import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import EmailModal from "../components/EmailModal";
import "../Style/DashboardSkorKaryawan.css"; // ✅ Import style hanya untuk page ini

export default function DashboardSkorKaryawan() {
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
      const res = await fetch("http://localhost:3000/api/ranking", {
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

  const getStatus = (skor) => {
    if (skor >= 4) return "Sangat Baik";
    if (skor >= 2.5) return "Perlu Ditingkatkan";
    return "Warning";
  };

  const getRowColor = (skor) => {
    if (skor >= 4) return "row-green";
    if (skor >= 2.5) return "row-yellow";
    return "row-red";
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-skor-karyawan">
      <h2>Skor Karyawan</h2>

      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Posisi</th>
              <th>Skor</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {karyawan.map((k) => (
              <tr key={k.id} className={getRowColor(k.totalSkor)}>
                <td>{k.nama}</td>
                <td>{k.posisi}</td>
                <td>{k.totalSkor.toFixed(2)}</td>
                <td>{getStatus(k.totalSkor)}</td>
                <td className="aksi-buttons">
                  <button
                    onClick={() => navigate(`/dashboard/penilaian/${k.id}`)}
                  >
                    Penilaian
                  </button>
                  <button onClick={() => handleSendEmail(k)}>
                    Kirim Email
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
