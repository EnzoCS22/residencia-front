export type DashboardStatCard = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export type DashboardPerformancePoint = {
  name: string;
  value: number;
};

export type DashboardActivityItem = {
  tipo: string;
  referencia_id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
};

export function mapDashboardStats(data: any): DashboardStatCard[] {
  const stats = data?.stats || {};

  return [
    {
      title: "Total tareas",
      value: stats.total_tareas ?? 0,
      subtitle: "Registradas en el filtro actual",
    },
    {
      title: "Pendientes",
      value: stats.pendientes ?? 0,
      subtitle: "Aún no iniciadas",
    },
    {
      title: "En progreso",
      value: stats.en_progreso ?? 0,
      subtitle: "Actualmente activas",
    },
    {
      title: "Completadas",
      value: stats.hechas ?? 0,
      subtitle: "Terminadas",
    },
    {
      title: "Empleados",
      value: stats.total_empleados ?? 0,
      subtitle: "Con tareas asignadas",
    },
    {
      title: "Cumplimiento",
      value: `${stats.cumplimiento_general ?? 0}%`,
      subtitle: "Promedio general",
    },
  ];
}

export function mapDashboardPerformance(data: any): DashboardPerformancePoint[] {
  const performance = data?.performance || [];

  return performance.map((item: any) => ({
    name: item.nombre,
    value: Number(item.porcentaje_cumplimiento || 0),
  }));
}

export function mapDashboardActivity(data: any): DashboardActivityItem[] {
  return (data || []).map((item: any) => ({
    tipo: item.tipo,
    referencia_id: item.referencia_id,
    titulo: item.titulo,
    descripcion: item.descripcion,
    fecha: item.fecha,
  }));
}