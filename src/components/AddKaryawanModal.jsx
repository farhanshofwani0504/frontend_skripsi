import { useState } from "react";
import { toast } from "react-toastify"; // ⬅️ toastify
import "react-toastify/dist/ReactToastify.css"; // sekali saja (bisa di root)

export default function AddKaryawanModal({ onClose, onSuccess, token }) {
  const [form, setForm] = useState({ nama: "", posisi: "", email: "" });
  const [loading, setLoading] = useState(false);

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

      if (!res.ok) throw new Error("Gagal menambah karyawan");

      toast.success("✅  Karyawan berhasil ditambahkan", { icon: false });
      onSuccess(); // refresh list di dashboard
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Gagal menambah karyawan", { icon: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-80">
        <h3 className="text-lg font-semibold mb-4">Tambah Karyawan</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          {["nama", "posisi", "email"].map((f) => (
            <input
              key={f}
              name={f}
              value={form[f]}
              onChange={handleChange}
              placeholder={f[0].toUpperCase() + f.slice(1)}
              required={f !== "email"}
              className="w-full border px-3 py-2 rounded"
            />
          ))}

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
              {loading ? "Saving..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
