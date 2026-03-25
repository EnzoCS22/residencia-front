import { apiFetch } from "./http";

export type LoginPayload = {
  correo: string;
  password: string;
};

export type LoginResponse = {
  ok: true;
  message: string;
  data: {
    token: string;
    usuario: {
      id_usuario: number;
      nombre: string;
      correo: string;
      rol: "admin" | "lider" | "empleado";
      id_grupo: number | null;
    };
  };
};

export type MeResponse = {
  ok: true;
  data: {
    id_usuario: number;
    nombre: string;
    correo: string;
    rol: "admin" | "lider" | "empleado";
    activo: boolean;
    fecha_registro: string;
    id_grupo: number | null;
  };
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMe(token: string): Promise<MeResponse> {
  return apiFetch<MeResponse>("/auth/me", {
    method: "GET",
    token,
  });
}

export async function register(payload: {
  nombre: string;
  correo: string;
  password: string;
}) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function forgotPassword(payload: { correo: string }) {
  return apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: {
  correo: string;
  password: string;
}) {
  return apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}