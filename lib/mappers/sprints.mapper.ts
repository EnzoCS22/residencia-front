export type BackendSprint = {
  id_sprint: number;
  nombre_sprint: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: "activo" | "cerrado";
  total_tareas?: number;
};

export type FrontSprint = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  tasks: number;
  status: "Activo" | "Completado";
};

function formatDate(date: string) {
  return date.split("T")[0];
}

export function mapSprintFromApi(s: BackendSprint): FrontSprint {
  return {
    id: s.id_sprint,
    name: s.nombre_sprint,
    startDate: formatDate(s.fecha_inicio),
    endDate: formatDate(s.fecha_fin),
    tasks: s.total_tareas ?? 0,
    status: s.estado === "activo" ? "Activo" : "Completado",
  };
}

export function mapSprintsFromApi(data: BackendSprint[] = []): FrontSprint[] {
  return data.map(mapSprintFromApi);
}