import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { FrontSprint } from "@/lib/mappers/sprints.mapper";

type SprintStatus = "Activo" | "Completado";

const statusVariant: Record<SprintStatus, "success" | "muted"> = {
  Activo: "success",
  Completado: "muted",
};

type SprintsTableProps = {
  rows: FrontSprint[];
  onEdit: (row: FrontSprint) => void;
  onView: (row: FrontSprint) => void;
};

export default function SprintsTable({
  rows,
  onEdit,
  onView,
}: SprintsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr className="text-left text-zinc-600">
              <th className="px-5 py-3 font-medium">Sprint</th>
              <th className="px-5 py-3 font-medium">Inicio</th>
              <th className="px-5 py-3 font-medium">Fin</th>
              <th className="px-5 py-3 font-medium">Tareas</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-6 text-center text-zinc-500"
                >
                  No hay sprints registrados.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-zinc-200 last:border-b-0"
                >
                  <td className="px-5 py-4 font-medium text-zinc-900">
                    {r.name}
                  </td>
                  <td className="px-5 py-4 text-zinc-600">{r.startDate}</td>
                  <td className="px-5 py-4 text-zinc-600">{r.endDate}</td>
                  <td className="px-5 py-4 text-zinc-600">{r.tasks}</td>
                  <td className="px-5 py-4">
                    <Badge variant={statusVariant[r.status]}>{r.status}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="h-9 px-3 text-sm"
                        onClick={() => onView(r)}
                      >
                        Ver
                      </Button>

                      <Button
                        variant="outline"
                        className="h-9 px-3 text-sm"
                        onClick={() => onEdit(r)}
                      >
                        Editar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}