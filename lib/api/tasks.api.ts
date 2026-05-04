import { apiFetch } from "./http";
import { getToken } from "../auth-storage";

export async function getTasksBySprint(idSprint: number) {
  const token = getToken();

  return apiFetch(`/tareas/sprint/${idSprint}`, {
    method: "GET",
    token: token || undefined,
  });
}

export async function createTask(data: {
  nombre_tarea: string;
  descripcion: string;
  fecha_asignacion: string;
  fecha_limite: string | null;
  estatus: "pendiente" | "en_progreso" | "hecha";
  id_sprint: number;
  id_empleado: number;
}) {
  const token = getToken();

  return apiFetch("/tareas", {
    method: "POST",
    token: token || undefined,
    body: JSON.stringify(data),
  });
}

export async function updateTaskStatus(
  id: number,
  data: { estatus: "pendiente" | "en_progreso" | "hecha" }
) {
  const token = getToken();

  return apiFetch(`/tareas/${id}/estatus`, {
    method: "PATCH",
    token: token || undefined,
    body: JSON.stringify(data),
  });
}