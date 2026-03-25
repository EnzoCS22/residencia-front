export type BackendSprint = {
  id_sprint: number;
  nombre_sprint: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'activo' | 'cerrado';
};

export type FrontSprint = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: 'activo' | 'cerrado';
};

export function mapSprintFromApi(sprint: BackendSprint): FrontSprint {
  return {
    id: sprint.id_sprint,
    name: sprint.nombre_sprint,
    startDate: sprint.fecha_inicio,
    endDate: sprint.fecha_fin,
    status: sprint.estado
  };
}

export function mapSprintsFromApi(sprints: BackendSprint[] = []): FrontSprint[] {
  return sprints.map(mapSprintFromApi);
}