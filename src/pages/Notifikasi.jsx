import { useState } from "react";

export default function Notifikasi() {
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState("");

  const handleKirimWarning = async () => {
    setLoading(true);
    setHasil("");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "http://localhost:3000/api/notifikasi/kirim-peringatan",
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
        setHasil(data.message || "Peringatan berhasil dikirim!");
      } else {
        setHasil(data.error || "Gagal mengirim peringatan.");
      }
    } catch (err) {
      setHasil("Terjadi error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Kirim Notifikasi Warning</h1>

      <button
        onClick={handleKirimWarning}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? "Mengirim..." : "Kirim Email Warning"}
      </button>

      {hasil && (
        <div className="text-center mt-4 text-green-600 font-semibold">
          {hasil}
        </div>
      )}
    </div>
  );
}
