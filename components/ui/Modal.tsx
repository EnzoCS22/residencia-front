"use client";

export default function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-xl border border-zinc-200 shadow-xl">
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
          <p className="font-semibold text-zinc-900">{title}</p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-zinc-100 text-zinc-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
