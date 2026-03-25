export type BackendEvaluation = {
  id_evaluacion: number;
  id_empleado: number;
  id_sprint: number;
  porcentaje_cumplimiento: string | number;
  comentario_general: string | null;
  fecha_evaluacion: string;
  nombre_empleado?: string;
  nombre_sprint?: string;
};

export type FrontEvaluation = {
  id: number;
  employeeId: number;
  sprintId: number;
  score: number;
  generalComment: string | null;
  evaluationDate: string;
  employeeName?: string;
  sprintName?: string;
};

export function mapEvaluationFromApi(
  evaluation: BackendEvaluation
): FrontEvaluation {
  return {
    id: evaluation.id_evaluacion,
    employeeId: evaluation.id_empleado,
    sprintId: evaluation.id_sprint,
    score: Number(evaluation.porcentaje_cumplimiento),
    generalComment: evaluation.comentario_general,
    evaluationDate: evaluation.fecha_evaluacion,
    employeeName: evaluation.nombre_empleado,
    sprintName: evaluation.nombre_sprint
  };
}

export function mapEvaluationsFromApi(
  evaluations: BackendEvaluation[] = []
): FrontEvaluation[] {
  return evaluations.map(mapEvaluationFromApi);
}