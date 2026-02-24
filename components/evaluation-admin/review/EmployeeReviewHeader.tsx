"use client";

import Button from "@/components/ui/Button";

export default function EmployeeReviewHeader({
  nombre,
  grupo,
  onBack,
}: {
  nombre: string;
  grupo: string;
  onBack: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Revisión de desempeño</h2>
        <p className="text-zinc-500">
          {nombre} • {grupo} • Sprint actual
        </p>
      </div>

      <Button variant="outline" onClick={onBack}>
        Volver
      </Button>
    </div>
  );
}