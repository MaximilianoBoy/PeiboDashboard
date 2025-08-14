import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3, TrendingUp } from "lucide-react";

export default function Reports() {
  const reports = [
    {
      id: 1,
      name: "Reporte de Tarjetas",
      description: "Resumen completo de todas las tarjetas y sus estados",
      type: "CSV",
      icon: FileText,
      endpoint: "/api/export/cards"
    },
    {
      id: 2,
      name: "Reporte de Incidencias",
      description: "Detalle de todas las incidencias registradas",
      type: "CSV",
      icon: BarChart3,
      endpoint: "/api/export/incidents"
    },
    {
      id: 3,
      name: "Análisis de Tendencias",
      description: "Análisis estadístico de tendencias mensual",
      type: "PDF",
      icon: TrendingUp,
      endpoint: "/api/export/trends"
    }
  ];

  const handleDownloadReport = async (endpoint: string, filename: string) => {
    try {
      const response = await fetch(endpoint);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex bg-peibo-light-gray">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header 
          title="Reportes" 
          subtitle="Generación y descarga de reportes"
        />
        
        <div className="p-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-peibo-text">
                Reportes Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => {
                  const Icon = report.icon;
                  return (
                    <Card key={report.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-2 bg-peibo-blue bg-opacity-10 rounded-lg">
                            <Icon className="w-6 h-6 text-peibo-blue" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-peibo-text">{report.name}</h3>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {report.type}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-peibo-muted mb-4">
                          {report.description}
                        </p>
                        
                        <Button
                          onClick={() => handleDownloadReport(
                            report.endpoint, 
                            `${report.name.toLowerCase().replace(/\s+/g, '_')}.${report.type.toLowerCase()}`
                          )}
                          className="w-full bg-peibo-blue hover:bg-peibo-blue/90 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Descargar {report.type}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
