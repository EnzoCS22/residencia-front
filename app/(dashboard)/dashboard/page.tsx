"use client";

import { useMemo, useState } from "react";
import { Users, Timer, TrendingUp, CheckCircle2 } from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";

import ReportFilters from "@/components/reports/ReportFilters";
import ReportStats from "@/components/reports/ReportStats";
import ReportTable, { ReportRow } from "@/components/reports/ReportTable";
import ReportChart from "@/components/reports/ReportChart";
import GroupSummaryCard, { GroupSummary } from "@/components/reports/GroupSummaryCard";

type RawRow = ReportRow & {
  sprintId: string;
  fecha: string;
};

function toCsv(rows: ReportRow[]) {
  const header = ["Empleado", "Grupo", "Completadas", "Pendientes", "Cumplimiento (%)"];
  const lines = rows.map((r) => [
    r.nombre,
    r.grupo,
    String(r.completadas),
    String(r.pendientes),
    String(r.porcentaje),
  ]);

  const escape = (v: string) => `"${v.replaceAll('"', '""')}"`;
  return [header.map(escape).join(","), ...lines.map((l) => l.map(escape).join(","))].join("\n");
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DashboardPage() {
  const [sprint, setSprint] = useState("1");
  const [group, setGroup] = useState("Todos");
  const [dateFrom, setDateFrom] = useState("2026-02-01");
  const [dateTo, setDateTo] = useState("2026-02-28");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const raw: RawRow[] = [
    { sprintId: "1", fecha: "2026-02-05", nombre: "Ana López", grupo: "RRHH", completadas: 8, pendientes: 2, porcentaje: 80 },
    { sprintId: "1", fecha: "2026-02-05", nombre: "Carlos Ruiz", grupo: "RRHH", completadas: 6, pendientes: 4, porcentaje: 60 },
    { sprintId: "1", fecha: "2026-02-05", nombre: "María Díaz", grupo: "Desarrollo", completadas: 10, pendientes: 0, porcentaje: 100 },

    { sprintId: "2", fecha: "2026-02-12", nombre: "Ana López", grupo: "RRHH", completadas: 7, pendientes: 3, porcentaje: 70 },
    { sprintId: "2", fecha: "2026-02-12", nombre: "Carlos Ruiz", grupo: "RRHH", completadas: 5, pendientes: 5, porcentaje: 50 },
    { sprintId: "2", fecha: "2026-02-12", nombre: "María Díaz", grupo: "Desarrollo", completadas: 9, pendientes: 1, porcentaje: 90 },

    { sprintId: "3", fecha: "2026-02-19", nombre: "Ana López", grupo: "RRHH", completadas: 9, pendientes: 1, porcentaje: 90 },
    { sprintId: "3", fecha: "2026-02-19", nombre: "Carlos Ruiz", grupo: "RRHH", completadas: 4, pendientes: 6, porcentaje: 40 },
    { sprintId: "3", fecha: "2026-02-19", nombre: "María Díaz", grupo: "Desarrollo", completadas: 8, pendientes: 2, porcentaje: 80 },
  ];

  const groups = useMemo(() => {
    return Array.from(new Set(raw.map((r) => r.grupo)));
  }, [raw]);

  const filteredRows: ReportRow[] = useMemo(() => {
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;

    return raw
      .filter((r) => r.sprintId === sprint)
      .filter((r) => (group === "Todos" ? true : r.grupo === group))
      .filter((r) => {
        const d = new Date(r.fecha);
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ sprintId, fecha, ...row }) => row);
  }, [raw, sprint, group, dateFrom, dateTo]);

  const promedio = useMemo(() => {
    if (filteredRows.length === 0) return 0;
    return Math.round(filteredRows.reduce((acc, r) => acc + r.porcentaje, 0) / filteredRows.length);
  }, [filteredRows]);

  const totalCompletadas = useMemo(
    () => filteredRows.reduce((acc, r) => acc + r.completadas, 0),
    [filteredRows]
  );

  const totalPendientes = useMemo(
    () => filteredRows.reduce((acc, r) => acc + r.pendientes, 0),
    [filteredRows]
  );

  const chartData = useMemo(() => {
    return filteredRows.map((r) => ({ label: r.nombre, value: r.porcentaje }));
  }, [filteredRows]);

  const groupSummary: GroupSummary[] = useMemo(() => {
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;

    const filteredRaw = raw
      .filter((r) => r.sprintId === sprint)
      .filter((r) => (group === "Todos" ? true : r.grupo === group))
      .filter((r) => {
        const d = new Date(r.fecha);
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      });

    const map = new Map<
      string,
      { sumPct: number; count: number; completadas: number; pendientes: number }
    >();

    for (const r of filteredRaw) {
      const curr = map.get(r.grupo) ?? { sumPct: 0, count: 0, completadas: 0, pendientes: 0 };
      curr.sumPct += r.porcentaje;
      curr.count += 1;
      curr.completadas += r.completadas;
      curr.pendientes += r.pendientes;
      map.set(r.grupo, curr);
    }

    return Array.from(map.entries())
      .map(([grupo, v]) => ({
        grupo,
        promedio: v.count === 0 ? 0 : Math.round(v.sumPct / v.count),
        completadas: v.completadas,
        pendientes: v.pendientes,
        empleados: v.count,
      }))
      .sort((a, b) => b.promedio - a.promedio);
  }, [raw, sprint, group, dateFrom, dateTo]);

  const activity = [
    { user: "Sarah Connor", action: "completó una tarea del sprint Frontend Refactor", when: "Hace 2 horas" },
    { user: "John Smith", action: "inició una nueva evaluación para Marketing Team", when: "Hace 4 horas" },
    { user: "Emily Chen", action: "creó un nuevo sprint Q3 Goals", when: "Hace 5 horas" },
    { user: "Michael Brown", action: "actualizó el estado a pendiente API Integration", when: "Ayer" },
  ];

  const topStats = [
    { title: "Total empleados", value: "124", icon: <Users className="w-5 h-5 text-blue-600" /> },
    { title: "Sprints activos", value: "8", icon: <Timer className="w-5 h-5 text-blue-600" /> },
    { title: "Promedio general", value: `${promedio}%`, icon: <TrendingUp className="w-5 h-5 text-blue-600" /> },
    { title: "Tareas completadas", value: String(totalCompletadas), icon: <CheckCircle2 className="w-5 h-5 text-blue-600" /> },
  ];

  function handleExportCsv() {
    const csv = toCsv(filteredRows);
    const filename = `dashboard_reporte_sprint_${sprint}_${group}_${dateFrom}_a_${dateTo}.csv`;
    downloadCsv(filename, csv);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Dashboard</h2>
        <p className="text-zinc-500">Resumen y análisis del desempeño del sistema.</p>
      </div>

      {/* Filtros */}
      <ReportFilters
        sprint={sprint}
        onChangeSprint={setSprint}
        group={group}
        onChangeGroup={setGroup}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onChangeDateFrom={setDateFrom}
        onChangeDateTo={setDateTo}
        groups={groups}
        onExportCsv={handleExportCsv}
      />

      {/* Cards superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {topStats.map((s) => (
          <StatsCard key={s.title} title={s.title} value={s.value} icon={s.icon} />
        ))}
      </div>

      {/* Resumen tipo reportes */}
      <ReportStats
        promedio={promedio}
        completadas={totalCompletadas}
        pendientes={totalPendientes}
        empleados={filteredRows.length}
      />

      {/* Gráfica + Resumen grupo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ReportChart title="Cumplimiento por empleado" data={chartData} />
        </div>
        <div className="lg:col-span-1">
          <GroupSummaryCard items={groupSummary} />
        </div>
      </div>

      {/* Tabla + actividad */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <ReportTable rows={filteredRows} />
        </div>
        <RecentActivity items={activity} />
      </div>
    </div>
  );
}