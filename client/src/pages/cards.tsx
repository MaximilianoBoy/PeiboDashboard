import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Plus } from "lucide-react";
import { Card as CardType, Client } from "@shared/schema";

export default function Cards() {
  const { data: cards = [], isLoading: cardsLoading } = useQuery<CardType[]>({
    queryKey: ["/api/cards"],
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente desconocido';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      blocked: 'destructive',
      delivered: 'secondary',
      transit: 'outline',
    };
    
    const labels: Record<string, string> = {
      active: 'Activa',
      blocked: 'Bloqueada',
      delivered: 'Entregada',
      transit: 'En Tránsito',
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export/cards');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cards_export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (cardsLoading || clientsLoading) {
    return (
      <div className="min-h-screen flex bg-peibo-light-gray">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen">
          <Header 
            title="Gestión de Tarjetas" 
            subtitle="Administración y seguimiento de tarjetas"
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
          title="Gestión de Tarjetas" 
          subtitle="Administración y seguimiento de tarjetas"
          onExport={handleExport}
        />
        
        <div className="p-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-peibo-text">
                  Todas las Tarjetas
                </CardTitle>
                <Button className="bg-peibo-blue hover:bg-peibo-blue/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Tarjeta
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-peibo-text">Número</th>
                      <th className="text-left py-3 px-4 font-semibold text-peibo-text">Cliente</th>
                      <th className="text-left py-3 px-4 font-semibold text-peibo-text">Tipo</th>
                      <th className="text-left py-3 px-4 font-semibold text-peibo-text">Canal</th>
                      <th className="text-left py-3 px-4 font-semibold text-peibo-text">Estado</th>
                      <th className="text-left py-3 px-4 font-semibold text-peibo-text">Emitida</th>
                      <th className="text-left py-3 px-4 font-semibold text-peibo-text">Entregada</th>
                      <th className="text-left py-3 px-4 font-semibold text-peibo-text">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cards.map((card) => (
                      <tr 
                        key={card.id} 
                        className="border-b border-gray-100 hover:bg-peibo-gray hover:bg-opacity-50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-peibo-text">
                          {card.cardNumber}
                        </td>
                        <td className="py-4 px-4 text-peibo-text">
                          {getClientName(card.clientId)}
                        </td>
                        <td className="py-4 px-4 text-peibo-muted capitalize">
                          {card.type}
                        </td>
                        <td className="py-4 px-4 text-peibo-muted capitalize">
                          {card.channel.replace('_', ' ')}
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(card.status)}
                        </td>
                        <td className="py-4 px-4 text-peibo-muted">
                          {card.issuedAt?.toLocaleDateString('es-ES') || '-'}
                        </td>
                        <td className="py-4 px-4 text-peibo-muted">
                          {card.deliveredAt?.toLocaleDateString('es-ES') || '-'}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-peibo-blue hover:bg-peibo-blue hover:bg-opacity-10"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
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
        </div>
      </main>
    </div>
  );
}
