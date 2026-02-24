"use client";

import TaskReviewCard from "./TaskReviewCard";
import { Cumplimiento, TareaRevision } from "./types";

export default function TasksReviewPanel({
  tasks,
  onChangeCumplimiento,
  onChangeComentario,
}: {
  tasks: TareaRevision[];
  onChangeCumplimiento: (taskId: string, v: Cumplimiento) => void;
  onChangeComentario: (taskId: string, v: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-zinc-900">Tareas del sprint</h3>
      <p className="text-sm text-zinc-500">Marca si cumplió y agrega comentarios.</p>

      <div className="mt-5 space-y-4">
        {tasks.map((t) => (
          <TaskReviewCard
            key={t.id}
            task={t}
            onChangeCumplimiento={onChangeCumplimiento}
            onChangeComentario={onChangeComentario}
          />
        ))}

        {tasks.length === 0 && (
          <p className="text-sm text-zinc-500">No hay tareas asignadas para este empleado.</p>
        )}
      </div>
    </div>
  );
}