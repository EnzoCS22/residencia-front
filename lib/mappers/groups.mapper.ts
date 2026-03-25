export type BackendGroup = {
  id_grupo: number;
  nombre_grupo: string;
  id_lider: number;
  nombre_lider?: string;
  correo_lider?: string;
};

export type FrontGroup = {
  id: number;
  name: string;
  leaderId: number;
  leaderName?: string;
  leaderEmail?: string;
};

export function mapGroupFromApi(group: BackendGroup): FrontGroup {
  return {
    id: group.id_grupo,
    name: group.nombre_grupo,
    leaderId: group.id_lider,
    leaderName: group.nombre_lider,
    leaderEmail: group.correo_lider
  };
}

export function mapGroupsFromApi(groups: BackendGroup[] = []): FrontGroup[] {
  return groups.map(mapGroupFromApi);
}