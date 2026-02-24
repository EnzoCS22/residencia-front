"use client";

import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

export default function GeneralFeedbackPanel({
  value,
  onChange,
  onSave,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-zinc-900">Comentario general del líder</h3>
      <p className="text-sm text-zinc-500">Retroalimentación global del sprint.</p>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej. Buen desempeño general, mejorar tiempos de entrega."
        className="min-h-[140px] mt-3"
      />

      <div className="flex justify-end mt-4">
        <Button onClick={onSave}>Guardar evaluación</Button>
      </div>
    </div>
  );
}