export default function BarChartMock({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-zinc-900">
          Rendimiento Semanal de Sprints
        </h3>
      </div>

      <div className="flex items-end gap-3 h-44">
        {data.map((d) => {
          const h = Math.round((d.value / max) * 100);
          return (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-zinc-100 rounded-lg h-full flex items-end overflow-hidden">
                <div
                  className="w-full bg-blue-600 rounded-lg"
                  style={{ height: `${h}%` }}
                />
              </div>
              <span className="text-xs text-zinc-500">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
