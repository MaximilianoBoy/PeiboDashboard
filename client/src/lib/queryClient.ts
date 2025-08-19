// client/src/lib/queryClient.ts
export async function apiRequest<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    method: options?.method ?? "GET",
    headers: {
      ...(options?.headers as Record<string, string> | undefined),
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options?.body,
  });

  const ct = res.headers.get("content-type") || "";
  const text = await res.text();
  const payload = ct.includes("application/json") ? (text ? JSON.parse(text) : null) : text;

  if (!res.ok) {
    throw new Error(
      `HTTP ${res.status} ${res.statusText}${
        typeof payload === "string" && payload ? ` - ${payload}` : ""
      }`
    );
  }
  return payload as T;
}
