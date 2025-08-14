import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: number;
  change: number;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  iconBgColor: string;
}

export function KPICard({ title, value, change, changeType, icon, iconBgColor }: KPICardProps) {
  const getTrendIcon = () => {
    switch (changeType) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTrendColor = () => {
    switch (changeType) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <Card className="kpi-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-peibo-muted text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-peibo-text mt-1">
              {value.toLocaleString('es-ES')}
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon()}
              <span className={cn("text-sm ml-1", getTrendColor())}>
                {changeType === 'up' ? '+' : ''}{change}%
              </span>
            </div>
          </div>
          <div className={cn("p-3 rounded-full", iconBgColor)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
