"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import EmployeeReviewHeader from "@/components/evaluation-admin/review/EmployeeReviewHeader";
import TasksReviewPanel from "@/components/evaluation-admin/review/TasksReviewPanel";
import GeneralFeedbackPanel from "@/components/evaluation-admin/review/GeneralFeedbackPanel";
import {
  Cumplimiento,
  TareaRevision,
} from "@/components/evaluation-admin/review/types";

import { apiFetch } from "@/lib/api/http";
import { getToken } from "@/lib/auth-storage";

type BackCumplimiento = "cumplio" | "no_cumplio" | "na";

type RevisionResponse = {
  empleado?: {
    id_empleado: number;
    nombre_empleado: string;
    nombre_grupo?: string;
  };
  comentario_general?: string | null;
  tareas?: Array<{
    id_tarea: number;
    nombre_tarea: string;
    fecha_limite: string | null;
    estatus: "pendiente" | "en_progreso" | "hecha";
    cumplimiento?: BackCumplimiento | null;
    comentario?: string | null;
  }>;
};

function getParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function formatDate(date: string | null) {
  if (!date) return "Sin fecha";
  return date.split("T")[0];
}

function mapEstado(estatus: "pendiente" | "en_progreso" | "hecha") {
  if (estatus === "hecha") return "Hecha";
  if (estatus === "en_progreso") return "En progreso";
  return "Pendiente";
}

function mapCumplimientoFromBack(value?: BackCumplimiento | null): Cumplimiento {
  if (value === "cumplio") return "Cumplió" as Cumplimiento;
  if (value === "no_cumplio") return "No cumplió" as Cumplimiento;
  return "N/A" as Cumplimiento;
}

function mapCumplimientoToBack(value: Cumplimiento): BackCumplimiento {
  if (value === "Cumplió") return "cumplio";
  if (value === "No cumplió") return "no_cumplio";
  return "na";
}

export default function EmployeeReviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const employeeId =
    getParamValue(params.id as string | string[] | undefined) ||
    getParamValue(params.employeeId as string | string[] | undefined);

  const sprintId = searchParams.get("sprint") ?? "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [empleado, setEmpleado] = useState({
    nombre: "",
    grupo: "",
  });

  const [tasks, setTasks] = useState<TareaRevision[]>([]);
  const [comentarioGeneral, setComentarioGeneral] = useState("");

  async function loadRevision() {
    try {
      setLoading(true);
      setError("");

      if (!employeeId || !sprintId) {
        throw new Error("Faltan datos para cargar la revisión");
      }

      const token = getToken();

      const res = await apiFetch(
        `/evaluaciones/revision/${employeeId}/${sprintId}`,
        {
          method: "GET",
          token: token || undefined,
        }
      );

      const data = (res.data || {}) as RevisionResponse;

      setEmpleado({
        nombre: data.empleado?.nombre_empleado || `Empleado ${employeeId}`,
        grupo: data.empleado?.nombre_grupo || "Sin grupo",
      });

      const mappedTasks: TareaRevision[] = (data.tareas || []).map((t) => ({
        id: String(t.id_tarea),
        titulo: t.nombre_tarea,
        fechaLimite: formatDate(t.fecha_limite),
        estado: mapEstado(t.estatus),
        cumplimiento: mapCumplimientoFromBack(t.cumplimiento),
        comentario: t.comentario || "",
      }));

      setTasks(mappedTasks);
      setComentarioGeneral(data.comentario_general || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando revisión");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRevision();
  }, [employeeId, sprintId]);

  function onChangeCumplimiento(taskId: string, value: Cumplimiento) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, cumplimiento: value } : t))
    );
  }

  function onChangeComentario(taskId: string, value: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, comentario: value } : t))
    );
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");

      if (!employeeId || !sprintId) {
        throw new Error("Faltan datos para guardar la revisión");
      }

      const token = getToken();

      await apiFetch("/evaluaciones/revision", {
        method: "POST",
        token: token || undefined,
        body: JSON.stringify({
          id_empleado: Number(employeeId),
          id_sprint: Number(sprintId),
          comentario_general: comentarioGeneral,
          tareas: tasks.map((t) => ({
            id_tarea: Number(t.id),
            cumplimiento: mapCumplimientoToBack(t.cumplimiento),
            comentario: t.comentario,
          })),
        }),
      });

      router.push("/evaluation/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error guardando revisión");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-6">Cargando revisión del empleado...</div>;
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-lg bg-red-100 px-4 py-2 text-red-700">
          {error}
        </div>
      ) : null}

      <EmployeeReviewHeader
        nombre={empleado.nombre}
        grupo={empleado.grupo}
        onBack={() => router.push("/evaluation/admin")}
      />

      <TasksReviewPanel
        tasks={tasks}
        onChangeCumplimiento={onChangeCumplimiento}
        onChangeComentario={onChangeComentario}
      />

      <GeneralFeedbackPanel
        value={comentarioGeneral}
        onChange={setComentarioGeneral}
        onSave={handleSave}
      />

      {saving ? (
        <p className="text-sm text-zinc-500">Guardando evaluación...</p>
      ) : null}
    </div>
  );
}