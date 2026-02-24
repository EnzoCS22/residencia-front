"use client";

import { useMemo, useState } from "react";
import ReportFilters from "@/components/reports/ReportFilters";
import ReportStats from "@/components/reports/ReportStats";
import ReportTable, { ReportRow } from "@/components/reports/ReportTable";
import ReportChart from "@/components/reports/ReportChart";
import GroupSummaryCard, { GroupSummary } from "@/components/reports/GroupSummaryCard";

type RawRow = ReportRow & {
  sprintId: string; // "1" | "2" | "3"
  fecha: string;    // YYYY-MM-DD (para filtros)
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

  // CSV simple con comillas
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

export default function ReportsPage() {
  const [sprint, setSprint] = useState("1");
  const [group, setGroup] = useState("Todos");
  const [dateFrom, setDateFrom] = useState("2026-02-01");
  const [dateTo, setDateTo] = useState("2026-02-28");

  // ✅ Datos mock (después vendrán del backend)
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
    // Si quieres que el resumen use SOLO los datos ya filtrados:
    // necesitas que filteredRows tenga grupo, por eso usamos raw filtrado antes del map.
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

  function handleExportCsv() {
    const csv = toCsv(filteredRows);
    const filename = `reporte_sprint_${sprint}_${group}_${dateFrom}_a_${dateTo}.csv`;
    downloadCsv(filename, csv);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Reportes de desempeño</h2>
        <p className="text-zinc-500">Consulta consolidada del rendimiento por sprint, grupo y fechas.</p>
      </div>

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

      <ReportStats
        promedio={promedio}
        completadas={totalCompletadas}
        pendientes={totalPendientes}
        empleados={filteredRows.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ReportChart title="Cumplimiento por empleado" data={chartData} />
        </div>
       <div className="lg:col-span-1">
            <GroupSummaryCard items={groupSummary} />
        </div>
      </div>

      <ReportTable rows={filteredRows} />
    </div>
  );
}