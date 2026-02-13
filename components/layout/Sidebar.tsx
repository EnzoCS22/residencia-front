import Link from "next/link";

const nav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Sprints", href: "/sprints" },
  { label: "Crear Tareas", href: "/tasks/create" },
  { label: "Evaluación", href: "/evaluation" },
  { label: "Usuarios", href: "/users" },
  { label: "Reportes", href: "/reports" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 h-screen flex-col border-r border-zinc-200 bg-white">
      {/* Brand */}
      <div className="h-16 flex items-center gap-2 px-5 border-b border-zinc-200 shrink-0">
        <div className="w-9 h-9 bg-blue-600 rounded-lg" />
        <div className="leading-tight">
          <p className="font-semibold text-zinc-900">Xilion</p>
          <p className="text-xs text-zinc-500">Sistema de rendimiento</p>
        </div>
      </div>

      {/* Nav (scrolleable si crece) */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase">
          Menu
        </p>

        <div className="space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition"
            >
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-zinc-300" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer pegado al fondo */}
      <div className="mt-auto p-4 border-t border-zinc-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-200" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-900 truncate">
              Usuario Demo
            </p>
            <p className="text-xs text-zinc-500 truncate">demo@empresa.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
