export default function CrBadge({ cr }) {
  if (cr == null) return null; // belum ada data
  const ok = cr <= 0.1;
  return (
    <span
      className={`px-2 py-1 rounded text-white ${
        ok ? "bg-green-500" : "bg-red-500"
      }`}
      title={ok ? "Konsisten (≤ 0.1)" : "Inkon­sisten (> 0.1)"}
    >
      {cr.toFixed(3)}
    </span>
  );
}
