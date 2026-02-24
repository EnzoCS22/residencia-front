export type EstadoTarea = "Pendiente" | "En progreso" | "Hecha";

export type Cumplimiento = "Cumplió" | "No cumplió" | "N/A";

export type TareaRevision = {
  id: string;
  titulo: string;
  fechaLimite: string; // YYYY-MM-DD
  estado: EstadoTarea;
  cumplimiento: Cumplimiento;
  comentario: string;
};