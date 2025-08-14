import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { InventoryItem } from "@shared/schema";
import { cn } from "@/lib/utils";

interface StockSectionProps {
  inventoryItems: InventoryItem[];
}

export function StockSection({ inventoryItems }: StockSectionProps) {
  const getAlertLevel = (currentStock: number, minimumStock: number) => {
    const ratio = currentStock / minimumStock;
    if (ratio < 0.5) return 'critical';
    if (ratio < 1) return 'low';
    return 'optimal';
  };

  const getAlertBadge = (level: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      optimal: 'default',
      low: 'secondary',
      critical: 'destructive',
    };
    
    const labels: Record<string, string> = {
      optimal: 'Óptimo',
      low: 'Bajo',
      critical: 'Crítico',
    };

    return (
      <Badge variant={variants[level] || 'outline'}>
        {labels[level] || level}
      </Badge>
    );
  };

  const getProgressColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500';
      case 'low':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const calculateDaysRemaining = (currentStock: number, minimumStock: number, level: string) => {
    if (level === 'optimal') return 30;
    if (level === 'low') return 12;
    return 3;
  };

  const activeAlerts = inventoryItems.filter(item => 
    getAlertLevel(item.currentStock, item.minimumStock) !== 'optimal'
  ).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-peibo-text">
            Inventario y Alertas
          </CardTitle>
          <div className="flex space-x-3">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {activeAlerts} Alertas Activas
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {inventoryItems.map((item) => {
            const alertLevel = getAlertLevel(item.currentStock, item.minimumStock);
            const progressPercentage = Math.min((item.currentStock / item.minimumStock) * 100, 100);
            const daysRemaining = calculateDaysRemaining(item.currentStock, item.minimumStock, alertLevel);
            
            return (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-peibo-text">{item.itemName}</h4>
                  {getAlertBadge(alertLevel)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-peibo-muted">Stock Actual:</span>
                    <span className="font-semibold text-peibo-text">
                      {item.currentStock.toLocaleString('es-ES')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-peibo-muted">Mínimo:</span>
                    <span className={cn(
                      "font-semibold",
                      alertLevel === 'critical' ? 'text-red-600' : 
                      alertLevel === 'low' ? 'text-yellow-600' : 'text-green-600'
                    )}>
                      {item.minimumStock.toLocaleString('es-ES')}
                    </span>
                  </div>
                  <Progress 
                    value={progressPercentage}
                    className="w-full h-2"
                  />
                  <p className={cn(
                    "text-xs",
                    alertLevel === 'critical' ? 'text-red-600' : 
                    alertLevel === 'low' ? 'text-yellow-600' : 'text-green-600'
                  )}>
                    {alertLevel === 'optimal' 
                      ? `Stock suficiente para ${daysRemaining}+ días`
                      : `Agotamiento estimado en ${daysRemaining} días`
                    }
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
