"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { UserAccount } from "@/components/users/UserRoleForm";

type GroupFormData = {
  id?: string;
  name: string;
  leaderId: string | null;
  memberIds: string[];
};

export default function GroupForm({
  mode,
  initialData,
  users,
  leaders,
  onSubmit,
  onCancel,
}: {
  mode: "create" | "edit";
  initialData?: GroupFormData | null;
  users: UserAccount[];
  leaders: UserAccount[];
  onSubmit: (data: GroupFormData) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name);
      setLeaderId(initialData.leaderId ?? "");
      setMemberIds(initialData.memberIds ?? []);
    } else {
      setName("");
      setLeaderId("");
      setMemberIds([]);
    }
  }, [mode, initialData]);

  function handleToggleMember(userId: string) {
    setMemberIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      id: initialData?.id,
      name,
      leaderId: leaderId || null,
      memberIds,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-5"
    >
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">
          {mode === "create" ? "Crear grupo" : "Editar grupo"}
        </h3>
        <p className="text-sm text-zinc-600 mt-1">
          Configura el nombre, líder y miembros del grupo.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-1">
          Nombre del grupo
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Equipo Backend"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-1">
          Líder
        </label>
        <select
          value={leaderId}
          onChange={(e) => setLeaderId(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona un líder</option>
          {leaders.map((leader) => (
            <option key={leader.id} value={leader.id}>
              {leader.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-2">
          Miembros
        </label>

        <div className="max-h-56 overflow-y-auto rounded-lg border border-zinc-200 p-3 space-y-2">
          {users.length === 0 ? (
            <p className="text-sm text-zinc-500">No hay usuarios disponibles.</p>
          ) : (
            users.map((user) => (
              <label
                key={user.id}
                className="flex items-center gap-3 text-sm text-zinc-800"
              >
                <input
                  type="checkbox"
                  checked={memberIds.includes(user.id)}
                  onChange={() => handleToggleMember(user.id)}
                />
                <span>{user.name}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {mode === "create" ? "Crear grupo" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}