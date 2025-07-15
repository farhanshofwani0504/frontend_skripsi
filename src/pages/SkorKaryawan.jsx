import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddKaryawanModal from "../components/AddKaryawanModal";

export default function SkorKaryawan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user && user.role && user.role.toUpperCase() === "ADMIN";

  /* ------------ fetch list ------------ */
  const getData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/karyawan");
      const json = await res.json();
      setData(json);
    } catch {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  /* ------------ hapus ------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Hapus karyawan ini?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/karyawan/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Karyawan dihapus");
      getData();
    } catch {
      toast.error("Gagal hapus");
    }
  };

  /* ------------ UI ------------- */
  return (
    <div className="space-y-6">
      {/* bar judul + tombol */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Skor Karyawan</h2>
        {isAdmin && (
          <button
            onClick={() => setShowAdd(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Tambah Karyawan
          </button>
        )}
      </div>

      {/* tabel */}
      {loading ? (
        <p>Memuat…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Nama</th>
                <th className="border px-3 py-2">Posisi</th>
                <th className="border px-3 py-2">Skor</th>
                <th className="border px-3 py-2 w-40">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((k) => (
                <tr key={k.id} className="even:bg-gray-50">
                  <td className="border px-3 py-2">{k.nama}</td>
                  <td className="border px-3 py-2">{k.posisi}</td>
                  <td className="border px-3 py-2 text-center">
                    {k.skor.toFixed(2)}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => handleDelete(k.id)}
                      className="rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white
                                 hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* modal tambah */}
      {isAdmin && showAdd && (
        <AddKaryawanModal
          onClose={() => setShowAdd(false)}
          onSuccess={getData}
        />
      )}
    </div>
  );
}
