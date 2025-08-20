// client/src/App.tsx
import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Cards from "@/pages/cards";
import Incidents from "@/pages/incidents";
import Inventory from "@/pages/inventory";
import Reports from "@/pages/reports";
import Login from "@/pages/login";

function Protected({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="p-6">Cargando…</div>;
  return isAuthenticated ? children : <Redirect to="/login" />;
}

function Routes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <Switch>
      {/* ✅ ahora sí existe /login */}
      <Route path="/login" component={Login} />

      {/* Raíz: manda al lugar correcto */}
      <Route path="/">
        {isAuthenticated ? <Dashboard /> : <Redirect to="/login" />}
      </Route>

      {/* Rutas protegidas */}
      <Route path="/cards">
        <Protected><Cards /></Protected>
      </Route>
      <Route path="/incidents">
        <Protected><Incidents /></Protected>
      </Route>
      <Route path="/inventory">
        <Protected><Inventory /></Protected>
      </Route>
      <Route path="/reports">
        <Protected><Reports /></Protected>
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Routes />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
