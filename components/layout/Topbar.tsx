"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Panel", subtitle: "Vista general." },
  "/sprints": { title: "Sprints", subtitle: "Ciclos activos." },
  "/tasks/create": { title: "Crear tarea", subtitle: "Nueva asignación." },
  "/evaluation": { title: "Mi desempeño", subtitle: "Rendimiento actual." },
  "/users": { title: "Usuarios", subtitle: "Control de acceso." },
  "/reports": { title: "Reportes", subtitle: "Indicadores clave." },
  "/evaluation/admin": { title: "Evaluación", subtitle: "Desempeño del equipo." },
};

function formatDate(date: Date) {
  return date.toLocaleDateString("es-Mx", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Topbar() {
  const pathname = usePathname();
  const meta = titles[pathname] ?? { title: "StaffPerf", subtitle: "Workspace" };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-zinc-200 bg-white">
      <div className="min-w-0">
        <p className="text-lg font-semibold text-zinc-900 truncate">{meta.title}</p>
        <p className="text-sm text-zinc-500 truncate hidden sm:block">{meta.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-sm text-zinc-500 hidden lg:block">{formatDate(new Date())}</p>

        <button className="w-9 h-9 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center justify-center">
          <Bell className="w-5 h-5 text-zinc-600" />
        </button>

        <button className="w-9 h-9 rounded-full bg-zinc-200" />
      </div>
    </header>
  );
}
