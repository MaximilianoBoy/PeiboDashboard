import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit } from "lucide-react";
import { Incident, Client } from "@shared/schema";

interface IncidentsSectionProps {
  incidents: Incident[];
  clients: Client[];
  onCreateIncident: () => void;
  onViewIncident: (incident: Incident) => void;
  onEditIncident: (incident: Incident) => void;
}

export function IncidentsSection({ 
  incidents, 
  clients, 
  onCreateIncident, 
  onViewIncident, 
  onEditIncident 
}: IncidentsSectionProps) {
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente desconocido';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      new: 'outline',
      in_progress: 'secondary',
      resolved: 'default',
    };
    
    const labels: Record<string, string> = {
      new: 'Nuevo',
      in_progress: 'En Proceso',
      resolved: 'Resuelto',
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      low: 'outline',
      medium: 'secondary',
      high: 'destructive',
    };
    
    const labels: Record<string, string> = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
    };

    return (
      <Badge variant={variants[priority] || 'outline'}>
        {labels[priority] || priority}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-peibo-text">
            Gestión de Incidencias
          </CardTitle>
          <Button 
            onClick={onCreateIncident}
            className="bg-peibo-blue hover:bg-peibo-blue/90 text-white"
          >
            Nueva Incidencia
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-peibo-text">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-peibo-text">Descripción</th>
                <th className="text-left py-3 px-4 font-semibold text-peibo-text">Cliente</th>
                <th className="text-left py-3 px-4 font-semibold text-peibo-text">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-peibo-text">Prioridad</th>
                <th className="text-left py-3 px-4 font-semibold text-peibo-text">Fecha</th>
                <th className="text-left py-3 px-4 font-semibold text-peibo-text">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr 
                  key={incident.id} 
                  className="border-b border-gray-100 hover:bg-peibo-gray hover:bg-opacity-50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-peibo-text">
                    {incident.incidentNumber}
                  </td>
                  <td className="py-4 px-4 text-peibo-text">
                    {incident.title}
                  </td>
                  <td className="py-4 px-4 text-peibo-muted">
                    {getClientName(incident.clientId)}
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(incident.status)}
                  </td>
                  <td className="py-4 px-4">
                    {getPriorityBadge(incident.priority)}
                  </td>
                  <td className="py-4 px-4 text-peibo-muted">
                    {incident.createdAt ? new Date(incident.createdAt).toLocaleDateString('es-ES') : '-'}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewIncident(incident)}
                        className="text-peibo-blue hover:bg-peibo-blue hover:bg-opacity-10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditIncident(incident)}
                        className="text-peibo-muted hover:bg-gray-100"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
