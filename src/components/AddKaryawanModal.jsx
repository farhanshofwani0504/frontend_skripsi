import { useState } from "react";
import { toast } from "react-toastify";

export default function AddKaryawanModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    nama: "",
    posisi: "",
    email: "",
    skor: 0,
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/karyawan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Gagal menambah karyawan");
      }
      toast.success("Karyawan ditambahkan");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Tambah Karyawan</h3>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="nama"
            placeholder="Nama"
            required
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <input
            name="posisi"
            placeholder="Posisi"
            required
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <input
            type="number"
            step="0.01"
            name="skor"
            placeholder="Skor awal (opsional)"
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
