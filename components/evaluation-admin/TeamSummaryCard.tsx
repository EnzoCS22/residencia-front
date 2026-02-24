export default function TeamSummaryCard({
  average,
  sprint,
}: {
  average: number;
  sprint: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
      <p className="text-sm text-zinc-500">Promedio del equipo</p>
      <p className="text-3xl font-semibold text-zinc-900 mt-2">{average}%</p>
      <p className="text-sm text-zinc-500 mt-1">{sprint}</p>
    </div>
  );
}