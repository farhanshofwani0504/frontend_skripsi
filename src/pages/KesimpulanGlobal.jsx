import { useEffect, useState } from "react";

export default function KesimpulanGlobal() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/dashboard/kesimpulan", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch kesimpulan:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Data tidak tersedia.</p>;

  return (
    <div>
      <h2>Kesimpulan Global</h2>
      <p>{data.kesimpulan}</p>
      <h4>Detail Total Tiap Kriteria</h4>
      <ul>
        {data.detail.map((item, i) => (
          <li key={i}>
            {item.kriteria}: {item.total}
          </li>
        ))}
      </ul>
    </div>
  );
}
