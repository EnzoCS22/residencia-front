"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import GroupsList, { Group } from "@/components/users/GroupsList";
import GroupForm, { GroupFormValues, UserOption } from "@/components/users/GroupForm";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ✅ Constante fuera del componente (no se recrea en cada render)
const USERS: UserOption[] = [
  { id: "l1", name: "Laura Gómez", role: "Leader" },
  { id: "l2", name: "Miguel Herrera", role: "Leader" },
  { id: "l3", name: "Diana Torres", role: "Leader" },

  { id: "e1", name: "Ana López", role: "Employee" },
  { id: "e2", name: "Carlos Ruiz", role: "Employee" },
  { id: "e3", name: "María Díaz", role: "Employee" },
  { id: "e4", name: "Sofía Pérez", role: "Employee" },
  { id: "e5", name: "Jorge Lima", role: "Employee" },
  { id: "e6", name: "Luis Ortega", role: "Employee" },
  { id: "e7", name: "Fernanda Soto", role: "Employee" },
  { id: "e8", name: "Iván Cruz", role: "Employee" },
];

export default function UsersPage() {
  const [query, setQuery] = useState("");

  const [groups, setGroups] = useState<Group[]>([
    { id: uid(), name: "Equipo RRHH", leaderId: "l1", memberIds: ["e1", "e2", "e3"] },
    { id: uid(), name: "Equipo Desarrollo", leaderId: "l2", memberIds: ["e4", "e5"] },
    { id: uid(), name: "Equipo Marketing", leaderId: "l3", memberIds: ["e6", "e7", "e8"] },
  ]);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState<Group | null>(null);

  // ✅ useMemo estable porque USERS no cambia
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;

    const byId = new Map(USERS.map((u) => [u.id, u.name.toLowerCase()]));

    return groups.filter((g) => {
      const leaderName = (byId.get(g.leaderId) ?? "").toLowerCase();
      const memberNames = g.memberIds.map((id) => (byId.get(id) ?? "").toLowerCase());

      return (
        g.name.toLowerCase().includes(q) ||
        leaderName.includes(q) ||
        memberNames.some((n) => n.includes(q))
      );
    });
  }, [groups, query]);

  function openCreate() {
    setEditing(null);
    setOpenForm(true);
  }

  function openEdit(g: Group) {
    setEditing(g);
    setOpenForm(true);
  }

  function openConfirmDelete(g: Group) {
    setDeleting(g);
    setOpenDelete(true);
  }

  function handleSubmit(values: GroupFormValues) {
    if (editing) {
      setGroups((prev) =>
        prev.map((g) => (g.id === editing.id ? { ...g, ...values } : g))
      );
    } else {
      setGroups((prev) => [{ id: uid(), ...values }, ...prev]);
    }
    setOpenForm(false);
  }

  function handleDelete() {
    if (!deleting) return;
    setGroups((prev) => prev.filter((g) => g.id !== deleting.id));
    setOpenDelete(false);
    setDeleting(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">Usuarios</h2>
          <p className="text-zinc-500">Administra grupos, líderes y empleados asignados.</p>
        </div>

        <Button onClick={openCreate}>Agregar grupo</Button>
      </div>

      <div className="max-w-md">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por grupo, líder o empleado..."
        />
      </div>

      <GroupsList
        groups={filtered}
        users={USERS}
        onEdit={openEdit}
        onDelete={openConfirmDelete}
      />

      <Modal
        open={openForm}
        title={editing ? "Editar grupo" : "Agregar grupo"}
        onClose={() => setOpenForm(false)}
      >
        <GroupForm
          users={USERS}
          initial={editing ?? undefined}
          onCancel={() => setOpenForm(false)}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={openDelete}
        title="Eliminar grupo"
        message={`¿Seguro que deseas eliminar el grupo "${deleting?.name ?? ""}"?`}
        onCancel={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
