import { Button } from "@/components/ui/button";
import { CalendarDays, Download } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
  onExport?: () => void;
}

export function Header({ title, subtitle, onExport }: HeaderProps) {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-peibo-text">{title}</h1>
          <p className="text-peibo-muted">{subtitle}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-peibo-gray px-4 py-2 rounded-lg">
            <CalendarDays className="w-4 h-4 text-peibo-muted" />
            <span className="text-sm font-medium text-peibo-text">{currentDate}</span>
          </div>
          
          {onExport && (
            <Button 
              onClick={onExport}
              className="bg-peibo-blue hover:bg-peibo-blue/90 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
