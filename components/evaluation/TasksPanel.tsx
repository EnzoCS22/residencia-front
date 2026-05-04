"use client";

import { useMemo, useState } from "react";

type Task = {
  title: string;
  due: string;
  status: "Completado" | "En Progreso" | "Pendiente";
  description?: string;
};

export default function TasksPanel({ tasks }: { tasks: Task[] }) {
  const [tab, setTab] = useState<
    "Todo" | "Completado" | "En Progreso" | "Pendiente"
  >("Todo");

  const filtered = useMemo(() => {
    if (tab === "Todo") return tasks;
    return tasks.filter((t) => t.status === tab);
  }, [tasks, tab]);

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">
            Tareas asignadas
          </h3>
          <p className="text-sm text-zinc-500">
            Realiza un seguimiento de tus entregables para el sprint actual.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg flex-wrap">
          {(["Todo", "Completado", "En Progreso", "Pendiente"] as const).map(
            (t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={[
                    "px-3 py-1.5 rounded-md text-sm transition",
                    active
                      ? "bg-white shadow-sm text-zinc-900"
                      : "text-zinc-600 hover:text-zinc-900",
                  ].join(" ")}
                >
                  {t}
                </button>
              );
            }
          )}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {filtered.map((task) => (
          <div
            key={`${task.title}-${task.due}-${task.status}`}
            className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 p-4"
          >
            <div className="min-w-0">
              <p className="font-medium text-zinc-900">{task.title}</p>

              {task.description ? (
                <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
                  {task.description}
                </p>
              ) : null}

              <p className="mt-2 text-xs text-zinc-500">Due: {task.due}</p>
            </div>

            <span
              className={[
                "shrink-0 text-xs font-medium px-2 py-1 rounded-lg",
                task.status === "Completado"
                  ? "bg-emerald-100 text-emerald-700"
                  : task.status === "En Progreso"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-zinc-100 text-zinc-600",
              ].join(" ")}
            >
              {task.status}
            </span>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-sm text-zinc-500">
            No hay tareas en esta vista.
          </p>
        )}
      </div>
    </div>
  );
}