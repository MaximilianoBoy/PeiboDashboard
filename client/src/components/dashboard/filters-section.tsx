import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterState } from "@/types/dashboard";

interface FiltersSectionProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
  clients: Array<{ id: string; name: string; }>;
}

export function FiltersSection({ filters, onFiltersChange, onApplyFilters, clients }: FiltersSectionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-peibo-text">Filtros de Consulta</h3>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-peibo-muted">Fecha:</label>
              <Select 
                value={filters.dateRange}
                onValueChange={(value) => onFiltersChange({ ...filters, dateRange: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 días</SelectItem>
                  <SelectItem value="30d">Últimos 30 días</SelectItem>
                  <SelectItem value="3m">Últimos 3 meses</SelectItem>
                  <SelectItem value="1y">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-peibo-muted">Cliente:</label>
              <Select 
                value={filters.client}
                onValueChange={(value) => onFiltersChange({ ...filters, client: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-peibo-muted">Canal:</label>
              <Select 
                value={filters.channel}
                onValueChange={(value) => onFiltersChange({ ...filters, channel: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los canales</SelectItem>
                  <SelectItem value="branch">Sucursal</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="call_center">Call Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={onApplyFilters}
              className="bg-peibo-blue hover:bg-peibo-blue/90 text-white"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
