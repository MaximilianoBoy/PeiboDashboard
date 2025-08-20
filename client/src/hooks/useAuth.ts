import { useState, useEffect } from "react";
import { useLocation } from "wouter";          // ✅ comilla cerrada y correcto
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface ApiLoginResponse {
  token?: string;
  user?: User;
}
type ApiMeResponse = User | { user: User }; // acepta ambas formas

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("authToken")
  );

  const [, setLocation] = useLocation();       // ✅ necesario para redirigir

  // al montar: si no hay token, ya no cargamos
  useEffect(() => {
    if (!token) setIsLoading(false);
  }, []); // solo una vez

  // sincroniza token entre pestañas
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "authToken") setToken(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // valida token cuando cambie
  useEffect(() => {
    if (token) void checkAuth();
    else {
      setUser(null);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // acepta tokenOverride para usar el token recién emitido en login
  const checkAuth = async (tokenOverride?: string | null) => {
    try {
      setIsLoading(true);
      setError(null);

      const bearer = tokenOverride ?? token; // usa el más fresco
      const me = await apiRequest<ApiMeResponse>("/api/auth/me", {
        headers: { Authorization: `Bearer ${bearer}` },
      });

      const resolvedUser: User | null =
        (me as any)?.user ? (me as { user: User }).user : ((me as User) ?? null);

      if (!resolvedUser) throw new Error("User data not found in response");

      setUser(resolvedUser);
    } catch (err) {
      console.error("Authentication error:", err);
      setError(
        err instanceof Error ? err.message : "Unknown authentication error"
      );
      localStorage.removeItem("authToken");
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const resp = await apiRequest<ApiLoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (!resp?.token) throw new Error("Token not found in response");

      localStorage.setItem("authToken", resp.token);
      setToken(resp.token);

      // si el backend envía el usuario en el login, úsalo ya
      if (resp.user) setUser(resp.user);

      // carga inmediata del usuario con el token fresco
      await checkAuth(resp.token);

      // (opcional) redirigir al dashboard
      setLocation("/");
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Unknown login error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await apiRequest("/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("authToken");
      setToken(null);
      setUser(null);
      setError(null);
      setLocation("/login");                 
    }
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    token,
    login,
    logout,
    checkAuth,
  };
}
