"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export type SprintFormValues = {
  name: string;
  startDate: string;
  endDate: string;
  status:  "Activo" | "Completado";
};

type SprintFormProps = {
  initialValues?: SprintFormValues;
  onCancel?: () => void;
  onSubmit?: (data: SprintFormValues) => void | Promise<void>;
};

export default function SprintForm({
  initialValues,
  onCancel,
  onSubmit,
}: SprintFormProps) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] =
    useState<SprintFormValues["status"]>("Completado");

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setStartDate(initialValues.startDate);
      setEndDate(initialValues.endDate);
      setStatus(initialValues.status);
    } 
  }, [initialValues]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !startDate || !endDate) return;

    onSubmit?.({
      name,
      startDate,
      endDate,
      status,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-zinc-900 rounded-xl space-y-5"
    >
      <div>
        <label className="text-sm font-medium text-zinc-900">
          Nombre del Sprint
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Sprint 5 - Integración"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-zinc-900">Inicio</label>
          <Input
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            type="date"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-900">Fin</label>
          <Input
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            type="date"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-900">Estado</label>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as SprintFormValues["status"])
          }
          className="w-full border border-zinc-300 bg-white px-3 py-2 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Activo">Activo</option>
          <option value="Completado">Completado</option>
        </select>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}

        <Button type="submit">
          {initialValues ? "Guardar cambios" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}