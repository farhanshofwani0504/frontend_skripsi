import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CrBadge from "../components/CrBadge";
import GradeBadge from "../components/GradeBadge";
import RowActions from "@/components/RowActions";
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
  const [overallCR, setOverallCR] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [showRecap, setShowRecap] = useState(false);
  const [recapTarget, setRecapTarget] = useState(null);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  /* ---------- LOAD DATA ---------- */
  const fetchData = async () => {
    setLoading(true);
    try {
      /* 1. ranking (+ grade & rollingAvg sudah dikirim BE) */
      const res = await fetch("http://localhost:3000/api/karyawan", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Server error (${res.status})`);
      const ranking = await res.json();
      setKaryawan(ranking);

      /* 2. bobot (buat cek normalisasi & ambil CR) */
      const bobot = await fetch("http://localhost:3000/api/bobot").then((r) =>
        r.json()
      );
      const sum = bobot.reduce((a, b) => a + b.bobot, 0);
      setBobotOk(Math.abs(sum - 1) < 0.01);
      setOverallCR(bobot[0]?.cr ?? null);
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

  /* ---------- UTIL ---------- */
  const rowColor = {
    A: "row-green",
    B: "row-green",
    C: "row-yellow",
    D: "row-red",
    E: "row-red",
  };

  /* ---------- ACTIONS ---------- */
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

  /* ---------- UI ---------- */
  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-skor-karyawan">
      <h2 className="text-xl font-bold mb-3">
        Dashboard Skor Karyawan{" "}
        <span className="ml-3">
          <CrBadge cr={overallCR} />
        </span>
      </h2>

      {!bobotOk && (
        <p className="text-red-600 text-sm mb-2">
          Warning: Bobot kriteria belum dinormalisasi (Σ ≠ 1)
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
              <th>Grade (3 bulan)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {karyawan.map((k) => (
              <tr key={k.id} className={rowColor[k.grade]}>
                <td>{k.nama}</td>
                <td>{k.posisi}</td>
                <td className="text-center">
                  <GradeBadge grade={k.grade} avg={k.rollingAvg} />
                </td>
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

      {/* LEGEND */}
      <footer className="mt-4 text-sm text-gray-600">
        Legend: <span className="font-bold text-green-600">A</span> Excellent •{" "}
        <span className="font-bold text-blue-600">B</span> Good •{" "}
        <span className="font-bold text-yellow-600">C</span> Fair •{" "}
        <span className="font-bold text-orange-600">D</span> Poor •{" "}
        <span className="font-bold text-red-600">E</span> Critical
      </footer>

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
