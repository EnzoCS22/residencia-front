import { apiFetch } from "./http";
import { getToken } from "../auth-storage";


type DashboardFilters = {
  sprint?: number;
  grupo?: number;
  dateFrom?: string;
  dateTo?: string;
};

function buildQuery(params: DashboardFilters = {}) {
  const search = new URLSearchParams();

  if (params.sprint) search.set("sprint", String(params.sprint));
  if (params.grupo) search.set("grupo", String(params.grupo));
  if (params.dateFrom) search.set("dateFrom", params.dateFrom);
  if (params.dateTo) search.set("dateTo", params.dateTo);

  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function getDashboardResumen(filters: DashboardFilters = {}) {
  const token = getToken();

  return apiFetch(`/dashboard/resumen${buildQuery(filters)}`, {
    method: "GET",
    token: token || undefined,
  });
}

export async function getDashboardActividadReciente(limit = 8) {
  const token = getToken();

  return apiFetch(`/dashboard/actividad-reciente?limit=${limit}`, {
    method: "GET",
    token: token || undefined,
  });
}