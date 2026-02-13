"use client";

import { useMemo, useState } from "react";

type Task = {
  title: string;
  due: string;
  status: "Completado" | "En Progreso" | "Pendiente";
};

export default function TasksPanel({ tasks }: { tasks: Task[] }) {
  const [tab, setTab] = useState<"Todo" | "Completado" | "Pendiente">("Todo");

  const filtered = useMemo(() => {
    if (tab === "Todo") return tasks;
    if (tab === "Completado") return tasks.filter((t) => t.status === "Completado");
    return tasks.filter((t) => t.status !== "Completado");
  }, [tasks, tab]);

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Tareas asignadas</h3>
          <p className="text-sm text-zinc-500">Realice un seguimiento de sus entregables para el sprint actual.</p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
          {(["Todo", "Completado", "Pendiente"] as const).map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={[
                  "px-3 py-1.5 rounded-md text-sm transition",
                  active ? "bg-white shadow-sm text-zinc-900" : "text-zinc-600 hover:text-zinc-900",
                ].join(" ")}
              >
                {t === "Completado" ? "Completado" : t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {filtered.map((task) => (
          <div
            key={task.title}
            className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 p-4"
          >
            <div className="min-w-0">
              <p className="font-medium text-zinc-900 truncate">{task.title}</p>
              <p className="text-xs text-zinc-500">Due: {task.due}</p>
            </div>

            <span
              className={[
                "text-xs font-medium px-2 py-1 rounded-lg",
                task.status === "Completado"
                  ? "bg-emerald-100 text-emerald-700"
                  : task.status === "En Progreso"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-zinc-100 text-zinc-600",
              ].join(" ")}
            >
              {task.status === "Completado" ? "Completado" : task.status}
            </span>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-sm text-zinc-500">No tasks in this view.</p>
        )}
      </div>
    </div>
  );
}
