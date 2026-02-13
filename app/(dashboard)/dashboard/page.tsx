import StatsCard from "@/components/dashboard/StatsCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Users, Timer, TrendingUp, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total de Empleados",
      value: "124",
      icon: <Users className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "Sprints Activos",
      value: "8",
      icon: <Timer className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "Rendimiento Promedio",
      value: "87%",
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "Tareas Completadas",
      value: "1,204",
      icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />,
    },
  ];

  const chart = [
    { label: "S1", value: 40 },
    { label: "S2", value: 35 },
    { label: "S3", value: 60 },
    { label: "S4", value: 62 },
    { label: "S5", value: 45 },
    { label: "S6", value: 42 },
    { label: "S7", value: 25 },
    { label: "S8", value: 48 },
    { label: "S9", value: 52 },
    { label: "S10", value: 38 },
    { label: "S11", value: 55 },
    { label: "S12", value: 60 },
  ];

  const activity = [
    {
      user: "Sarah Connor",
      action: "completó una tarea de sprint Refactorización de frontend",
      when: "2 hours ago",
    },
    {
      user: "John Smith",
      action: "comenzó una nueva evaluación para el equipo de marketing.",
      when: "4 hours ago",
    },
    {
      user: "Emily Chen",
      action: "creó un nuevo sprint Q3 Goals",
      when: "5 hours ago",
    },
    {
      user: "Michael Brown",
      action: "actualizó el estado a pendiente de integración API",
      when: "Yesterday",
    },
    {
      user: "Jessica Wu",
      action: "envió autoevaluación Resumen Anual",
      when: "Yesterday",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Dashboard</h2>
        <p className="text-zinc-500">
          Descripción general del desempeño y las actividades de la empresa.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <StatsCard
            key={s.title}
            title={s.title}
            value={s.value}
            icon={s.icon}
          />
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <PerformanceChart data={chart} />
        </div>
        <RecentActivity items={activity} />
      </div>
    </div>
  );
}
