"use client";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg" />
            <h1 className="text-xl font-semibold text-zinc-900">Xilion</h1>
          </div>
          <p className="text-zinc-500 text-sm mt-2 text-center">
            Ingresa tus credenciales para acceder a tu espacio de trabajo
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-900">Email</label>
            <Input placeholder="name@company.com" type="email" />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-900">Contraseña</label>
              <button className="text-sm text-blue-600 hover:underline">
                ¿Olvidaste la contraseña?
              </button>
            </div>
            <Input placeholder="••••••••" type="password" />
          </div>

          <Button className="w-full">Ingresar</Button>
        </div>

        
      </Card>
    </div>
  );
}
