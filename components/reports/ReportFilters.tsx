"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type SprintOption = {
  id: string;
  name: string;
};

export default function ReportFilters({
  sprint,
  onChangeSprint,
  sprintOptions,
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
  onChangeSprint: (value: string) => void;
  sprintOptions: SprintOption[];
  group: string;
  onChangeGroup: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onChangeDateFrom: (value: string) => void;
  onChangeDateTo: (value: string) => void;
  groups: string[];
  onExportCsv: () => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-900">
            Sprint
          </label>
          <select
            value={sprint}
            onChange={(e) => onChangeSprint(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            {sprintOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-900">
            Grupo
          </label>
          <select
            value={group}
            onChange={(e) => onChangeGroup(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-900">
            Desde
          </label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => onChangeDateFrom(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-900">
            Hasta
          </label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => onChangeDateTo(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <Button className="w-full" onClick={onExportCsv}>
            Exportar CSV
          </Button>
        </div>
      </div>
    </div>
  );
}