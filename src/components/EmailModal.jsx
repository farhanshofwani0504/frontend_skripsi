import { useEffect, useState } from "react";
import EmailImg from "../assets/email-illustration.svg";
import "../Style/EmailModal.css";

export default function EmailModal({
  karyawan,
  onClose,
  refreshData = () => {},
}) {
  const [jenisEmail, setJenisEmail] = useState("");
  const [sending, setSending] = useState(false);
  const token = localStorage.getItem("token");

  // Gunakan grade dari karyawan langsung
  const grade = karyawan.grade || "N/A";

  const status =
    grade === "A"
      ? "sangat-baik"
      : ["B", "C"].includes(grade)
      ? "perlu-peningkatan"
      : "peringatan";

  const opsi = {
    "sangat-baik": [{ key: "pujian", label: "Pujian", cls: "chip-green" }],
    "perlu-peningkatan": [
      { key: "peningkatan", label: "Perlu Peningkatan", cls: "chip-yellow" },
    ],
    peringatan: [{ key: "peringatan", label: "Peringatan", cls: "chip-red" }],
  }[status];

  useEffect(() => setJenisEmail(""), [karyawan]);

  const handleKirim = async () => {
    try {
      if (!jenisEmail) return;
      setSending(true);
      await fetch("http://localhost:3000/api/notifikasi/kirim-email-karyawan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ karyawanId: karyawan.id, jenisEmail }),
      });
      alert("Email berhasil dikirim!");
      refreshData();
      onClose();
    } catch (err) {
      alert("Gagal mengirim email.");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Kirim email ke {karyawan.nama}</h3>
        <p className="modal-sub">
          Grade performa: <strong>{grade}</strong>
        </p>
        <img
          src={EmailImg}
          alt="Email illustration"
          className="modal-illustration"
        />

        <div className="btn-group">
          {opsi.map((o) => (
            <button
              key={o.key}
              className={`chip ${o.cls} ${
                jenisEmail === o.key ? "active" : ""
              }`}
              onClick={() => setJenisEmail(o.key)}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button
            className="btn-primary"
            disabled={!jenisEmail || sending}
            onClick={handleKirim}
          >
            {sending ? "Mengirim…" : "Kirim"}
          </button>
        </div>
      </div>
    </div>
  );
}
