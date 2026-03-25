"use client";

import { useEffect, useMemo, useState } from "react";
import { getUsuarios, updateUsuarioRol } from "@/lib/api/users.api";
import {
  getGrupos,
  createGrupo,
  asignarLiderGrupo,
  asignarMiembrosGrupo,
} from "@/lib/api/groups.api";
import { mapUsersFromApi } from "@/lib/mappers/users.mapper";
import { mapGroupsFromApi } from "@/lib/mappers/groups.mapper";

import UsersAccountsList from "@/components/users/UsersAccountsList";
import UserRoleForm, {
  UserAccount,
  GroupOption,
} from "@/components/users/UserRoleForm";
import GroupsList from "@/components/users/GroupsList";
import GroupForm from "@/components/users/GroupForm";
import Modal from "@/components/ui/Modal";

type GroupItem = {
  id: string;
  name: string;
  leaderId: string | null;
  memberIds: string[];
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [groups, setGroups] = useState<GroupItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [openUserEdit, setOpenUserEdit] = useState(false);

  const [openGroupCreate, setOpenGroupCreate] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupItem | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [usuariosRes, gruposRes] = await Promise.all([
        getUsuarios(),
        getGrupos(),
      ]);

      const mappedUsers = mapUsersFromApi(usuariosRes.data);
      const mappedGroups = mapGroupsFromApi(gruposRes.data);

      const formattedUsers: UserAccount[] = mappedUsers.map((u) => ({
        id: String(u.id),
        name: u.name,
        email: u.email,
        role: u.role,
        groupId: u.groupId ? String(u.groupId) : null,
      }));

      const formattedGroups: GroupItem[] = mappedGroups.map((g) => ({
        id: String(g.id),
        name: g.name,
        leaderId: g.leaderId ? String(g.leaderId) : null,
        memberIds: formattedUsers
          .filter((u) => u.groupId === String(g.id))
          .map((u) => u.id),
      }));

      setUsers(formattedUsers);
      setGroups(formattedGroups);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando datos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const posiblesLideres = useMemo(
    () => users.filter((u) => u.role === "lider"),
    [users],
  );

  const usuariosAsignables = useMemo(
    () => users.filter((u) => u.role === "empleado" || u.role === "lider"),
    [users],
  );

  const groupNameById = useMemo(() => {
    return groups.reduce<Record<string, string>>((acc, group) => {
      acc[group.id] = group.name;
      return acc;
    }, {});
  }, [groups]);

  const groupOptions: GroupOption[] = useMemo(
    () => groups.map((g) => ({ id: g.id, name: g.name })),
    [groups],
  );

  async function handleSaveUser(data: {
    id: string;
    role: "admin" | "lider" | "empleado";
    groupId: string | null;
  }) {
    try {
      setError("");

      await updateUsuarioRol(Number(data.id), {
        rol: data.role,
        id_grupo:
          data.role === "admin"
            ? null
            : data.groupId
              ? Number(data.groupId)
              : null,
      });

      setOpenUserEdit(false);
      setEditingUser(null);

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error actualizando usuario",
      );
    }
  }

  async function handleCreateGroup(data: {
    name: string;
    leaderId: string | null;
    memberIds: string[];
  }) {
    try {
      setError("");

      if (!data.leaderId) {
        throw new Error("Debes seleccionar un líder para el grupo");
      }

      const createRes = await createGrupo({
        nombre_grupo: data.name,
        id_lider: Number(data.leaderId),
      });

      const newGroupId = createRes.data.id_grupo;
      const members = Array.from(new Set([...data.memberIds, data.leaderId]));

      await asignarMiembrosGrupo(Number(newGroupId), {
        memberIds: members.map(Number),
      });

      setOpenGroupCreate(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando grupo");
    }
  }

  async function handleUpdateGroup(data: {
    id?: string;
    name: string;
    leaderId: string | null;
    memberIds: string[];
  }) {
    try {
      setError("");

      if (!data.id) {
        throw new Error("No se encontró el grupo a editar");
      }

      if (!data.leaderId) {
        throw new Error("Debes seleccionar un líder para el grupo");
      }

      await asignarLiderGrupo(Number(data.id), {
        id_lider: Number(data.leaderId),
      });

      const members = Array.from(new Set([...data.memberIds, data.leaderId]));

      await asignarMiembrosGrupo(Number(data.id), {
        memberIds: members.map(Number),
      });

      setEditingGroup(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error actualizando grupo");
    }
  }

  function handleEditUser(user: UserAccount) {
    setEditingUser(user);
    setOpenUserEdit(true);
  }

  function handleEditGroup(group: GroupItem) {
    setOpenGroupCreate(false);
    setEditingGroup(group);
  }

  if (loading) {
    return <div className="p-6">Cargando usuarios y grupos...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">
          Gestión de usuarios y grupos
        </h1>
        <p className="text-sm text-zinc-600 mt-1">
          Administra roles, líderes, grupos y miembros del sistema.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-lg font-medium text-zinc-900">Usuarios</h2>

        <UsersAccountsList
          users={users}
          groupNameById={groupNameById}
          onEdit={handleEditUser}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-zinc-900">Grupos</h2>

          <button
            onClick={() => {
              setEditingGroup(null);
              setOpenGroupCreate(true);
            }}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {openGroupCreate ? "Cerrar formulario" : "Nuevo grupo"}
          </button>
        </div>

        <GroupsList
          groups={groups}
          users={users}
          onEditGroup={handleEditGroup}
        />

        <Modal
          open={openGroupCreate}
          onClose={() => setOpenGroupCreate(false)}
          title="Crear grupo"
        >
          <GroupForm
            mode="create"
            users={usuariosAsignables}
            leaders={posiblesLideres}
            onSubmit={handleCreateGroup}
            onCancel={() => setOpenGroupCreate(false)}
          />
        </Modal>

        <Modal
          open={!!editingGroup}
          onClose={() => setEditingGroup(null)}
          title="Editar grupo"
        >
          {editingGroup ? (
            <GroupForm
              mode="edit"
              initialData={editingGroup}
              users={usuariosAsignables}
              leaders={posiblesLideres}
              onSubmit={handleUpdateGroup}
              onCancel={() => setEditingGroup(null)}
            />
          ) : null}
        </Modal>

        <Modal
          open={openUserEdit}
          onClose={() => {
            setOpenUserEdit(false);
            setEditingUser(null);
          }}
          title="Editar usuario"
        >
          {editingUser ? (
            <UserRoleForm
              user={editingUser}
              groups={groupOptions}
              onSubmit={handleSaveUser}
              onCancel={() => {
                setOpenUserEdit(false);
                setEditingUser(null);
              }}
            />
          ) : null}
        </Modal>
      </section>
    </div>
  );
}
