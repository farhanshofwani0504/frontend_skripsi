// src/components/GradeBadge.jsx
const color = {
  A: "bg-green-500",
  B: "bg-blue-500",
  C: "bg-yellow-500",
  D: "bg-orange-500",
  E: "bg-red-500",
};

export default function GradeBadge({ grade, avg }) {
  if (!grade) return null;
  return (
    <span
      className={`px-2 py-1 rounded text-white ${color[grade]} text-sm`}
      title={`Rata‑rata 3 bulan: ${avg.toFixed(2)}`}
    >
      {grade}
    </span>
  );
}
