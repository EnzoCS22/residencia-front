"use client";

export type ReportRow = {
  nombre: string;
  grupo: string;
  completadas: number;
  pendientes: number;
  porcentaje: number;
};

export default function ReportTable({ rows }: { rows: ReportRow[] }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 border-b border-zinc-200">
          <tr className="text-left">
            <th className="px-4 py-3 font-medium text-zinc-600">Empleado</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Grupo</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Completadas</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Pendientes</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Cumplimiento</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-zinc-100 hover:bg-zinc-50">
              <td className="px-4 py-3 font-medium text-zinc-900">{r.nombre}</td>
              <td className="px-4 py-3 text-zinc-700">{r.grupo}</td>
              <td className="px-4 py-3 text-zinc-700">{r.completadas}</td>
              <td className="px-4 py-3 text-zinc-700">{r.pendientes}</td>
              <td className="px-4 py-3 text-zinc-900 font-semibold">{r.porcentaje}%</td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-zinc-500" colSpan={5}>
                No hay resultados con los filtros seleccionados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}