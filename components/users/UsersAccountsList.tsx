import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { UserAccount } from "@/components/users/UserRoleForm";

function roleLabel(role: UserAccount["role"]) {
  if (role === "lider") return "Líder";
  if (role === "admin") return "Administrador";
  return "Empleado";
}

function roleVariant(role: UserAccount["role"]) {
  if (role === "lider") return "default";
  if (role === "admin") return "success";
  return "muted";
}

export default function UsersAccountsList({
  users,
  groupNameById,
  onEdit,
}: {
  users: UserAccount[];
  groupNameById: Record<string, string>;
  onEdit: (u: UserAccount) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 border-b border-zinc-200">
          <tr className="text-left">
            <th className="px-4 py-3 font-medium text-zinc-600">Nombre</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Correo</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Rol</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Grupo</th>
            <th className="px-4 py-3 font-medium text-zinc-600">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-zinc-100 hover:bg-zinc-50">
              <td className="px-4 py-3 font-medium text-zinc-900">{u.name}</td>
              <td className="px-4 py-3 text-zinc-700">{u.email}</td>
              <td className="px-4 py-3">
                <Badge variant={roleVariant(u.role)}>{roleLabel(u.role)}</Badge>
              </td>
              <td className="px-4 py-3 text-zinc-700">
                {u.groupId ? groupNameById[u.groupId] ?? "Sin grupo" : "Sin grupo"}
              </td>
              <td className="px-4 py-3">
                <Button variant="outline" className="h-9 px-3 text-sm" onClick={() => onEdit(u)}>
                  Editar
                </Button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-zinc-500" colSpan={5}>
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}