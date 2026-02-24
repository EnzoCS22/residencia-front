export default function ReportStats({
  promedio,
  completadas,
  pendientes,
  empleados,
}: {
  promedio: number;
  completadas: number;
  pendientes: number;
  empleados: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <Card title="Promedio general" value={`${promedio}%`} />
      <Card title="Tareas completadas" value={completadas} />
      <Card title="Tareas pendientes" value={pendientes} />
      <Card title="Empleados evaluados" value={empleados} />
    </div>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="text-2xl font-semibold text-zinc-900 mt-1">{value}</p>
    </div>
  );
}