import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

type SprintStatus = "Activo" | "Pendiente" | "Completado";

const statusVariant: Record<SprintStatus, "success" | "warning" | "muted"> = {
  Activo: "success",
  Pendiente: "warning",
  Completado: "muted",
};

export default function SprintsTable({
  rows,
}: {
  rows: {
    name: string;
    startDate: string;
    endDate: string;
    tasks: number;
    status: SprintStatus;
  }[];
}) {
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
            {rows.map((r) => (
              <tr key={r.name} className="border-b border-zinc-200 last:border-b-0">
                <td className="px-5 py-4 font-medium text-zinc-900">{r.name}</td>
                <td className="px-5 py-4 text-zinc-600">{r.startDate}</td>
                <td className="px-5 py-4 text-zinc-600">{r.endDate}</td>
                <td className="px-5 py-4 text-zinc-600">{r.tasks}</td>
                <td className="px-5 py-4">
                  <Badge variant={statusVariant[r.status]}>{r.status}</Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Button variant="outline" className="h-9 px-3 text-sm">
                      Ver
                    </Button>
                    <Button variant="outline" className="h-9 px-3 text-sm">
                      Editar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
