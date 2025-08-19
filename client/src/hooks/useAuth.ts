import { useState, useEffect } from "react";
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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("authToken"));

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

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const me = await apiRequest<ApiMeResponse>("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const resolvedUser: User | null =
        (me as any)?.user ? (me as { user: User }).user : ((me as User) ?? null);

      if (!resolvedUser) throw new Error("User data not found in response");

      setUser(resolvedUser);
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err instanceof Error ? err.message : "Unknown authentication error");
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
      if (resp.user) setUser(resp.user);
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
    }
  };

  return { user, isLoading, error, isAuthenticated: !!user, token, login, logout, checkAuth };
}
