import { useState } from "react";

export default function NotifikasiPemecatan() {
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState([]);
  const [pesan, setPesan] = useState("");

  const handleKirimPemecatan = async () => {
    setLoading(true);
    setHasil([]);
    setPesan("");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "http://localhost:3000/api/notifikasi/pemecatan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setHasil(data.data || []);
        setPesan(data.message || "Pemecatan berhasil dikirim.");
      } else {
        setPesan(data.error || "Gagal mengirim pemecatan.");
      }
    } catch (err) {
      setPesan("Terjadi error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-6 text-red-600">
        Kirim Notifikasi Pemecatan 💣
      </h1>

      <button
        onClick={handleKirimPemecatan}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mb-6"
      >
        {loading ? "Mengirim..." : "Kirim Email Pemecatan"}
      </button>

      {pesan && (
        <div className="text-center font-semibold text-lg text-gray-800 mb-2">
          {pesan}
        </div>
      )}

      {hasil.length > 0 && (
        <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-4">
          <h2 className="font-semibold text-gray-700 mb-2">
            Daftar yang dikirim:
          </h2>
          <ul className="list-disc pl-6 text-sm">
            {hasil.map((item, index) => (
              <li key={index}>
                <strong>{item.nama}</strong>: {item.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
