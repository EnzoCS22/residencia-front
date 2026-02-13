type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full border border-zinc-200 bg-zinc-100 px-3 py-2 rounded-lg
      text-zinc-900 placeholder:text-zinc-400
      focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}
