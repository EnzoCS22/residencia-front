import { apiFetch } from "./http";
import { getToken } from "../auth-storage";

export async function getUsuarios() {
  const token = getToken();

  return apiFetch("/usuarios", {
    method: "GET",
    token: token || undefined,
  });
}

export async function updateUsuarioRol(
  id: number,
  data: { rol: string; id_grupo: number | null }
) {
  const token = getToken();

  return apiFetch(`/usuarios/${id}/rol`, {
    method: "PATCH",
    token: token || undefined,
    body: JSON.stringify(data),
  });
}