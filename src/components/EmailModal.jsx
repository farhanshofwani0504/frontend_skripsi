import { useState } from "react";
import "../Style/EmailModal.css";

export default function EmailModal({
  karyawan,
  refreshData = () => {},
  onClose,
}) {
  const [jenisEmail, setJenisEmail] = useState("peringatan");
  const [loading, setLoading] = useState(false); // ➡️ Tambah loading state
  const [sending, setSending] = useState(false);

  const token = localStorage.getItem("token");

  const handleKirim = async () => {
    try {
      setSending(true); // 🔥 Mulai loading
      await fetch("http://localhost:3000/api/notifikasi/kirim-email-karyawan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          karyawanId: karyawan.id,
          jenisEmail,
        }),
      });

      alert("Email berhasil dikirim!");

      if (refreshData) refreshData();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim email.");
    } finally {
      setSending(false); // 🔥 Stop loading
    }
  };

  return (
    <div className="button-group">
      <button
        className={`btn ${
          jenisEmail === "pujian" ? "btn-green active" : "btn-green"
        }`}
        onClick={() => setJenisEmail("pujian")}
      >
        Pujian
      </button>
      <button
        className={`btn ${
          jenisEmail === "perlu-peningkatan"
            ? "btn-yellow active"
            : "btn-yellow"
        }`}
        onClick={() => setJenisEmail("perlu-peningkatan")}
      >
        Perlu Peningkatan
      </button>
      <button
        className={`btn ${
          jenisEmail === "peringatan" ? "btn-red active" : "btn-red"
        }`}
        onClick={() => setJenisEmail("peringatan")}
      >
        Peringatan
      </button>
    </div>
  );
}
