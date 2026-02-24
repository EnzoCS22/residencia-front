"use client";

export type GroupSummary = {
  grupo: string;
  promedio: number;
  completadas: number;
  pendientes: number;
  empleados: number;
};

export default function GroupSummaryCard({ items }: { items: GroupSummary[] }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-900">Resumen por grupo</h3>
      <p className="text-sm text-zinc-500 mt-1">Promedio y totales del sprint filtrado.</p>

      <div className="mt-4 space-y-3">
        {items.map((g) => (
          <div key={g.grupo} className="border border-zinc-200 rounded-lg p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-zinc-900 truncate">{g.grupo}</p>
              <p className="text-sm font-semibold text-zinc-900">{g.promedio}%</p>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-zinc-600">
              <div>
                <p className="text-zinc-500">Completadas</p>
                <p className="font-medium text-zinc-900">{g.completadas}</p>
              </div>
              <div>
                <p className="text-zinc-500">Pendientes</p>
                <p className="font-medium text-zinc-900">{g.pendientes}</p>
              </div>
              <div>
                <p className="text-zinc-500">Empleados</p>
                <p className="font-medium text-zinc-900">{g.empleados}</p>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-sm text-zinc-500">No hay grupos para mostrar con los filtros actuales.</p>
        )}
      </div>
    </div>
  );
}