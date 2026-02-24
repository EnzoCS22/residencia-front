"use client";

import Button from "@/components/ui/Button";

export default function ReportFilters({
  sprint,
  onChangeSprint,
  group,
  onChangeGroup,
  dateFrom,
  dateTo,
  onChangeDateFrom,
  onChangeDateTo,
  groups,
  onExportCsv,
}: {
  sprint: string;
  onChangeSprint: (v: string) => void;

  group: string;
  onChangeGroup: (v: string) => void;

  dateFrom: string;
  dateTo: string;
  onChangeDateFrom: (v: string) => void;
  onChangeDateTo: (v: string) => void;

  groups: string[];
  onExportCsv: () => void;
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-end">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Sprint</label>
        <select
          value={sprint}
          onChange={(e) => onChangeSprint(e.target.value)}
          className="mt-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm bg-white text-zinc-900"
        >
          <option value="1" className="text-zinc-900 bg-white">Sprint 1 - Onboarding</option>
          <option value="2" className="text-zinc-900 bg-white">Sprint 2 - Core Features</option>
          <option value="3" className="text-zinc-900 bg-white">Sprint 3 - Evaluaciones</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Grupo</label>
        <select
          value={group}
          onChange={(e) => onChangeGroup(e.target.value)}
          className="mt-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm bg-white text-zinc-900"
        >
          <option value="Todos" className="text-zinc-900 bg-white">Todos</option>
          {groups.map((g) => (
            <option key={g} value={g} className="text-zinc-900 bg-white">
              {g}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Desde</label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onChangeDateFrom(e.target.value)}
          className="mt-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm bg-white text-zinc-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Hasta</label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onChangeDateTo(e.target.value)}
          className="mt-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm bg-white text-zinc-900"
        />
      </div>

      <div className="ml-auto">
        <Button onClick={onExportCsv}>Exportar CSV</Button>
      </div>
    </div>
  );
}