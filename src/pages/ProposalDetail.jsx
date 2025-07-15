import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProposalDetail() {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isOwner = user && user.role && user.role.toUpperCase() === "OWNER";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [catatanOwner, setCatatanOwner] = useState("");

  const fetchProposal = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/proposal/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProposal(data);
    } catch {
      setProposal(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposal();
    // eslint-disable-next-line
  }, [id]);

  const handleKeputusan = async (keputusan) => {
    const map = { APPROVED: "DISETUJUI", REJECTED: "DITOLAK" };
    const status = map[keputusan] || keputusan;
    if (!catatanOwner.trim()) {
      alert("Catatan wajib diisi!");
      return;
    }
    if (!window.confirm(`Yakin ingin ${status.toLowerCase()} proposal ini?`)) return;
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/proposal/${id}/keputusan`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, catatanOwner }),
      });
      if (!res.ok) throw new Error("Gagal memproses keputusan");
      fetchProposal();
      setCatatanOwner("");
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div>Memuat…</div>;
  if (!proposal) return <div className="text-red-500">Proposal tidak ditemukan</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <button onClick={() => navigate(-1)} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">&larr; Kembali</button>
      <h2 className="text-2xl font-bold mb-4">Detail Proposal Kontrak</h2>
      <div className="mb-4 space-y-1">
        <div><b>ID:</b> {proposal.id}</div>
        <div><b>ID Karyawan:</b> {proposal.karyawanId}</div>
        <div><b>Jenis:</b> {proposal.jenis}</div>
        <div><b>Alasan:</b> {proposal.alasan}</div>
        <div><b>Tanggal Pengajuan:</b> {proposal.tanggalPengajuan ? new Date(proposal.tanggalPengajuan).toLocaleString() : '-'}</div>
        <div><b>Status:</b> {proposal.status}</div>
        <div><b>Tanggal Keputusan:</b> {proposal.tanggalKeputusan ? new Date(proposal.tanggalKeputusan).toLocaleString() : '-'}</div>
        <div><b>Catatan Owner:</b> {proposal.catatanOwner || '-'}</div>
        <div><b>Tanggal Mulai Baru:</b> {proposal.tanggalMulaiBaru ? new Date(proposal.tanggalMulaiBaru).toLocaleDateString() : '-'}</div>
        <div><b>Tanggal Akhir Baru:</b> {proposal.tanggalAkhirBaru ? new Date(proposal.tanggalAkhirBaru).toLocaleDateString() : '-'}</div>
        <div><b>Dibuat oleh (ID):</b> {proposal.createdBy}</div>
        <div><b>Updated At:</b> {proposal.updatedAt ? new Date(proposal.updatedAt).toLocaleString() : '-'}</div>
      </div>
      {isOwner && proposal.status === "PENDING" && (
        <div className="flex flex-col gap-4 mt-6">
          <textarea
            className="border px-3 py-2 rounded"
            placeholder="Catatan Owner (wajib)"
            value={catatanOwner}
            onChange={e => setCatatanOwner(e.target.value)}
            required
          />
          <div className="flex gap-4">
            <button
              onClick={() => handleKeputusan("APPROVED")}
              disabled={actionLoading}
              className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleKeputusan("REJECTED")}
              disabled={actionLoading}
              className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 