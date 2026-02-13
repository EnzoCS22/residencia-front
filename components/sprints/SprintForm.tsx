"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export type SprintFormValues = {
  name: string;
  startDate: string;
  endDate: string;
  status: "Pendiente" | "Activo" | "Completado";
};

export default function SprintForm({
  onCancel,
  onSubmit,
}: {
  onCancel?: () => void;
  onSubmit?: (data: SprintFormValues) => void;
}) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<SprintFormValues["status"]>("Pendiente");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: SprintFormValues = { name, startDate, endDate, status };

    // Validación mínima (para que no agregue vacío)
    if (!payload.name || !payload.startDate || !payload.endDate) return;

    onSubmit?.(payload);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-zinc-900 rounded-xl space-y-5"
    >
      <div>
        <label className="text-sm font-medium text-zinc-900">Nombre del Sprint</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Sprint 5 - Integración"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-zinc-900">Inicio</label>
          <Input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-900">Fin</label>
          <Input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-900">Estado</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as SprintFormValues["status"])}
          className="w-full border border-zinc-300 bg-white px-3 py-2 rounded-lg
                     text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Planning" className="text-zinc-900 bg-white">Pendiente</option>
          <option value="Active" className="text-zinc-900 bg-white">Activo</option>
          <option value="Completed" className="text-zinc-900 bg-white">Completado</option>
        </select>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
}
