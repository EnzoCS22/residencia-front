"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import SprintsTable from "@/components/sprints/SprintsTable";
import SprintForm, { SprintFormValues } from "@/components/sprints/SprintForm";

import {
  getSprints,
  createSprint,
  updateSprint,
} from "@/lib/api/sprints.api";
import {
  getTasksBySprint,
  updateTaskStatus,
} from "@/lib/api/tasks.api";
import {
  mapSprintsFromApi,
  type FrontSprint,
} from "@/lib/mappers/sprints.mapper";
import { mapTasksFromApi, type FrontTask } from "@/lib/mappers/tasks.mapper";

function mapFrontTaskStatusToBack(
  status: FrontTask["status"]
): "pendiente" | "en_progreso" | "hecha" {
  if (status === "En progreso") return "en_progreso";
  if (status === "Completada") return "hecha";
  return "pendiente";
}

export default function SprintsPage() {
  const [rows, setRows] = useState<FrontSprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [editingSprint, setEditingSprint] = useState<FrontSprint | null>(null);

  const [viewingSprint, setViewingSprint] = useState<FrontSprint | null>(null);
  const [sprintTasks, setSprintTasks] = useState<FrontTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

  async function loadSprints() {
    try {
      setLoading(true);
      setError("");

      const res = await getSprints();
      const mapped = mapSprintsFromApi(res.data);

      setRows(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando sprints");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSprints();
  }, []);

  async function loadTasksForSprint(sprintId: number) {
    try {
      setLoadingTasks(true);
      setError("");

      const res = await getTasksBySprint(sprintId);
      const mappedTasks = mapTasksFromApi(res.data);

      setSprintTasks(mappedTasks);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error cargando tareas del sprint"
      );
    } finally {
      setLoadingTasks(false);
    }
  }

  async function handleCreateSprint(data: SprintFormValues) {
    try {
      setError("");

      await createSprint({
        nombre_sprint: data.name,
        fecha_inicio: data.startDate,
        fecha_fin: data.endDate,
      });

      setOpenCreate(false);
      await loadSprints();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando sprint");
    }
  }

  function handleEditSprint(row: FrontSprint) {
    setOpenCreate(false);
    setEditingSprint(row);
  }

  async function handleUpdateSprint(data: SprintFormValues) {
    try {
      setError("");

      if (!editingSprint) {
        throw new Error("No se encontró el sprint a editar");
      }

      await updateSprint(editingSprint.id, {
        nombre_sprint: data.name,
        fecha_inicio: data.startDate,
        fecha_fin: data.endDate,
        estado: data.status === "Activo" ? "activo" : "cerrado",
      });

      setEditingSprint(null);
      await loadSprints();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error actualizando sprint"
      );
    }
  }

  async function handleViewSprint(row: FrontSprint) {
    setViewingSprint(row);
    await loadTasksForSprint(row.id);
  }

  async function handleChangeTaskStatus(
    task: FrontTask,
    newStatus: "pendiente" | "en_progreso" | "hecha"
  ) {
    try {
      setError("");
      setUpdatingTaskId(task.id);

      await updateTaskStatus(task.id, {
        estatus: newStatus,
      });

      if (viewingSprint) {
        await loadTasksForSprint(viewingSprint.id);
      }

      await loadSprints();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error actualizando tarea"
      );
    } finally {
      setUpdatingTaskId(null);
    }
  }

  if (loading) {
    return <div className="p-6">Cargando sprints...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">Sprints</h2>
          <p className="text-zinc-500">
            Crear y gestionar cronogramas y objetivos de sprint.
          </p>
        </div>

        <Button onClick={() => setOpenCreate(true)}>Crear Sprint</Button>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-100 px-4 py-2 text-red-700">
          {error}
        </div>
      ) : null}

      <SprintsTable
        rows={rows}
        onEdit={handleEditSprint}
        onView={handleViewSprint}
      />

      <Modal
        open={openCreate}
        title="Crear Sprint"
        onClose={() => setOpenCreate(false)}
      >
        <SprintForm
          key="create-sprint"
          onCancel={() => setOpenCreate(false)}
          onSubmit={handleCreateSprint}
        />
      </Modal>

      <Modal
        open={!!editingSprint}
        title="Editar Sprint"
        onClose={() => setEditingSprint(null)}
      >
        {editingSprint ? (
          <SprintForm
            key={editingSprint.id}
            initialValues={{
              name: editingSprint.name,
              startDate: editingSprint.startDate,
              endDate: editingSprint.endDate,
              status: editingSprint.status,
            }}
            onCancel={() => setEditingSprint(null)}
            onSubmit={handleUpdateSprint}
          />
        ) : null}
      </Modal>

      <Modal
        open={!!viewingSprint}
        title={viewingSprint ? `Tareas de ${viewingSprint.name}` : "Tareas"}
        onClose={() => {
          setViewingSprint(null);
          setSprintTasks([]);
        }}
      >
        <div className="space-y-4">
          {loadingTasks ? (
            <p className="text-sm text-zinc-500">Cargando tareas...</p>
          ) : sprintTasks.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Este sprint no tiene tareas asignadas.
            </p>
          ) : (
            <div className="space-y-3">
              {sprintTasks.map((task) => {
                const currentBackStatus = mapFrontTaskStatusToBack(task.status);

                return (
                  <div
                    key={task.id}
                    className="rounded-lg border border-zinc-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-zinc-900">
                          {task.name}
                        </h4>
                        <p className="text-sm text-zinc-600 mt-1">
                          {task.description}
                        </p>
                      </div>

                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                        {task.status}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2 text-sm text-zinc-600">
                      <p>
                        <span className="font-medium">Empleado:</span>{" "}
                        {task.employeeName || "Sin asignar"}
                      </p>
                      <p>
                        <span className="font-medium">Fecha límite:</span>{" "}
                        {task.dueDate || "Sin fecha"}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 px-3 text-sm"
                        disabled={
                          updatingTaskId === task.id ||
                          currentBackStatus === "pendiente"
                        }
                        onClick={() =>
                          handleChangeTaskStatus(task, "pendiente")
                        }
                      >
                        Pendiente
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 px-3 text-sm"
                        disabled={
                          updatingTaskId === task.id ||
                          currentBackStatus === "en_progreso"
                        }
                        onClick={() =>
                          handleChangeTaskStatus(task, "en_progreso")
                        }
                      >
                        En progreso
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 px-3 text-sm"
                        disabled={
                          updatingTaskId === task.id ||
                          currentBackStatus === "hecha"
                        }
                        onClick={() =>
                          handleChangeTaskStatus(task, "hecha")
                        }
                      >
                        Completada
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}