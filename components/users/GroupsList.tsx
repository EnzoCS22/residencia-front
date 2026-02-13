import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { UserOption } from "@/components/users/GroupForm";

export type Group = {
  id: string;
  name: string;
  leaderId: string;
  memberIds: string[];
};

export default function GroupsList({
  groups,
  users,
  onEdit,
  onDelete,
}: {
  groups: Group[];
  users: UserOption[];
  onEdit: (g: Group) => void;
  onDelete: (g: Group) => void;
}) {
  const byId = new Map(users.map((u) => [u.id, u.name]));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {groups.map((g) => {
        const leaderName = byId.get(g.leaderId) ?? "Sin líder";
        const members = g.memberIds.map((id) => byId.get(id) ?? id);

        return (
          <div key={g.id} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-zinc-900 truncate">{g.name}</h3>
                <p className="text-sm text-zinc-500">
                  Líder: <span className="font-medium text-zinc-900">{leaderName}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="h-9 px-3 text-sm" onClick={() => onEdit(g)}>
                  Editar
                </Button>
                <Button variant="outline" className="h-9 px-3 text-sm" onClick={() => onDelete(g)}>
                  Eliminar
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-zinc-900 mb-2">Empleados</p>

              {members.length === 0 ? (
                <p className="text-sm text-zinc-500">Sin empleados asignados.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {members.map((m) => (
                    <Badge key={m} variant="muted">
                      {m}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
