import DonutScore from "@/components/evaluation/DonutScore";
import TasksPanel from "@/components/evaluation/TasksPanel";
import LeadersFeedback from "@/components/evaluation/LeadersFeedback";

export default function EvaluationPage() {
  const score = 78;

  const tasks = [
    { title: "Implement Login Flow", due: "Oct 2, 2023", status: "Completado" as const },
    { title: "Database Schema Design", due: "Oct 5, 2023", status: "Completado" as const },
    { title: "API Documentation", due: "Oct 12, 2023", status: "En Progreso" as const },
    { title: "Unit Tests Coverage", due: "Oct 14, 2023", status: "En Progreso" as const },
  ];

  const feedback =
    "Excelente trabajo en la arquitectura backend esta semana. El esquema de la base de datos está muy bien pensado. Sin embargo, intentemos agilizar el proceso de documentación para que el equipo frontend no se bloquee la próxima semana. Mantengan la comunicación fluida.";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Mi desempeño</h2>
        <p className="text-zinc-500">Revisa tu progreso y retroalimentación del sprint actual.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Score */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-zinc-900">Puntuación actual del sprint</h3>
          <p className="text-sm text-zinc-500">Basado en tareas completadas y calidad.</p>

          <div className="mt-5 flex items-center justify-center">
            <DonutScore value={score} label="GOOD" />
          </div>

          <p className="mt-4 text-center text-sm text-zinc-500">
            Estás en el top 20% de tu equipo.
          </p>
        </div>

        {/* Right: Tasks */}
        <div className="lg:col-span-2">
          <TasksPanel tasks={tasks} />
        </div>
      </div>

      <LeadersFeedback text={feedback} />
    </div>
  );
}
