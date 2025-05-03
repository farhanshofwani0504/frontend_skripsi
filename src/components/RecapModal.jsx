import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

export default function RecapModal({ karyawan, token, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("monthly"); // monthly | quarterly | yearly

  /* --- FETCH OVERVIEW --- */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/penilaian/summary/overview/${karyawan.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setData({ error: "Gagal memuat rekap" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [karyawan.id, token]);

  const renderTable = (list, labelFmt) => (
    <table className="w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-2 py-1">Periode</th>
          <th className="border px-2 py-1">Rata‑rata Nilai</th>
        </tr>
      </thead>
      <tbody>
        {list.map((r) => (
          <tr key={r.period}>
            <td className="border px-2 py-1">
              {dayjs(r.period).format(labelFmt)}
            </td>
            <td className="border px-2 py-1 text-center">{r.avg_nilai}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-md w-[36rem] max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Rekap Penilaian – {karyawan.nama}
          </h3>
          <button onClick={onClose} className="text-red-600 font-bold">
            ✕
          </button>
        </div>

        {loading && <LoadingSpinner />}

        {data?.error && <p className="text-red-500 text-sm">{data.error}</p>}

        {data && !loading && !data.error && (
          <>
            {/* ---------- Kesimpulan ---------- */}
            <div className="bg-gray-100 p-3 rounded">
              <p>
                <strong>Kesimpulan:</strong> {data.kesimpulan}
              </p>
              <p className="text-xs mt-1">
                Masa kerja: {data.masaKerjaBulan} bulan, mulai 
                {dayjs(data.mulaiKerja).format("DD MMM YYYY")}
              </p>
            </div>

            {/* ---------- Tabs ---------- */}
            <div className="flex gap-2 text-sm">
              {["monthly", "quarterly", "yearly"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-2 py-1 rounded ${
                    tab === t ? "bg-blue-600 text-white" : "border"
                  }`}
                >
                  {t === "monthly"
                    ? "Bulanan"
                    : t === "quarterly"
                    ? "Kuartal"
                    : "Tahunan"}
                </button>
              ))}
            </div>

            {/* ---------- Table ---------- */}
            {tab === "monthly" && renderTable(data.monthly, "MMM YYYY")}
            {tab === "quarterly" && renderTable(data.quarterly, "[Q]Q YYYY")}
            {tab === "yearly" && renderTable(data.yearly, "YYYY")}
          </>
        )}
      </div>
    </div>
  );
}
