"use client";

import { useEffect, useState } from "react";
import DonutScore from "@/components/evaluation/DonutScore";
import TasksPanel from "@/components/evaluation/TasksPanel";
import LeadersFeedback from "@/components/evaluation/LeadersFeedback";

import { getMiDesempenoPorSprint } from "@/lib/api/evaluation.api";
import { getSprints } from "@/lib/api/sprints.api";
import { mapSprintsFromApi } from "@/lib/mappers/sprints.mapper";
import { mapTasksFromApi } from "@/lib/mappers/tasks.mapper";

type EvaluationTask = {
  title: string;
  due: string;
  description?: string;
  status: "Completado" | "En Progreso" | "Pendiente";
};

type SprintOption = {
  id: string;
  name: string;
};

export default function EvaluationPage() {
  const [score, setScore] = useState(0);
  const [tasks, setTasks] = useState<EvaluationTask[]>([]);
  const [feedback, setFeedback] = useState("");

  const [sprints, setSprints] = useState<SprintOption[]>([]);
  const [selectedSprint, setSelectedSprint] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const [error, setError] = useState("");

  async function loadSprints() {
    try {
      setLoading(true);
      setError("");

      const res = await getSprints();
      const mapped = mapSprintsFromApi(res.data);

      const options = mapped.map((s) => ({
        id: String(s.id),
        name: s.name,
      }));

      setSprints(options);

      if (options.length > 0) {
        setSelectedSprint(options[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando sprints");
    } finally {
      setLoading(false);
    }
  }

  async function loadEvaluation(sprintId: string) {
    try {
      setLoadingEvaluation(true);
      setError("");

      const res = await getMiDesempenoPorSprint(Number(sprintId));
      const data = res.data;

      setScore(Number(data.resumen?.score || 0));
      setFeedback(data.feedback || "Sin retroalimentación disponible.");

      const mappedTasks = mapTasksFromApi(data.tareas || []);

      const tasksForPanel: EvaluationTask[] = mappedTasks.map((task) => ({
        title: task.name,
        due: task.dueDate || "Sin fecha",
        description: task.description,
        status:
          task.status === "Completada"
            ? "Completado"
            : task.status === "En progreso"
              ? "En Progreso"
              : "Pendiente",
      }));

      setTasks(tasksForPanel);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando evaluación");
      setScore(0);
      setTasks([]);
      setFeedback("");
    } finally {
      setLoadingEvaluation(false);
    }
  }

  useEffect(() => {
    loadSprints();
  }, []);

  useEffect(() => {
    if (selectedSprint) {
      loadEvaluation(selectedSprint);
    }
  }, [selectedSprint]);

  if (loading) {
    return <div className="p-6">Cargando evaluación...</div>;
  }

  const selectedSprintName =
    sprints.find((s) => s.id === selectedSprint)?.name || "Sprint seleccionado";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Mi desempeño</h2>
        <p className="text-zinc-500">
          Revisa tu progreso y retroalimentación por sprint.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-100 px-4 py-2 text-red-700">
          {error}
        </div>
      ) : null}

      <div className="max-w-xs">
        <label className="text-sm font-medium text-zinc-900">
          Seleccionar Sprint
        </label>
        <select
          value={selectedSprint}
          onChange={(e) => setSelectedSprint(e.target.value)}
          className="w-full mt-1 border border-zinc-300 bg-white px-3 py-2 rounded-lg
                     text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sprints.map((s) => (
            <option key={s.id} value={s.id} className="text-zinc-900 bg-white">
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {loadingEvaluation ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-500">
          Cargando desempeño del sprint...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-zinc-900">
                Puntuación del sprint
              </h3>
              <p className="text-sm text-zinc-500">{selectedSprintName}</p>

              <div className="mt-5 flex items-center justify-center">
                <DonutScore value={score} label="SCORE" />
              </div>

              <p className="mt-4 text-center text-sm text-zinc-500">
                {score >= 80
                  ? "Excelente desempeño"
                  : score >= 50
                    ? "Buen progreso"
                    : "Necesita mejorar"}
              </p>
            </div>

            <div className="lg:col-span-2">
              <TasksPanel tasks={tasks} />
            </div>
          </div>

          <LeadersFeedback text={feedback} />
        </>
      )}
    </div>
  );
}