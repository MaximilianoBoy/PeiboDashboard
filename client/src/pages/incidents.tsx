import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { IncidentsSection } from "@/components/dashboard/incidents-section";
import { Incident, Client } from "@shared/schema";

export default function Incidents() {
  const { data: incidents = [], isLoading: incidentsLoading } = useQuery<Incident[]>({
    queryKey: ["/api/incidents"],
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export/incidents');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'incidents_export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleCreateIncident = () => {
    console.log('Create incident');
  };

  const handleViewIncident = (incident: Incident) => {
    console.log('View incident:', incident);
  };

  const handleEditIncident = (incident: Incident) => {
    console.log('Edit incident:', incident);
  };

  if (incidentsLoading || clientsLoading) {
    return (
      <div className="min-h-screen flex bg-peibo-light-gray">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen">
          <Header 
            title="Gestión de Incidencias" 
            subtitle="Seguimiento y resolución de incidencias"
            onExport={handleExport}
          />
          <div className="p-8">
            <div className="animate-pulse">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
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
          title="Gestión de Incidencias" 
          subtitle="Seguimiento y resolución de incidencias"
          onExport={handleExport}
        />
        
        <div className="p-8">
          <IncidentsSection
            incidents={incidents}
            clients={clients}
            onCreateIncident={handleCreateIncident}
            onViewIncident={handleViewIncident}
            onEditIncident={handleEditIncident}
          />
        </div>
      </main>
    </div>
  );
}
