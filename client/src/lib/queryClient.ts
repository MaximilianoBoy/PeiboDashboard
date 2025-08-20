// client/src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

// 🌐 Base de API (para producción). En dev puedes dejarla vacía y usar el proxy de Vite.
// En Vercel define VITE_API_URL = "https://tu-backend.onrender.com" (sin slash final)
const API_BASE = import.meta.env?.VITE_API_URL ?? "";

// Si la URL viene relativa (empieza con "/"), le anteponemos la base en prod.
// Si ya viene absoluta ("http://", "https://"), la dejamos tal cual.
function resolveUrl(url: string) {
  const isAbsolute = /^https?:\/\//i.test(url);
  if (isAbsolute) return url;
  if (API_BASE && url.startsWith("/")) {
    return API_BASE + url;
  }
  return url;
}

// ✅ QueryClient (React Query)
export const queryClient = new QueryClient();

// ✅ Helper genérico para llamadas HTTP (fetch-like)
export async function apiRequest<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const finalUrl = resolveUrl(url);

  const headersIn = (options?.headers as Record<string, string> | undefined) ?? {};
  // Solo añadimos Content-Type si hay body y el usuario no lo puso
  const shouldAddJson =
    !!options?.body &&
    !Object.keys(headersIn).some((k) => k.toLowerCase() === "content-type");

  const res = await fetch(finalUrl, {
    method: options?.method ?? "GET",
    headers: {
      ...headersIn,
      ...(shouldAddJson ? { "Content-Type": "application/json" } : {}),
    },
    body: options?.body,
    // Si usas cookies/sesiones en vez de Bearer, cambia a 'include'
    credentials: options?.credentials ?? "same-origin",
  });

  const ct = res.headers.get("content-type") || "";
  const text = await res.text();
  const payload = ct.includes("application/json")
    ? (text ? JSON.parse(text) : null)
    : text;

  if (!res.ok) {
    const msg =
      typeof payload === "string" && payload ? ` - ${payload}` : "";
    throw new Error(`HTTP ${res.status} ${res.statusText}${msg}`);
  }
  return payload as T;
}

// (opcionales)
export const apiGet = <T = any>(url: string, options?: RequestInit) =>
  apiRequest<T>(url, { ...(options || {}), method: "GET" });

export const apiPost = <T = any>(
  url: string,
  body?: unknown,
  options?: RequestInit
) =>
  apiRequest<T>(url, {
    ...(options || {}),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...((options?.headers as Record<string, string>) || {}),
    },
    body: body != null ? JSON.stringify(body) : options?.body,
  });
