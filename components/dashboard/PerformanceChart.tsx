"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

export default function PerformanceChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-zinc-900">
            Rendimiento Semanal de Sprints
        </h3>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 8, 8]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
