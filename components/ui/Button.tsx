type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
};

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "px-4 py-2 font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500";

  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900";

  return <button className={`${base} ${styles} rounded-lg ${className}`} {...props} />;
}
