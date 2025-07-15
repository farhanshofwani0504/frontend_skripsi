import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProposalList() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "", jenis: "" });
  const [showAdd, setShowAdd] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user && user.role && user.role.toUpperCase() === "ADMIN";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchProposals = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:3000/api/proposal";
      const params = [];
      if (filter.status) params.push(`status=${filter.status}`);
      if (filter.jenis) params.push(`jenis=${filter.jenis}`);
      if (params.length) url += `?${params.join("&")}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProposals(data);
    } catch {
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
    // eslint-disable-next-line
  }, [filter.status, filter.jenis]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Daftar Proposal Kontrak</h2>
        {isAdmin && (
          <button
            onClick={() => setShowAdd(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Buat Proposal
          </button>
        )}
      </div>
      <div className="flex gap-4 mb-4">
        <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))} className="border px-2 py-1 rounded">
          <option value="">Semua Status</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
        <select value={filter.jenis} onChange={e => setFilter(f => ({ ...f, jenis: e.target.value }))} className="border px-2 py-1 rounded">
          <option value="">Semua Jenis</option>
          <option value="PERPANJANGAN">PERPANJANGAN</option>
          <option value="PEMUTUSAN">PEMUTUSAN</option>
        </select>
      </div>
      {loading ? (
        <p>Memuat…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">ID</th>
                <th className="border px-3 py-2">Karyawan</th>
                <th className="border px-3 py-2">Jenis</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => (
                <tr key={p.id} className="even:bg-gray-50">
                  <td className="border px-3 py-2">{p.id}</td>
                  <td className="border px-3 py-2">{p.karyawanNama || p.karyawan?.nama || '-'}</td>
                  <td className="border px-3 py-2">{p.jenis}</td>
                  <td className="border px-3 py-2">{p.status}</td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => navigate(`/dashboard/proposal/${p.id}`)}
                      className="rounded bg-blue-500 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-600"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showAdd && isAdmin && (
        <ProposalModal onClose={() => setShowAdd(false)} onSuccess={fetchProposals} />
      )}
    </div>
  );
}

function ProposalModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ karyawanId: '', jenis: 'PERPANJANGAN', alasan: '', tanggalMulaiBaru: '', tanggalAkhirBaru: '' });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Siapkan payload sesuai kebutuhan
      const payload = {
        karyawanId: Number(form.karyawanId),
        jenis: form.jenis,
        alasan: form.alasan,
      };
      if (form.jenis === 'PERPANJANGAN') {
        payload.tanggalMulaiBaru = form.tanggalMulaiBaru;
        payload.tanggalAkhirBaru = form.tanggalAkhirBaru;
      }
      const res = await fetch("http://localhost:3000/api/proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal membuat proposal");
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h3 className="text-lg font-semibold mb-4">Buat Proposal Kontrak</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="karyawanId"
            value={form.karyawanId}
            onChange={handleChange}
            placeholder="ID Karyawan"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="jenis"
            value={form.jenis}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="PERPANJANGAN">PERPANJANGAN</option>
            <option value="PEMUTUSAN">PEMUTUSAN</option>
          </select>
          <textarea
            name="alasan"
            value={form.alasan}
            onChange={handleChange}
            placeholder="Alasan"
            className="w-full border px-3 py-2 rounded"
            required
          />
          {form.jenis === 'PERPANJANGAN' && (
            <>
              <label className="block text-sm">Tanggal Mulai Baru</label>
              <input
                type="date"
                name="tanggalMulaiBaru"
                value={form.tanggalMulaiBaru}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <label className="block text-sm">Tanggal Akhir Baru</label>
              <input
                type="date"
                name="tanggalAkhirBaru"
                value={form.tanggalAkhirBaru}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 