"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm text-zinc-700">{message}</p>

      <div className="flex justify-end gap-3 mt-5">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onConfirm}>Eliminar</Button>
      </div>
    </Modal>
  );
}
