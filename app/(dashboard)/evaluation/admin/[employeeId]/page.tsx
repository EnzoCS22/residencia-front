"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import EmployeeReviewHeader from "@/components/evaluation-admin/review/EmployeeReviewHeader";
import TasksReviewPanel from "@/components/evaluation-admin/review/TasksReviewPanel";
import GeneralFeedbackPanel from "@/components/evaluation-admin/review/GeneralFeedbackPanel";
import { Cumplimiento, TareaRevision } from "@/components/evaluation-admin/review/types";

const EMPLEADOS: Record<string, { nombre: string; grupo: string }> = {
  "1": { nombre: "Ana López", grupo: "Equipo RRHH" },
  "2": { nombre: "Carlos Ruiz", grupo: "Equipo RRHH" },
  "3": { nombre: "María Díaz", grupo: "Equipo RRHH" },
  "4": { nombre: "Sofía Pérez", grupo: "Equipo Desarrollo" },
};

const TAREAS_POR_EMPLEADO: Record<string, TareaRevision[]> = {
  "1": [
    { id: "t1", titulo: "Documentar API", fechaLimite: "2026-02-23", estado: "En progreso", cumplimiento: "N/A", comentario: "" },
    { id: "t2", titulo: "Diseño de base de datos", fechaLimite: "2026-02-22", estado: "Hecha", cumplimiento: "N/A", comentario: "" },
  ],
  "2": [
    { id: "t3", titulo: "Endpoints de tareas", fechaLimite: "2026-02-23", estado: "Pendiente", cumplimiento: "N/A", comentario: "" },
    { id: "t4", titulo: "Pruebas unitarias", fechaLimite: "2026-02-24", estado: "En progreso", cumplimiento: "N/A", comentario: "" },
  ],
  "3": [
    { id: "t5", titulo: "UI de Sprints", fechaLimite: "2026-02-21", estado: "Hecha", cumplimiento: "N/A", comentario: "" },
  ],
  "4": [
    { id: "t6", titulo: "Integración frontend-backend", fechaLimite: "2026-02-25", estado: "En progreso", cumplimiento: "N/A", comentario: "" },
  ],
};

export default function EmployeeReviewPage() {
  const params = useParams<{ employeeId: string }>();
  const router = useRouter();
  const employeeId = params.employeeId;

  const empleado = EMPLEADOS[employeeId] ?? { nombre: `Empleado ${employeeId}`, grupo: "N/D" };

  const initialTasks = useMemo(() => TAREAS_POR_EMPLEADO[employeeId] ?? [], [employeeId]);

  const [tasks, setTasks] = useState<TareaRevision[]>(initialTasks);
  const [comentarioGeneral, setComentarioGeneral] = useState("");

  function onChangeCumplimiento(taskId: string, v: Cumplimiento) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, cumplimiento: v } : t)));
  }

  function onChangeComentario(taskId: string, v: string) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, comentario: v } : t)));
  }

  function handleSave() {
    const payload = {
      empleadoId: employeeId,
      comentarioGeneral,
      tareas: tasks.map((t) => ({
        id: t.id,
        cumplimiento: t.cumplimiento,
        comentario: t.comentario,
      })),
    };

    console.log("Payload evaluación líder:", payload);

    // Luego: POST a tu backend
    router.push("/evaluation/admin");
  }

  return (
    <div className="space-y-6">
      <EmployeeReviewHeader
        nombre={empleado.nombre}
        grupo={empleado.grupo}
        onBack={() => router.push("/evaluation/admin")}
      />

      <TasksReviewPanel
        tasks={tasks}
        onChangeCumplimiento={onChangeCumplimiento}
        onChangeComentario={onChangeComentario}
      />

      <GeneralFeedbackPanel
        value={comentarioGeneral}
        onChange={setComentarioGeneral}
        onSave={handleSave}
      />
    </div>
  );
}