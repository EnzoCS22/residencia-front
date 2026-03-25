"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { resetPassword } from "@/lib/api/auth.api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = useMemo(() => searchParams.get("email") ?? "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      setError("No se encontró un correo válido para recuperar la cuenta.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Completa todos los campos.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await resetPassword({
        correo: email,
        password,
      });

      setSuccessMessage("Contraseña actualizada correctamente.");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar la contraseña"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg" />
            <h1 className="text-xl font-semibold text-zinc-900">Xilion</h1>
          </div>
          <p className="text-zinc-500 text-sm mt-2 text-center">
            Establece una nueva contraseña
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-900">
              Correo verificado
            </label>
            <Input type="email" value={email} disabled className="opacity-80" />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-900">
              Nueva contraseña
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-900">
              Confirmar nueva contraseña
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : null}

          {successMessage ? (
            <p className="text-sm text-green-600">{successMessage}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Actualizando..." : "Confirmar cambio"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-600">
          <Link href="/login" className="text-blue-600 hover:underline">
            Volver a iniciar sesión
          </Link>
        </div>
      </Card>
    </div>
  );
}