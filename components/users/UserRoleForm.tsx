"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "lider" | "empleado";
  groupId: string | null;
};

export type GroupOption = {
  id: string;
  name: string;
};

export default function UserRoleForm({
  user,
  groups,
  onCancel,
  onSubmit,
}: {
  user: UserAccount;
  groups: GroupOption[];
  onCancel: () => void;
  onSubmit: (data: {
    id: string;
    role: "admin" | "lider" | "empleado";
    groupId: string | null;
  }) => void;
}) {
  const [role, setRole] = useState<UserAccount["role"]>("empleado");
  const [groupId, setGroupId] = useState<string>("");

  useEffect(() => {
    setRole(user.role);
    setGroupId(user.groupId ?? "");
  }, [user]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      id: user.id,
      role,
      groupId: groupId || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-zinc-900">
      <div>
        <p className="text-sm font-medium">Usuario</p>
        <p className="text-sm text-zinc-600">{user.name}</p>
        <p className="text-xs text-zinc-500">{user.email}</p>
      </div>

      <div>
        <label className="text-sm font-medium">Rol</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserAccount["role"])}
          className="w-full border border-zinc-300 bg-white px-3 py-2 rounded-lg
                     text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="empleado">Empleado</option>
          <option value="lider">Líder</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Grupo</label>
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="w-full border border-zinc-300 bg-white px-3 py-2 rounded-lg
                     text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sin grupo</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  );
}