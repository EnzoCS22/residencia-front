export default function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`bg-white rounded-xl shadow-lg ${className}`}>{children}</div>;
}
