"use client";

import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { UserAccount } from "@/components/users/UserRoleForm";

type GroupItem = {
  id: string;
  name: string;
  leaderId: string | null;
  memberIds: string[];
};

export default function GroupsList({
  groups,
  users,
  onEditGroup,
}: {
  groups: GroupItem[];
  users: UserAccount[];
  onEditGroup: (group: GroupItem) => void;
}) {
  function getUserName(userId: string | null) {
    if (!userId) return "Sin líder";
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Sin líder";
  }

  function getMembers(memberIds: string[]) {
    return users.filter((u) => memberIds.includes(u.id));
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
        No hay grupos registrados.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.map((group) => {
        const members = getMembers(group.memberIds);

        return (
          <div
            key={group.id}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">
                  {group.name}
                </h3>
                <p className="text-sm text-zinc-600 mt-1">
                  Líder: {getUserName(group.leaderId)}
                </p>
              </div>

              <Button
                variant="outline"
                className="h-9 px-3 text-sm"
                onClick={() => onEditGroup(group)}
              >
                Editar
              </Button>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-zinc-800 mb-2">
                Miembros
              </p>

              {members.length === 0 ? (
                <p className="text-sm text-zinc-500">Sin miembros asignados.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {members.map((member) => (
                    <Badge key={member.id} variant="muted">
                      {member.name}
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