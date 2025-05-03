import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import RowActions from "@/components/RowActions"; // ⬅️  default import
import LoadingSpinner from "../components/LoadingSpinner";
import EmailModal from "../components/EmailModal";
import AddKaryawanModal from "../components/AddKaryawanModal";
import EditKaryawanModal from "../components/EditKaryawanModal";
import RecapModal from "../components/RecapModal";
import "../Style/DashboardSkorKaryawan.css";

export default function DashboardSkorKaryawan() {
  /* ---------- STATE ---------- */
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bobotOk, setBobotOk] = useState(true);
  const [bobotSum, setBobotSum] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [showRecap, setShowRecap] = useState(false);
  const [recapTarget, setRecapTarget] = useState(null);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  /* ---------- LOAD RANKING & BOBOT ---------- */
  const fetchData = async () => {
    setLoading(true);
    try {
      // ranking
      const res = await fetch("http://localhost:3000/api/ranking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Server error (${res.status})`);
      setKaryawan(await res.json());

      // bobot
      const bob = await fetch("http://localhost:3000/api/bobot").then((r) =>
        r.json()
      );
      const sum = bob.reduce((a, b) => a + b.bobot, 0);
      setBobotOk(Math.abs(sum - 1) < 0.01);
      setBobotSum(sum);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data", { icon: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  /* ---------- UTILS ---------- */
  const getStatus = (skor) => {
    if (bobotSum == null) return "-";
    const min = 1 * bobotSum;
    const max = 5 * bobotSum;
    const pct = (skor - min) / (max - min);
    if (pct >= 0.8) return "Sangat Baik";
    if (pct >= 0.5) return "Perlu Ditingkatkan";
    return "Warning";
  };
  const getRowColor = (skor) => {
    if (bobotSum == null) return "";
    const min = 1 * bobotSum;
    const max = 5 * bobotSum;
    const pct = (skor - min) / (max - min);
    if (pct >= 0.8) return "row-green";
    if (pct >= 0.5) return "row-yellow";
    return "row-red";
  };

  /* ---------- ACTION HANDLERS ---------- */
  const handleSendEmail = (k) => {
    setSelectedKaryawan(k);
    setShowEmailModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus karyawan?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/karyawan/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus karyawan");
      toast.success("✅  Karyawan berhasil dihapus", { icon: false });
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.message, { icon: false });
    }
  };

  /* ---------- RENDER ---------- */
  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-skor-karyawan">
      <h2>Skor Karyawan</h2>

      {!bobotOk && (
        <p className="text-red-600 text-sm mb-2">
          Warning: Bobot kriteria belum dinormalisasi (Σ ≠ 1)
        </p>
      )}

      {/* ADD */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAdd(true)}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          + Tambah Karyawan
        </button>
      </div>

      {/* TABLE */}
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
                <td className="text-center">
                  <RowActions
                    k={k}
                    onActions={{
                      penilaian: () => navigate(`/dashboard/penilaian/${k.id}`),
                      email: handleSendEmail,
                      edit: () => {
                        setEditTarget(k);
                        setShowEdit(true);
                      },
                      delete: () => handleDelete(k.id),
                      rekap: () => {
                        setRecapTarget(k);
                        setShowRecap(true);
                      },
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      {showEmailModal && selectedKaryawan && (
        <EmailModal
          karyawan={selectedKaryawan}
          onClose={() => setShowEmailModal(false)}
          refreshData={fetchData}
        />
      )}
      {showAdd && (
        <AddKaryawanModal
          token={token}
          onClose={() => setShowAdd(false)}
          onSuccess={fetchData}
        />
      )}
      {showEdit && editTarget && (
        <EditKaryawanModal
          karyawan={editTarget}
          token={token}
          onClose={() => setShowEdit(false)}
          onSuccess={fetchData}
        />
      )}
      {showRecap && recapTarget && (
        <RecapModal
          karyawan={recapTarget}
          token={token}
          onClose={() => setShowRecap(false)}
        />
      )}
    </div>
  );
}
