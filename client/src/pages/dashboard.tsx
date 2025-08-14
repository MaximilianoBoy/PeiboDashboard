import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { KPICard } from "@/components/dashboard/kpi-card";
import { FiltersSection } from "@/components/dashboard/filters-section";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { IncidentsSection } from "@/components/dashboard/incidents-section";
import { StockSection } from "@/components/dashboard/stock-section";
import { CheckCircle, XCircle, Truck, Clock } from "lucide-react";
import { DashboardKPIs, FilterState } from "@/types/dashboard";
import { cardEvolutionData, statusDistributionData } from "@/lib/mock-data";
import { Card, Client, Incident, InventoryItem } from "@shared/schema";

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: "30d",
    client: "all",
    channel: "all"
  });

  // Fetch KPI data
  const { data: kpis = { active: 0, blocked: 0, delivered: 0, transit: 0 }, isLoading: kpisLoading } = useQuery<DashboardKPIs>({
    queryKey: ["/api/cards/stats"],
  });

  // Fetch incidents
  const { data: incidents = [], isLoading: incidentsLoading } = useQuery<Incident[]>({
    queryKey: ["/api/incidents"],
  });

  // Fetch inventory
  const { data: inventory = [], isLoading: inventoryLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
  });

  // Fetch clients
  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export/cards');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dashboard_export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleApplyFilters = () => {
    // TODO: Apply filters to data queries
    console.log('Applying filters:', filters);
  };

  const handleCreateIncident = () => {
    // TODO: Open create incident modal
    console.log('Create incident');
  };

  const handleViewIncident = (incident: Incident) => {
    // TODO: Open view incident modal
    console.log('View incident:', incident);
  };

  const handleEditIncident = (incident: Incident) => {
    // TODO: Open edit incident modal
    console.log('Edit incident:', incident);
  };

  if (kpisLoading || incidentsLoading || inventoryLoading || clientsLoading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen">
          <Header 
            title="Dashboard Principal" 
            subtitle="Resumen ejecutivo de operaciones"
            onExport={handleExport}
          />
          <div className="p-8">
            <div className="animate-pulse space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-peibo-light-gray">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header 
          title="Dashboard Principal" 
          subtitle="Resumen ejecutivo de operaciones"
          onExport={handleExport}
        />
        
        <div className="p-8 space-y-8">
          {/* KPI Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <KPICard
              title="Tarjetas Activas"
              value={kpis.active}
              change={12.3}
              changeType="up"
              icon={<CheckCircle className="w-6 h-6 text-green-600" />}
              iconBgColor="bg-green-100"
            />
            <KPICard
              title="Tarjetas Bloqueadas"
              value={kpis.blocked}
              change={5.1}
              changeType="down"
              icon={<XCircle className="w-6 h-6 text-red-600" />}
              iconBgColor="bg-red-100"
            />
            <KPICard
              title="Tarjetas Entregadas"
              value={kpis.delivered}
              change={8.7}
              changeType="up"
              icon={<CheckCircle className="w-6 h-6 text-blue-600" />}
              iconBgColor="bg-blue-100"
            />
            <KPICard
              title="En Tránsito"
              value={kpis.transit}
              change={-2.1}
              changeType="down"
              icon={<Truck className="w-6 h-6 text-yellow-600" />}
              iconBgColor="bg-yellow-100"
            />
          </section>

          {/* Filters */}
          <FiltersSection
            filters={filters}
            onFiltersChange={setFilters}
            onApplyFilters={handleApplyFilters}
            clients={clients}
          />

          {/* Charts */}
          <ChartsSection
            evolutionData={cardEvolutionData}
            distributionData={statusDistributionData}
          />

          {/* Incidents */}
          <IncidentsSection
            incidents={incidents.slice(0, 3)} // Show only first 3 incidents
            clients={clients}
            onCreateIncident={handleCreateIncident}
            onViewIncident={handleViewIncident}
            onEditIncident={handleEditIncident}
          />

          {/* Stock */}
          <StockSection inventoryItems={inventory} />
        </div>
      </main>
    </div>
  );
}
