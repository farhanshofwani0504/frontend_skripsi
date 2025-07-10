import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

import CrBadge from "../components/CrBadge";
import GradeBadge from "../components/GradeBadge";
import RowActions from "@/components/RowActions";
import LoadingSpinner from "../components/LoadingSpinner";
import "../Style/DashboardSkorKaryawan.css";
import { useRef } from "react";

export default function DashboardSkorKaryawan() {
  /* ---------- STATE ---------- */
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bobotOk, setBobotOk] = useState(true);
  const [overallCR, setOverallCR] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [importType, setImportType] = useState(null); // 'karyawan' | 'nilai'
  const fileInputRef = useRef();

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

  useEffect(() => {
    // DEBUG: Cek struktur data endpoint penilaian
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/api/karyawan/1/penilaian", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("[DEBUG] /karyawan/1/penilaian", data);
      })
      .catch((err) => console.error("[DEBUG] error penilaian", err));
  }, []);

  /* ---------- UTIL ---------- */
  const rowColor = {
    A: "row-green",
    B: "row-green",
    C: "row-yellow",
    D: "row-red",
    E: "row-red",
  };

  const handleOpenImport = (type) => {
    setImportType(type);
    setImportResult(null);
    fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const endpoint = importType === "karyawan"
      ? "http://localhost:3000/api/karyawan/import-csv-karyawan"
      : "http://localhost:3000/api/karyawan/import-csv-nilai";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      setImportResult(data);
      if (importType === "karyawan") fetchData();
      toast.success("Import berhasil!");
    } catch {
      setImportResult({ error: "Gagal import" });
      toast.error("Gagal import");
    }
  };

  /* ---------- ACTIONS ---------- */

  /* ---------- UI ---------- */
  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-skor-karyawan">
      <button onClick={() => navigate(-1)} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">&larr; Kembali</button>
      <h2 className="text-xl font-bold mb-3">
        Daftar Karyawan
        <span className="ml-3">
          <CrBadge cr={overallCR} />
        </span>
      </h2>

      {!bobotOk && (
        <p className="text-red-600 text-sm mb-2">
          Warning: Bobot kriteria belum dinormalisasi (Σ ≠ 1)
        </p>
      )}

      {/* ADD */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAdd(true)}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          + Tambah Karyawan
        </button>
      </div>

      {/* IMPORT BUTTONS */}
      <div className="flex gap-2 mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          onClick={() => handleOpenImport("karyawan")}
        >
          Upload CSV Karyawan
        </button>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
          onClick={() => handleOpenImport("nilai")}
        >
          Upload CSV Nilai
        </button>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleImport}
          style={{ display: "none" }}
        />
      </div>
      {/* IMPORT RESULT */}
      {importResult && (
        <div className="mb-4 p-3 bg-gray-100 rounded border">
          {importResult.error ? (
            <div className="text-red-600 font-semibold">{importResult.error}</div>
          ) : (
            <>
              <div className="font-semibold mb-1">Hasil Import:</div>
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(importResult, null, 2)}</pre>
            </>
          )}
        </div>
      )}

      {/* TABLE */}
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Posisi</th>
              <th>Grade (3 bulan)</th>
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
                  <button
                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    onClick={() => navigate(`/dashboard/karyawan/${k.id}`)}
                  >
                    Detail
                  </button>
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
      {showAdd && (
        <AddKaryawanModal
          token={token}
          onClose={() => setShowAdd(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
