export default function DonutScore({
  value,
  label = "GOOD",
}: {
  value: number; // 0-100
  label?: string;
}) {
  const radius = 56;
  const stroke = 12;
  const normalized = Math.min(100, Math.max(0, value));
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-40 h-40">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <g transform="translate(80,80)">
            {/* Track */}
            <circle
              r={radius}
              cx="0"
              cy="0"
              fill="transparent"
              strokeWidth={stroke}
              className="stroke-zinc-100"
            />
            {/* Progress */}
            <circle
              r={radius}
              cx="0"
              cy="0"
              fill="transparent"
              strokeWidth={stroke}
              strokeLinecap="round"
              className="stroke-blue-600"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90)"
            />
          </g>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-semibold text-zinc-900">{normalized}%</p>
          <p className="text-xs font-semibold tracking-wide text-zinc-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
