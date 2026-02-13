export default function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "muted";
}) {
  const styles =
    variant === "success"
      ? "bg-emerald-100 text-emerald-700"
      : variant === "warning"
      ? "bg-amber-100 text-amber-700"
      : variant === "muted"
      ? "bg-zinc-100 text-zinc-600"
      : "bg-blue-100 text-blue-700";

  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${styles}`}>
      {children}
    </span>
  );
}
