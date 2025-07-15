import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import EmailModal from "../components/EmailModal";
import EditKaryawanModal from "../components/EditKaryawanModal";
import RecapModal from "../components/RecapModal";
import { toast } from "react-toastify";

export default function DetailKaryawan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showRekap, setShowRekap] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [pemecatanResult, setPemecatanResult] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user && user.role && user.role.toUpperCase() === "ADMIN";

  const refreshData = () => {
    setLoading(true);
    fetch(`http://localhost:3000/api/karyawan/${id}/penilaian`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line
  }, [id, token]);

  const handleDelete = async () => {
    if (!window.confirm("Yakin hapus karyawan?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/karyawan/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus karyawan");
      toast.success("✅  Karyawan berhasil dihapus", { icon: false });
      navigate(-1);
    } catch (err) {
      toast.error(err.message, { icon: false });
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/karyawan/${id}/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal download PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Laporan_Kinerja_${data.nama?.replace(/ /g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Gagal download PDF", { icon: false });
    }
  };

  const handleReviewPerpanjangan = async () => {
    setReviewResult(null);
    try {
      const res = await fetch(`http://localhost:3000/api/karyawan/${id}/review-perpanjangan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReviewResult(data);
      toast.success("Review perpanjangan berhasil!");
    } catch {
      setReviewResult({ error: "Gagal review perpanjangan" });
      toast.error("Gagal review perpanjangan");
    }
  };

  const handlePemecatan = async () => {
    setPemecatanResult(null);
    try {
      const res = await fetch(`http://localhost:3000/api/karyawan/${id}/pemecatan`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPemecatanResult(data);
      toast.success("Pemecatan berhasil!");
    } catch {
      setPemecatanResult({ error: "Gagal melakukan pemecatan" });
      toast.error("Gagal melakukan pemecatan");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="text-center text-red-500">Data tidak ditemukan</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <button onClick={() => navigate(-1)} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">&larr; Kembali</button>
      <h2 className="text-2xl font-bold mb-2">Detail Karyawan</h2>
      <div className="mb-4">
        <div><b>Nama:</b> {data.nama}</div>
        <div><b>Email:</b> {data.email}</div>
        <div><b>Posisi:</b> {data.posisi}</div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {isAdmin && (
          <>
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => navigate(`/dashboard/penilaian/${id}`)}>Penilaian</button>
            <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => setShowEdit(true)}>Edit</button>
            <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={handleDelete}>Delete</button>
          </>
        )}
        <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => setShowEmail(true)}>Kirim Email</button>
        <button className="bg-gray-700 text-white px-3 py-1 rounded" onClick={() => setShowRekap(true)}>Rekap</button>
        <button className="bg-purple-700 text-white px-3 py-1 rounded" onClick={handleDownloadPdf}>Download PDF</button>
        <button className="bg-indigo-600 text-white px-3 py-1 rounded" onClick={handleReviewPerpanjangan}>
          Review Perpanjangan
        </button>
        {isAdmin && (
          <button className="bg-red-700 text-white px-3 py-1 rounded" onClick={handlePemecatan}>
            Pemecatan
          </button>
        )}
      </div>
      {reviewResult && (
        <div className="mb-4 p-3 bg-gray-100 rounded border">
          {reviewResult.error ? (
            <div className="text-red-600 font-semibold">{reviewResult.error}</div>
          ) : (
            <>
              <div className="font-semibold mb-1">Hasil Review Perpanjangan:</div>
              <div><b>Rata-rata Nilai:</b> {reviewResult.rataRata}</div>
              <div><b>Grade:</b> {reviewResult.grade}</div>
              <div><b>Rekomendasi:</b> {reviewResult.rekomendasi}</div>
              <div><b>Total Penilaian:</b> {reviewResult.totalPenilaian}</div>
              <div className="mt-2 font-semibold">Histori Kontrak:</div>
              <table className="text-xs w-full border mt-1">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Mulai</th>
                    <th className="border px-2 py-1">Akhir</th>
                    <th className="border px-2 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewResult.historiKontrak?.map((h, i) => (
                    <tr key={i}>
                      <td className="border px-2 py-1">{h.mulai}</td>
                      <td className="border px-2 py-1">{h.akhir}</td>
                      <td className="border px-2 py-1">{h.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
      {pemecatanResult && (
        <div className="mb-4 p-3 bg-gray-100 rounded border">
          {pemecatanResult.error ? (
            <div className="text-red-600 font-semibold">{pemecatanResult.error}</div>
          ) : (
            <>
              <div className="font-semibold mb-1">Hasil Pemecatan:</div>
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(pemecatanResult, null, 2)}</pre>
            </>
          )}
        </div>
      )}
      {showEmail && <EmailModal karyawan={data} onClose={() => setShowEmail(false)} refreshData={refreshData} />}
      {showEdit && <EditKaryawanModal karyawan={data} token={token} onClose={() => setShowEdit(false)} onSuccess={refreshData} />}
      {showRekap && <RecapModal karyawan={data} token={token} onClose={() => setShowRekap(false)} />}
      <h3 className="text-lg font-semibold mb-2">Riwayat Penilaian</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1">Nilai</th>
              <th className="border px-2 py-1">Kriteria</th>
              <th className="border px-2 py-1">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {data.penilaian && data.penilaian.length > 0 ? (
              data.penilaian.map((p) => (
                <tr key={p.id}>
                  <td className="border px-2 py-1">{p.nilai}</td>
                  <td className="border px-2 py-1">
                    {p.kriteria
                      ? (typeof p.kriteria === "object"
                          ? p.kriteria.nama || JSON.stringify(p.kriteria)
                          : p.kriteria)
                      : p.kriteriaId}
                  </td>
                  <td className="border px-2 py-1">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} className="text-center text-gray-500">Belum ada penilaian</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 