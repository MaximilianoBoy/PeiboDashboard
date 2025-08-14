import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { StockSection } from "@/components/dashboard/stock-section";
import { InventoryItem } from "@shared/schema";

export default function Inventory() {
  const { data: inventory = [], isLoading: inventoryLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
  });

  if (inventoryLoading) {
    return (
      <div className="min-h-screen flex bg-peibo-light-gray">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen">
          <Header 
            title="Inventario" 
            subtitle="Control de stock y alertas"
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
          title="Inventario" 
          subtitle="Control de stock y alertas"
        />
        
        <div className="p-8">
          <StockSection inventoryItems={inventory} />
        </div>
      </main>
    </div>
  );
}
