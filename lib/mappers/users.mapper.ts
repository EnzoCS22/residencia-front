export type BackendUser = {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: 'admin' | 'lider' | 'empleado';
  activo: boolean;
  fecha_registro: string;
  id_grupo: number | null;
};

export type FrontUser = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'lider' | 'empleado';
  active: boolean;
  createdAt: string;
  groupId: number | null;
};

export function mapUserFromApi(user: BackendUser): FrontUser {
  return {
    id: user.id_usuario,
    name: user.nombre,
    email: user.correo,
    role: user.rol,
    active: user.activo,
    createdAt: user.fecha_registro,
    groupId: user.id_grupo
  };
}

export function mapUsersFromApi(users: BackendUser[] = []): FrontUser[] {
  return users.map(mapUserFromApi);
}