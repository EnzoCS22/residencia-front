"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export type UserOption = {
  id: string;
  name: string;
  role: "Leader" | "Employee";
};

export type GroupFormValues = {
  name: string;
  leaderId: string;      // id del líder
  memberIds: string[];   // ids de empleados
};

export default function GroupForm({
  initial,
  users,
  onCancel,
  onSubmit,
}: {
  initial?: Partial<GroupFormValues>;
  users: UserOption[];
  onCancel: () => void;
  onSubmit: (values: GroupFormValues) => void;
}) {
  const leaders = useMemo(() => users.filter((u) => u.role === "Leader"), [users]);
  const employees = useMemo(() => users.filter((u) => u.role === "Employee"), [users]);

  const [name, setName] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);

  useEffect(() => {
    setName(initial?.name ?? "");
    setLeaderId(initial?.leaderId ?? (leaders[0]?.id ?? ""));
    setMemberIds(initial?.memberIds ?? []);
  }, [initial, leaders]);

  function toggleMember(id: string) {
    setMemberIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !leaderId) return;

    onSubmit({ name, leaderId, memberIds });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-zinc-900">
      <div>
        <label className="text-sm font-medium">Nombre del grupo</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Equipo Ventas" />
      </div>

      {/* Líder como select */}
      <div>
        <label className="text-sm font-medium">Líder</label>
        <select
          value={leaderId}
          onChange={(e) => setLeaderId(e.target.value)}
          className="w-full border border-zinc-300 bg-white px-3 py-2 rounded-lg
                     text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {leaders.map((l) => (
            <option key={l.id} value={l.id} className="text-zinc-900 bg-white">
              {l.name}
            </option>
          ))}
        </select>
      </div>

      {/* Empleados como checkboxes */}
      <div>
        <label className="text-sm font-medium">Empleados asignados</label>

        <div className="mt-2 border border-zinc-200 rounded-xl p-3 bg-white max-h-56 overflow-auto">
          <div className="space-y-2">
            {employees.map((emp) => {
              const checked = memberIds.includes(emp.id);
              return (
                <label
                  key={emp.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleMember(emp.id)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-zinc-900">{emp.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-zinc-500 mt-2">
          Seleccionados: <span className="font-medium text-zinc-900">{memberIds.length}</span>
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
}
