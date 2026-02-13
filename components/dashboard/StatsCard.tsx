export default function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{title}</p>
        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <p className="mt-2 text-2xl font-semibold text-zinc-900">{value}</p>
    </div>
  );
}
