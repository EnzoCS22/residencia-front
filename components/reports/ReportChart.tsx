"use client";

export default function ReportChart({
  title,
  data,
}: {
  title: string;
  data: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
        <span className="text-xs text-zinc-500">0–100%</span>
      </div>

      <div className="mt-4 flex items-end gap-3 h-52">
        {data.map((d) => {
          const h = Math.round((d.value / max) * 100);
          return (
            <div key={d.label} className="flex-1 min-w-0">
              <div className="relative h-44 bg-zinc-100 rounded-lg overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-blue-600"
                  style={{ height: `${h}%` }}
                  title={`${d.value}%`}
                />
              </div>
              <p className="mt-2 text-xs text-zinc-600 truncate text-center">{d.label}</p>
              <p className="text-xs font-semibold text-zinc-900 text-center">{d.value}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}