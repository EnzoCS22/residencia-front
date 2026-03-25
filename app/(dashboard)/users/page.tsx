"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import GroupsList, { Group } from "@/components/users/GroupsList";
import GroupForm, { GroupFormValues, UserOption } from "@/components/users/GroupForm";
import UsersAccountsList from "@/components/users/UsersAccountsList";
import UserRoleForm, { UserAccount } from "@/components/users/UserRoleForm";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

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

  const [accounts, setAccounts] = useState<UserAccount[]>([
    {
      id: uid(),
      name: "Enzo Castañeda",
      email: "enzo@empresa.com",
      role: "empleado",
      groupId: null,
    },
    {
      id: uid(),
      name: "Ana López",
      email: "ana@empresa.com",
      role: "empleado",
      groupId: groups[0]?.id ?? null,
    },
    {
      id: uid(),
      name: "Miguel Herrera",
      email: "miguel@empresa.com",
      role: "lider",
      groupId: groups[1]?.id ?? null,
    },
  ]);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState<Group | null>(null);

  const [openUserEdit, setOpenUserEdit] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  const filteredGroups = useMemo(() => {
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

  const filteredAccounts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return accounts;

    const groupNameById = Object.fromEntries(groups.map((g) => [g.id, g.name]));

    return accounts.filter((a) => {
      const groupName = a.groupId ? (groupNameById[a.groupId] ?? "") : "";
      return (
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        groupName.toLowerCase().includes(q)
      );
    });
  }, [accounts, groups, query]);

  const groupNameById = useMemo(() => {
    return Object.fromEntries(groups.map((g) => [g.id, g.name]));
  }, [groups]);

  const groupOptions = useMemo(() => {
    return groups.map((g) => ({ id: g.id, name: g.name }));
  }, [groups]);

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

  function handleOpenEditUser(user: UserAccount) {
    setEditingUser(user);
    setOpenUserEdit(true);
  }

  function handleSaveUser(data: {
    id: string;
    role: "admin" | "lider" | "empleado";
    groupId: string | null;
  }) {
    setAccounts((prev) =>
      prev.map((u) => (u.id === data.id ? { ...u, role: data.role, groupId: data.groupId } : u))
    );
    setOpenUserEdit(false);
    setEditingUser(null);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">Usuarios</h2>
          <p className="text-zinc-500">
            Administra grupos, líderes, empleados y cuentas registradas.
          </p>
        </div>

        <Button onClick={openCreate}>Agregar grupo</Button>
      </div>

      <div className="max-w-md">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por grupo, usuario, correo o rol..."
        />
      </div>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">Gestión de grupos</h3>
          <p className="text-sm text-zinc-500">
            Crea grupos y asigna líderes y empleados.
          </p>
        </div>

        <GroupsList
          groups={filteredGroups}
          users={USERS}
          onEdit={openEdit}
          onDelete={openConfirmDelete}
        />
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">Usuarios registrados</h3>
          <p className="text-sm text-zinc-500">
            Asigna roles y grupos a las cuentas creadas en el sistema.
          </p>
        </div>

        <UsersAccountsList
          users={filteredAccounts}
          groupNameById={groupNameById}
          onEdit={handleOpenEditUser}
        />
      </section>

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

      <Modal
        open={openUserEdit}
        title="Editar usuario"
        onClose={() => setOpenUserEdit(false)}
      >
        {editingUser && (
          <UserRoleForm
            user={editingUser}
            groups={groupOptions}
            onCancel={() => setOpenUserEdit(false)}
            onSubmit={handleSaveUser}
          />
        )}
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