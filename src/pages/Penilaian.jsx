import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

export default function Penilaian() {
  const { id } = useParams(); // id karyawan
  const [karyawan, setKaryawan] = useState(null);
  const [penilaian, setPenilaian] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Ambil data karyawan
        const resK = await fetch(`http://localhost:3000/api/karyawan/${id}`);
        if (!resK.ok) throw new Error("Gagal ambil data karyawan");
        const dataK = await resK.json();
        setKaryawan(dataK);

        // Ambil data penilaian
        const resP = await fetch(
          `http://localhost:3000/api/penilaian?karyawanId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resP.ok) throw new Error("Gagal ambil data penilaian");
        const dataP = await resP.json();
        setPenilaian(dataP);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleChange = (index, newNilai) => {
    const updated = [...penilaian];
    updated[index].nilai = parseFloat(newNilai);
    setPenilaian(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const p of penilaian) {
        await fetch("http://localhost:3000/api/penilaian", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            karyawanId: parseInt(id),
            kriteriaId: p.kriteriaId,
            nilai: p.nilai,
          }),
        });
      }
      toast.success("Penilaian berhasil disimpan!");
      navigate("/dashboard/skor-karyawan");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan penilaian.");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;

  return (
    <div>
      <h2>Penilaian: {karyawan?.nama || "Nama tidak ditemukan"}</h2>
      <form onSubmit={handleSubmit}>
        {penilaian.map((p, index) => (
          <div key={p.kriteriaId} style={{ marginBottom: "8px" }}>
            <label>
              {p.kriteria?.nama || `Kriteria ${p.kriteriaId}`}:
              <input
                type="number"
                min="1"
                max="5"
                value={p.nilai}
                onChange={(e) => handleChange(index, e.target.value)}
                required
              />
            </label>
          </div>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Penilaian"}
        </button>
      </form>
    </div>
  );
}
