"use client";

import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";

export type AdminRow = {
  id: string; // employeeId
  name: string;
  completed: number;
  pending: number;
  percentage: number;
};

export default function PerformanceTable({ rows }: { rows: AdminRow[] }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 border-b border-zinc-200">
          <tr className="text-left">
            <th className="px-4 py-3 font-medium text-zinc-600">Empleado</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Completadas</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Pendientes</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Cumplimiento</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition">
              <td className="px-4 py-3 font-medium text-zinc-900">{r.name}</td>
              <td className="px-4 py-3 text-zinc-700">{r.completed}</td>
              <td className="px-4 py-3 text-zinc-700">{r.pending}</td>
              <td className="px-4 py-3">
                <Badge variant={r.percentage >= 80 ? "success" : r.percentage >= 50 ? "default" : "muted"}>
                  {r.percentage}%
                </Badge>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => router.push(`/evaluation/admin/${r.id}`)}
                  className="text-sm font-medium text-blue-700 hover:text-blue-900"
                >
                  Revisar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}