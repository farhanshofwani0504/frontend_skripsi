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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/karyawan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Gagal menambah karyawan");
      }
      toast.success("Karyawan ditambahkan");
      onSuccess(); // refetch list
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ——— UI modal ——— */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Tambah Karyawan</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="nama"
            placeholder="Nama"
            required
            className="w-full rounded border px-3 py-2 text-sm"
            onChange={handleChange}
          />
          <input
            name="posisi"
            placeholder="Posisi"
            required
            className="w-full rounded border px-3 py-2 text-sm"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full rounded border px-3 py-2 text-sm"
            onChange={handleChange}
          />
          <input
            type="number"
            step="0.01"
            name="skor"
            placeholder="Skor awal (opsional)"
            className="w-full rounded border px-3 py-2 text-sm"
            onChange={handleChange}
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
