"use client";

import { useMemo, useState } from "react";
import SprintFilter from "@/components/evaluation-admin/SprintFilter";
import TeamSummaryCard from "@/components/evaluation-admin/TeamSummaryCard";
import PerformanceTable, { AdminRow } from "@/components/evaluation-admin/PerformanceTable";

type RawRow = {
  id: string;
  name: string;
  sprint: string;
  completed: number;
  pending: number;
};

const DATA: RawRow[] = [
  { id: "1", name: "Ana López", sprint: "Sprint 4", completed: 8, pending: 2 },
  { id: "2", name: "Carlos Ruiz", sprint: "Sprint 4", completed: 5, pending: 5 },
  { id: "3", name: "María Díaz", sprint: "Sprint 4", completed: 9, pending: 1 },
  { id: "4", name: "Sofía Pérez", sprint: "Sprint 4", completed: 4, pending: 6 },

  { id: "5", name: "Ana López", sprint: "Sprint 3", completed: 6, pending: 4 },
  { id: "6", name: "Carlos Ruiz", sprint: "Sprint 3", completed: 7, pending: 3 },
  { id: "7", name: "María Díaz", sprint: "Sprint 3", completed: 8, pending: 2 },
  { id: "8", name: "Sofía Pérez", sprint: "Sprint 3", completed: 3, pending: 7 },
];

export default function EvaluationAdminPage() {
  const sprints = useMemo(() => {
    return Array.from(new Set(DATA.map((d) => d.sprint)));
  }, []);

  const [selectedSprint, setSelectedSprint] = useState(sprints[0] ?? "Sprint 4");

  const rows: AdminRow[] = useMemo(() => {
    const filtered = DATA.filter((r) => r.sprint === selectedSprint);

    return filtered.map((r) => {
      const total = r.completed + r.pending;
      const percentage = total === 0 ? 0 : Math.round((r.completed / total) * 100);
      return { id: r.id, name: r.name, completed: r.completed, pending: r.pending, percentage };
    });
  }, [selectedSprint]);

  const teamAverage = useMemo(() => {
    if (rows.length === 0) return 0;
    return Math.round(rows.reduce((acc, r) => acc + r.percentage, 0) / rows.length);
  }, [rows]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Evaluación del desempeño</h2>
        <p className="text-zinc-500">Comparativo de rendimiento por sprint.</p>
      </div>

      <SprintFilter value={selectedSprint} options={sprints} onChange={setSelectedSprint} />

      <TeamSummaryCard average={teamAverage} sprint={selectedSprint} />

      <PerformanceTable rows={rows} />
    </div>
  );
}