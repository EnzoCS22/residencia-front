export type BackendTask = {
  id_tarea: number;
  nombre_tarea: string;
  descripcion: string;
  fecha_asignacion: string;
  fecha_limite: string | null;
  estatus: 'pendiente' | 'en_progreso' | 'hecha';
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
  status: 'pendiente' | 'en_progreso' | 'hecha';
  sprintId: number;
  employeeId: number;
  employeeName?: string;
  sprintName?: string;
};

export function mapTaskFromApi(task: BackendTask): FrontTask {
  return {
    id: task.id_tarea,
    name: task.nombre_tarea,
    description: task.descripcion,
    assignedDate: task.fecha_asignacion,
    dueDate: task.fecha_limite,
    status: task.estatus,
    sprintId: task.id_sprint,
    employeeId: task.id_empleado,
    employeeName: task.nombre_empleado,
    sprintName: task.nombre_sprint
  };
}

export function mapTasksFromApi(tasks: BackendTask[] = []): FrontTask[] {
  return tasks.map(mapTaskFromApi);
}