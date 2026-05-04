"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import { getUsuarios } from "@/lib/api/users.api";
import { getSprints } from "@/lib/api/sprints.api";
import { createTask } from "@/lib/api/tasks.api";

import { mapUsersFromApi } from "@/lib/mappers/users.mapper";
import { mapSprintsFromApi } from "@/lib/mappers/sprints.mapper";

type Status = "pendiente" | "en_progreso" | "hecha";

export default function CreateTaskPage() {
  const [taskName, setTaskName] = useState("");
  const [employee, setEmployee] = useState("");
  const [sprint, setSprint] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<Status>("pendiente");
  const [description, setDescription] = useState("");

  const [employees, setEmployees] = useState<{ id: string; name: string }[]>(
    [],
  );

  const [sprints, setSprints] = useState<{ id: string; name: string }[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Cargar datos reales
  async function loadData() {
    try {
      const [usersRes, sprintsRes] = await Promise.all([
        getUsuarios(),
        getSprints(),
      ]);

      const usersMapped = mapUsersFromApi(usersRes.data);
      const sprintsMapped = mapSprintsFromApi(sprintsRes.data);

      setEmployees(
        usersMapped.map((u) => ({
          id: String(u.id),
          name: u.name,
        })),
      );

      setSprints(
        sprintsMapped.map((s) => ({
          id: String(s.id),
          name: s.name,
        })),
      );
    } catch (err) {
      console.error(err);
      setError("Error cargando datos");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // 🔹 Crear tarea
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!taskName || !employee || !sprint || !dueDate) {
      setError("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const today = new Date().toISOString().split("T")[0];

      await createTask({
        nombre_tarea: taskName,
        descripcion: description,
        fecha_asignacion: today,
        fecha_limite: dueDate || null,
        estatus: status,
        id_sprint: Number(sprint),
        id_empleado: Number(employee),
      });

      // reset
      setTaskName("");
      setEmployee("");
      setSprint("");
      setDueDate("");
      setStatus("pendiente");
      setDescription("");

      alert("Tarea creada correctamente");
    } catch (err) {
      console.error(err);
      setError("Error al crear tarea");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Crear Tarea</h2>
        <p className="text-zinc-500">Agregar una nueva tarea a un sprint.</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 max-w-3xl">
        <form onSubmit={handleSave} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="text-sm font-medium text-zinc-900">
              Nombre de la tarea
            </label>
            <Input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Ej. Implementar login"
            />
          </div>

          {/* Usuario + Sprint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-zinc-900">
                Empleado
              </label>
              <select
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="w-full border border-zinc-200 bg-white text-zinc-900 rounded-lg px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" className="bg-white text-zinc-900">
                  Seleccionar
                </option>
                {employees.map((u) => (
                  <option
                    key={u.id}
                    value={u.id}
                    className="bg-white text-zinc-900"
                  >
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-900">
                Sprint
              </label>
              <select
                value={sprint}
                onChange={(e) => setSprint(e.target.value)}
                className="w-full border border-zinc-200 bg-white text-zinc-900 rounded-lg px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" className="bg-white text-zinc-900">
                  Seleccionar
                </option>
                {sprints.map((s) => (
                  <option
                    key={s.id}
                    value={s.id}
                    className="bg-white text-zinc-900"
                  >
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fecha + Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-zinc-900">
                Fecha límite
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-900">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full border border-zinc-200 bg-white text-zinc-900 rounded-lg px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pendiente" className="bg-white text-zinc-900">
                  Pendiente
                </option>
                <option value="en_progreso" className="bg-white text-zinc-900">
                  En progreso
                </option>
                <option value="hecha" className="bg-white text-zinc-900">
                  Completada
                </option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-sm font-medium text-zinc-900">
              Descripción
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTaskName("");
                setEmployee("");
                setSprint("");
                setDueDate("");
                setStatus("pendiente");
                setDescription("");
              }}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Crear tarea"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
