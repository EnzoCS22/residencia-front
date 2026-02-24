"use client";

export default function SprintFilter({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="max-w-xs">
      <label className="text-sm font-medium text-zinc-900">Seleccionar Sprint</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border border-zinc-300 bg-white px-3 py-2 rounded-lg
                   text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((op) => (
          <option key={op} value={op} className="text-zinc-900 bg-white">
            {op}
          </option>
        ))}
      </select>
    </div>
  );
}