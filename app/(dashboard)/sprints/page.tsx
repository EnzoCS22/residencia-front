"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import SprintsTable from "@/components/sprints/SprintsTable";
import Modal from "@/components/ui/Modal";
import SprintForm, { SprintFormValues } from "@/components/sprints/SprintForm";

type SprintStatus = "Pendiente" | "Activo" | "Completado";

type SprintRow = {
  name: string;
  startDate: string;
  endDate: string;
  tasks: number;
  status: SprintStatus;
};

export default function SprintsPage() {
  const [open, setOpen] = useState(false);

  const [rows, setRows] = useState<SprintRow[]>([
    { name: "Sprint 1 - Onboarding", startDate: "2026-02-03", endDate: "2026-02-09", tasks: 14, status: "Completado" },
    { name: "Sprint 2 - Core Features", startDate: "2026-02-10", endDate: "2026-02-16", tasks: 22, status: "Activo" },
    { name: "Sprint 3 - Evaluations", startDate: "2026-02-17", endDate: "2026-02-23", tasks: 18, status: "Pendiente" },
    { name: "Sprint 4 - Reports", startDate: "2026-02-24", endDate: "2026-03-02", tasks: 12, status: "Pendiente" },
  ]);

  function handleCreateSprint(data: SprintFormValues) {
    const newRow: SprintRow = {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      tasks: 0, // nuevo sprint inicia sin tareas
    };

    setRows((prev) => [newRow, ...prev]); // lo ponemos arriba
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">Sprints</h2>
          <p className="text-zinc-500">Crear y gestionar cronogramas y objetivos de sprint.</p>
        </div>

        <Button onClick={() => setOpen(true)}>Crear Sprint</Button>
      </div>

      {/* Table */}
      <SprintsTable rows={rows} />

      {/* Modal */}
      <Modal open={open} title="Crear Sprint" onClose={() => setOpen(false)}>
        <SprintForm onCancel={() => setOpen(false)} onSubmit={handleCreateSprint} />
      </Modal>
    </div>
  );
}
