"use client";

import Badge from "@/components/ui/Badge";
import Textarea from "@/components/ui/Textarea";
import { Cumplimiento, TareaRevision } from "./types";

function badgeVariant(estado: TareaRevision["estado"]) {
  if (estado === "Hecha") return "success";
  if (estado === "En progreso") return "default";
  return "muted";
}

export default function TaskReviewCard({
  task,
  onChangeCumplimiento,
  onChangeComentario,
}: {
  task: TareaRevision;
  onChangeCumplimiento: (id: string, v: Cumplimiento) => void;
  onChangeComentario: (id: string, v: string) => void;
}) {
  const is = (v: Cumplimiento) => task.cumplimiento === v;

  return (
    <div className="border border-zinc-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-zinc-900 truncate">{task.titulo}</p>
          <p className="text-xs text-zinc-500">Fecha límite: {task.fechaLimite}</p>
        </div>

        <Badge variant={badgeVariant(task.estado)}>{task.estado}</Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-zinc-700 mr-2">Cumplimiento:</span>

        <button
          type="button"
          onClick={() => onChangeCumplimiento(task.id, "Cumplió")}
          className={[
            "px-3 py-1.5 rounded-lg text-sm border transition",
            is("Cumplió")
              ? "bg-emerald-100 border-emerald-200 text-emerald-800"
              : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50",
          ].join(" ")}
        >
          Cumplió
        </button>

        <button
          type="button"
          onClick={() => onChangeCumplimiento(task.id, "No cumplió")}
          className={[
            "px-3 py-1.5 rounded-lg text-sm border transition",
            is("No cumplió")
              ? "bg-rose-100 border-rose-200 text-rose-800"
              : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50",
          ].join(" ")}
        >
          No cumplió
        </button>

        <button
          type="button"
          onClick={() => onChangeCumplimiento(task.id, "N/A")}
          className={[
            "px-3 py-1.5 rounded-lg text-sm border transition",
            is("N/A")
              ? "bg-zinc-100 border-zinc-200 text-zinc-800"
              : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50",
          ].join(" ")}
        >
          N/A
        </button>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-zinc-900">Comentario de la tarea</label>
        <Textarea
          value={task.comentario}
          onChange={(e) => onChangeComentario(task.id, e.target.value)}
          placeholder="Ej. Buen avance, pero falta documentación."
          className="min-h-[90px] mt-1"
        />
      </div>
    </div>
  );
}