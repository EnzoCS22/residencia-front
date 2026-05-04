import { apiFetch } from "./http";
import { getToken } from "../auth-storage";

export async function getSprints() {
  const token = getToken();

  return apiFetch("/sprints", {
    method: "GET",
    token: token || undefined,
  });
}

export async function createSprint(data: {
  nombre_sprint: string;
  fecha_inicio: string;
  fecha_fin: string;
}) {
  const token = getToken();

  return apiFetch("/sprints", {
    method: "POST",
    token: token || undefined,
    body: JSON.stringify(data),
  });
}

export async function updateSprint(
  id: number,
  data: {
    nombre_sprint?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    estado?: "activo" | "cerrado";
  }
) {
  const token = getToken();

  return apiFetch(`/sprints/${id}`, {
    method: "PATCH",
    token: token || undefined,
    body: JSON.stringify(data),
  });
}