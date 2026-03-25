export type BackendReportDetail = {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  id_grupo: number | null;
  nombre_grupo: string | null;
  total_tareas: number;
  pendientes: number;
  en_progreso: number;
  hechas: number;
  porcentaje_cumplimiento: string | number;
};

export type FrontReportDetail = {
  userId: number;
  userName: string;
  email: string;
  role: string;
  groupId: number | null;
  groupName: string | null;
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  completionPercentage: number;
};

export function mapReportDetailFromApi(
  row: BackendReportDetail
): FrontReportDetail {
  return {
    userId: row.id_usuario,
    userName: row.nombre,
    email: row.correo,
    role: row.rol,
    groupId: row.id_grupo,
    groupName: row.nombre_grupo,
    totalTasks: row.total_tareas,
    pendingTasks: row.pendientes,
    inProgressTasks: row.en_progreso,
    completedTasks: row.hechas,
    completionPercentage: Number(row.porcentaje_cumplimiento)
  };
}

export function mapReportDetailsFromApi(
  rows: BackendReportDetail[] = []
): FrontReportDetail[] {
  return rows.map(mapReportDetailFromApi);
}