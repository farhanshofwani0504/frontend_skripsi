import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

export default function Penilaian() {
  const { id } = useParams(); // id karyawan
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ---------- STATE ---------- */
  const [karyawan, setKaryawan] = useState(null);
  const [penilaian, setPenilaian] = useState([]);
  const [loading, setLoading] = useState(true);

  /* --- bulan yang dipilih (YYYY-MM) --- */
  const [bulan, setBulan] = useState(dayjs().format("YYYY-MM"));
  const months = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format("YYYY-MM")
  );

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        /* karyawan */
        const k = await fetch(`http://localhost:3000/api/karyawan/${id}`).then(
          (r) => r.json()
        );
        setKaryawan(k);

        /* list kriteria */
        const list = await fetch("http://localhost:3000/api/kriteria").then(
          (r) => r.json()
        );

        /* default nilai = 1 */
        setPenilaian(
          list.map((kr) => ({
            kriteriaId: kr.id,
            nilai: 1,
            kriteria: kr,
          }))
        );
      } catch (e) {
        toast.error("Gagal memuat data");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  /* ---------- HANDLERS ---------- */
  const handleChange = (idx, val) =>
    setPenilaian((prev) => {
      const clone = [...prev];
      clone[idx].nilai = Number(val);
      return clone;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(
        penilaian.map((p) =>
          fetch("http://localhost:3000/api/penilaian", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              karyawanId: Number(id),
              kriteriaId: p.kriteriaId,
              nilai: p.nilai,
              bulan,
            }),
          })
        )
      );
      toast.success(
        `Penilaian bulan ${dayjs(bulan).format('MMM YYYY')} tersimpan`
      );
      navigate("/dashboard/skor-karyawan");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan penilaian");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <button onClick={() => navigate(-1)} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">&larr; Kembali</button>
      <h2 className="text-lg font-semibold">
        Penilaian: {karyawan?.nama ?? "-"}
      </h2>

      {/* ---------- PICK MONTH ---------- */}
      <label className="text-sm font-medium">
        Bulan penilaian:
        <select
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className="border px-2 py-1 ml-2 rounded"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {dayjs(m).format('MMMM YYYY')}
            </option>
          ))}
        </select>
      </label>

      {/* ---------- FORM ---------- */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {penilaian.map((p, i) => (
          <div key={p.kriteriaId} className="flex justify-between items-center">
            <span>{p.kriteria.nama}</span>
            <input
              type="number"
              min="1"
              max="5"
              value={p.nilai}
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-20 border rounded text-center"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
