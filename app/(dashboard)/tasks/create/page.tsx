"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

type Status = "Active" | "Pending" | "Completed";

export default function CreateTaskPage() {
  const [taskName, setTaskName] = useState("");
  const [employee, setEmployee] = useState("");
  const [sprint, setSprint] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<Status>("Pending");
  const [description, setDescription] = useState("");

  // Mock data
  const employees = ["Sarah Connor", "John Smith", "Emily Chen", "Michael Brown"];
  const sprints = ["Sprint 2 - Core Features", "Sprint 3 - Evaluations", "Sprint 4 - Reports"];

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      taskName,
      employee,
      sprint,
      dueDate,
      status,
      description,
    };

    console.log("Create Task payload:", payload);

    // después lo conectamos a backend
    // por ahora solo resetea (opcional)
    setTaskName("");
    setEmployee("");
    setSprint("");
    setDueDate("");
    setStatus("Pending");
    setDescription("");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Crear Tarea</h2>
        <p className="text-zinc-500">Agregar una nueva tarea a un sprint activo.</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 max-w-3xl">
        <h3 className="text-xl font-semibold text-zinc-900">Detalles de la tarea</h3>
        <p className="text-zinc-500 mt-1">Complete la siguiente información para asignar una nueva tarea.</p>

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          {/* Task Name */}
          <div>
            <label className="text-sm font-medium text-zinc-900">Nombre de la tarea</label>
            <Input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.j. Implementar autenticación de dos factores"
            />
          </div>

          {/* Employee + Sprint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-zinc-900">Empleado responsable</label>
              <select
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="w-full border border-zinc-200 bg-white px-3 py-2 rounded-lg text-zinc-900
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" className="text-zinc-900">Seleccionar empleado</option>
                {employees.map((e) => (
                  <option key={e} value={e} className="text-zinc-900 bg-white">
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-900">Sprint</label>
              <select
                value={sprint}
                onChange={(e) => setSprint(e.target.value)}
                className="w-full border border-zinc-200 bg-white px-3 py-2 rounded-lg text-zinc-900
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" className="text-zinc-900">Seleccionar sprint</option>
                {sprints.map((s) => (
                  <option key={s} value={s} className="text-zinc-900 bg-white">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-zinc-900">Fecha vencimiento</label>
              <Input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-900">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full border border-zinc-200 bg-white px-3 py-2 rounded-lg text-zinc-900
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active" className="text-zinc-900 bg-white">Activo</option>
                <option value="Pending" className="text-zinc-900 bg-white">Pendiente</option>
                <option value="Done" className="text-zinc-900 bg-white">Completado</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-zinc-900">Descripción</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Proporcionar detalles sobre los requisitos de la tarea..."
              className="min-h-[140px]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTaskName("");
                setEmployee("");
                setSprint("");
                setDueDate("");
                setStatus("Pending");
                setDescription("");
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
