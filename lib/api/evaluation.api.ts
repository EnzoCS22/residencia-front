import { apiFetch } from "./http";
import { getToken } from "../auth-storage";

export async function getMiDesempenoPorSprint(idSprint: number) {
  const token = getToken();

  return apiFetch(`/mi-desempeno/${idSprint}`, {
    method: "GET",
    token: token || undefined,
  });
}