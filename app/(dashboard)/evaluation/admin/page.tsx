"use client";

import { useEffect, useMemo, useState } from "react";
import SprintFilter from "@/components/evaluation-admin/SprintFilter";
import TeamSummaryCard from "@/components/evaluation-admin/TeamSummaryCard";
import PerformanceTable, {
  AdminRow,
} from "@/components/evaluation-admin/PerformanceTable";

import { getSprints } from "@/lib/api/sprints.api";
import { apiFetch } from "@/lib/api/http";
import { getToken } from "@/lib/auth-storage";
import { mapSprintsFromApi } from "@/lib/mappers/sprints.mapper";

type SprintOption = {
  id: string;
  name: string;
};

type BackendEvaluationRow = {
  id_empleado: number;
  nombre?: string;
  nombre_empleado?: string;
  completadas?: number;
  pendientes?: number;
  porcentaje_cumplimiento?: number | string;
};

export default function EvaluationAdminPage() {
  const [sprints, setSprints] = useState<SprintOption[]>([]);
  const [selectedSprint, setSelectedSprint] = useState("");
  const [rows, setRows] = useState<AdminRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);
  const [error, setError] = useState("");

  async function loadSprints() {
    try {
      const res = await getSprints();
      const mapped = mapSprintsFromApi(res.data);

      const sprintOptions = mapped.map((s) => ({
        id: String(s.id),
        name: s.name,
      }));

      setSprints(sprintOptions);

      if (sprintOptions.length > 0) {
        setSelectedSprint((prev) => prev || sprintOptions[0].id);
      }
    } catch (err) {
      throw err;
    }
  }

  async function loadEvaluationRows(sprintId: string) {
    try {
      setLoadingRows(true);
      setError("");

      const token = getToken();

      const res = await apiFetch(`/evaluaciones/sprint/${sprintId}`, {
        method: "GET",
        token: token || undefined,
      });

      const data = res.data || [];

      const mappedRows: AdminRow[] = data.map((r: BackendEvaluationRow) => ({
        id: String(r.id_empleado),
        name: r.nombre_empleado || r.nombre || "Sin nombre",
        completed: Number(r.completadas || 0),
        pending: Number(r.pendientes || 0),
        percentage: Number(r.porcentaje_cumplimiento || 0),
      }));

      setRows(mappedRows);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error cargando evaluaciones",
      );
      setRows([]);
    } finally {
      setLoadingRows(false);
    }
  }

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        setError("");
        await loadSprints();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error cargando sprints");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  useEffect(() => {
    if (!selectedSprint) return;
    loadEvaluationRows(selectedSprint);
  }, [selectedSprint]);

  const selectedSprintName = useMemo(() => {
    return sprints.find((s) => s.id === selectedSprint)?.name || "";
  }, [sprints, selectedSprint]);

  const teamAverage = useMemo(() => {
    if (rows.length === 0) return 0;
    return Math.round(
      rows.reduce((acc, r) => acc + r.percentage, 0) / rows.length,
    );
  }, [rows]);

  if (loading) {
    return <div className="p-6">Cargando evaluación...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">
          Evaluación del desempeño
        </h2>
        <p className="text-zinc-500">Comparativo de rendimiento por sprint.</p>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-100 px-4 py-2 text-red-700">
          {error}
        </div>
      ) : null}

      <SprintFilter
        value={selectedSprint}
        options={sprints.map((s) => ({
          value: s.id,
          label: s.name,
        }))}
        onChange={setSelectedSprint}
      />

      <TeamSummaryCard average={teamAverage} sprint={selectedSprintName} />

      {loadingRows ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-500">
          Cargando resultados del sprint...
        </div>
      ) : (
        <PerformanceTable rows={rows} sprintId={selectedSprint} />
      )}
    </div>
  );
}
