"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { forgotPassword } from "@/lib/api/auth.api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();

    if (!correo) {
      setError("Ingresa tu correo electrónico.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setError("Ingresa un correo válido.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await forgotPassword({ correo });

      router.push(`/reset-password?email=${encodeURIComponent(correo)}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo procesar la solicitud"
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
            Recupera el acceso a tu cuenta
          </p>
        </div>

        <form onSubmit={handleContinue} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-900">
              Correo electrónico
            </label>
            <Input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="ejemplo@empresa.com"
            />
          </div>

          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Validando..." : "Continuar"}
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