export type BackendTask = {
  id_tarea: number;
  nombre_tarea: string;
  descripcion: string;
  fecha_asignacion: string;
  fecha_limite: string | null;
  estatus: "pendiente" | "en_progreso" | "hecha";
  id_sprint: number;
  id_empleado: number;
  nombre_empleado?: string;
  nombre_sprint?: string;
};

export type FrontTask = {
  id: number;
  name: string;
  description: string;
  assignedDate: string;
  dueDate: string | null;
  status: "Pendiente" | "En progreso" | "Completada";
  sprintId: number;
  employeeId: number;
  employeeName?: string;
  sprintName?: string;
};

function formatDate(date: string | null) {
  if (!date) return null;
  return date.split("T")[0];
}

function mapStatus(status: BackendTask["estatus"]): FrontTask["status"] {
  if (status === "en_progreso") return "En progreso";
  if (status === "hecha") return "Completada";
  return "Pendiente";
}

export function mapTaskFromApi(task: BackendTask): FrontTask {
  return {
    id: task.id_tarea,
    name: task.nombre_tarea,
    description: task.descripcion,
    assignedDate: formatDate(task.fecha_asignacion) || "",
    dueDate: formatDate(task.fecha_limite),
    status: mapStatus(task.estatus),
    sprintId: task.id_sprint,
    employeeId: task.id_empleado,
    employeeName: task.nombre_empleado,
    sprintName: task.nombre_sprint,
  };
}

export function mapTasksFromApi(tasks: BackendTask[] = []): FrontTask[] {
  return tasks.map(mapTaskFromApi);
}