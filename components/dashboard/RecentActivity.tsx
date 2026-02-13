export default function RecentActivity({
  items,
}: {
  items: { user: string; action: string; when: string }[];
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-900 mb-4">Actividad Reciente</h3>

      <div className="space-y-4">
        {items.map((it, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="mt-1 w-2 h-2 rounded-full bg-blue-600" />
            <div className="min-w-0">
              <p className="text-sm text-zinc-700">
                <span className="font-medium text-zinc-900">{it.user}</span>{" "}
                {it.action}
              </p>
              <p className="text-xs text-zinc-500">{it.when}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
