import { apiFetch } from "./http";
import { getToken } from "../auth-storage";

export async function getGrupos() {
  const token = getToken();

  return apiFetch("/grupos", {
    method: "GET",
    token: token || undefined,
  });
}

export async function createGrupo(data: {
  nombre_grupo: string;
  id_lider: number;
}) {
  const token = getToken();

  return apiFetch("/grupos", {
    method: "POST",
    token: token || undefined,
    body: JSON.stringify(data),
  });
}

export async function asignarLiderGrupo(
  id: number,
  data: { id_lider: number }
) {
  const token = getToken();

  return apiFetch(`/grupos/${id}/asignar-lider`, {
    method: "PATCH",
    token: token || undefined,
    body: JSON.stringify(data),
  });
}

export async function asignarMiembrosGrupo(
  id: number,
  data: { memberIds: number[] }
) {
  const token = getToken();

  return apiFetch(`/grupos/${id}/miembros`, {
    method: "PATCH",
    token: token || undefined,
    body: JSON.stringify(data),
  });
}

export async function getMiembrosGrupo(id: number) {
  const token = getToken();

  return apiFetch(`/grupos/${id}/miembros`, {
    method: "GET",
    token: token || undefined,
  });
}