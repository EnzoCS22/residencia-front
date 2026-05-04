"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, ListChecks, TrendingUp, Timer } from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";

import ReportFilters from "@/components/reports/ReportFilters";
import ReportStats from "@/components/reports/ReportStats";
import ReportTable, { ReportRow } from "@/components/reports/ReportTable";
import ReportChart from "@/components/reports/ReportChart";
import GroupSummaryCard, {
  GroupSummary,
} from "@/components/reports/GroupSummaryCard";

import {
  getDashboardResumen,
  getDashboardActividadReciente,
} from "@/lib/api/dashboard.api";
import { getSprints } from "@/lib/api/sprints.api";
import {
  mapSprintsFromApi,
  type FrontSprint,
} from "@/lib/mappers/sprints.mapper";

function toCsv(rows: ReportRow[]) {
  const header = [
    "Empleado",
    "Grupo",
    "Completadas",
    "Pendientes",
    "Cumplimiento (%)",
  ];

  const lines = rows.map((r) => [
    r.nombre,
    r.grupo,
    String(r.completadas),
    String(r.pendientes),
    String(r.porcentaje),
  ]);

  const escape = (v: string) => `"${v.replaceAll('"', '""')}"`;

  return [
    header.map(escape).join(","),
    ...lines.map((l) => l.map(escape).join(",")),
  ].join("\n");
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
  const [sprint, setSprint] = useState("");
  const [group, setGroup] = useState("Todos");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [sprintOptions, setSprintOptions] = useState<FrontSprint[]>([]);
  const [groupOptions, setGroupOptions] = useState<
    { id: string; name: string }[]
  >([]);

  const [filteredRows, setFilteredRows] = useState<ReportRow[]>([]);
  const [groupSummary, setGroupSummary] = useState<GroupSummary[]>([]);
  const [activity, setActivity] = useState<
    { user: string; action: string; when: string }[]
  >([]);

  const [statsData, setStatsData] = useState({
    total_tareas: 0,
    pendientes: 0,
    en_progreso: 0,
    hechas: 0,
    total_empleados: 0,
    total_sprints: 0,
    cumplimiento_general: 0,
  });

  const [loading, setLoading] = useState(true);
  const [loadingSprints, setLoadingSprints] = useState(true);
  const [error, setError] = useState("");

  async function loadSprintOptions() {
    try {
      setLoadingSprints(true);

      const res = await getSprints();
      const mapped = mapSprintsFromApi(res.data);

      setSprintOptions(mapped);
    } catch (err) {
      console.error("Error cargando sprints:", err);
    } finally {
      setLoadingSprints(false);
    }
  }

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const filters: {
        sprint?: number;
        grupo?: number;
        dateFrom?: string;
        dateTo?: string;
      } = {};

      if (sprint) filters.sprint = Number(sprint);
      if (group && group !== "Todos") filters.grupo = Number(group);
      if (dateFrom) filters.dateFrom = dateFrom;
      if (dateTo) filters.dateTo = dateTo;

      const [resumenRes, actividadRes] = await Promise.all([
        getDashboardResumen(filters),
        getDashboardActividadReciente(8),
      ]);

      const resumen = resumenRes.data;
      const stats = resumen?.stats || {};
      const performance = resumen?.performance || [];
      const groups = resumen?.groups || [];

      const nextStats = {
        total_tareas: Number(stats.total_tareas || 0),
        pendientes: Number(stats.pendientes || 0),
        en_progreso: Number(stats.en_progreso || 0),
        hechas: Number(stats.hechas || 0),
        total_empleados: Number(stats.total_empleados || 0),
        total_sprints: Number(stats.total_sprints || 0),
        cumplimiento_general: Number(stats.cumplimiento_general || 0),
      };

      setStatsData(nextStats);

      const reportRows: ReportRow[] = performance.map((item: any) => ({
        nombre: item.nombre,
        grupo: item.nombre_grupo || "Sin grupo",
        completadas: Number(item.hechas || 0),
        pendientes: Math.max(
          0,
          Number(item.total_tareas || 0) - Number(item.hechas || 0)
        ),
        porcentaje: Number(item.porcentaje_cumplimiento || 0),
      }));

      setFilteredRows(reportRows);

      const mappedGroupSummary: GroupSummary[] = groups.map((g: any) => ({
        grupo: g.nombre_grupo,
        promedio: Number(g.porcentaje_cumplimiento || 0),
        completadas: Number(g.tareas_hechas || 0),
        pendientes: Math.max(
          0,
          Number(g.total_tareas || 0) - Number(g.tareas_hechas || 0)
        ),
        empleados: Number(g.total_miembros || 0),
      }));

      setGroupSummary(mappedGroupSummary);

      setGroupOptions(
        groups.map((g: any) => ({
          id: String(g.id_grupo),
          name: g.nombre_grupo,
        }))
      );

      const mappedActivity = (actividadRes.data || []).map((item: any) => ({
        user: item.tipo,
        action: item.titulo,
        when: item.fecha,
      }));

      setActivity(mappedActivity);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSprintOptions();
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [sprint, group, dateFrom, dateTo]);

  const promedio = useMemo(() => {
    return Math.round(Number(statsData.cumplimiento_general || 0));
  }, [statsData]);

  const totalCompletadas = useMemo(() => statsData.hechas, [statsData]);
  const totalPendientes = useMemo(() => statsData.pendientes, [statsData]);
  const totalEnProgreso = useMemo(() => statsData.en_progreso, [statsData]);

  const chartData = useMemo(() => {
    return filteredRows.map((r) => ({
      label: r.nombre,
      value: r.porcentaje,
    }));
  }, [filteredRows]);

  const topStats = [
    {
      title: "Empleados con actividad",
      value: String(statsData.total_empleados),
      icon: <Users className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "Total de tareas",
      value: String(statsData.total_tareas),
      icon: <ListChecks className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "Cumplimiento general",
      value: `${promedio}%`,
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "Sprints considerados",
      value: String(statsData.total_sprints),
      icon: <Timer className="w-5 h-5 text-blue-600" />,
    },
  ];

  function handleExportCsv() {
    const csv = toCsv(filteredRows);
    const filename = `dashboard_reporte_${Date.now()}.csv`;
    downloadCsv(filename, csv);
  }

  if (loading || loadingSprints) {
    return <div className="p-6">Cargando dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Dashboard</h2>
        <p className="text-zinc-500">
          Resumen y análisis del desempeño del sistema.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-100 px-4 py-2 text-red-700">
          {error}
        </div>
      ) : null}

      <ReportFilters
        sprint={sprint}
        onChangeSprint={setSprint}
        sprintOptions={sprintOptions.map((s) => ({
          id: String(s.id),
          name: s.name,
        }))}
        group={group}
        onChangeGroup={setGroup}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onChangeDateFrom={setDateFrom}
        onChangeDateTo={setDateTo}
        groups={["Todos", ...groupOptions.map((g) => g.name)]}
        onExportCsv={handleExportCsv}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {topStats.map((s) => (
          <StatsCard
            key={s.title}
            title={s.title}
            value={s.value}
            icon={s.icon}
          />
        ))}
      </div>

      <ReportStats
        promedio={promedio}
        completadas={totalCompletadas}
        pendientes={totalPendientes}
        empleados={filteredRows.length}
        enProgreso={totalEnProgreso}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ReportChart title="Cumplimiento por empleado" data={chartData} />
        </div>
        <div className="lg:col-span-1">
          <GroupSummaryCard items={groupSummary} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <ReportTable rows={filteredRows} />
        </div>
        <RecentActivity items={activity} />
      </div>
    </div>
  );
}