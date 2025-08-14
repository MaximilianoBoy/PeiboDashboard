import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  CreditCard, 
  AlertTriangle, 
  Package, 
  FileBarChart 
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Gestión de Tarjetas', href: '/cards', icon: CreditCard },
  { name: 'Incidencias', href: '/incidents', icon: AlertTriangle },
  { name: 'Inventario', href: '/inventory', icon: Package },
  { name: 'Reportes', href: '/reports', icon: FileBarChart },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200 fixed h-full z-10">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-peibo-blue rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-peibo-text">Peibo</h1>
            <p className="text-sm text-peibo-muted">Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "sidebar-item px-4 py-3 rounded-lg cursor-pointer flex items-center space-x-3",
                isActive 
                  ? "bg-peibo-blue bg-opacity-10 border-l-4 border-peibo-blue" 
                  : "hover:bg-peibo-blue hover:bg-opacity-10"
              )}>
                <Icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-peibo-blue" : "text-peibo-muted"
                )} />
                <span className={cn(
                  "font-medium",
                  isActive ? "text-peibo-blue" : "text-peibo-muted"
                )}>
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
