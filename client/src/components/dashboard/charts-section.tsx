import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChartData } from "@/types/dashboard";
import { PEIBO_COLORS } from "@/lib/mock-data";

interface ChartsSectionProps {
  evolutionData: ChartData[];
  distributionData: ChartData[];
}

const PIE_COLORS = [PEIBO_COLORS.blue, PEIBO_COLORS.red, PEIBO_COLORS.aqua, PEIBO_COLORS.yellow];

export function ChartsSection({ evolutionData, distributionData }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-peibo-text">
            Evolución de Tarjetas por Mes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="chart-container rounded-lg p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6C7B7F"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6C7B7F"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: number) => [value.toLocaleString('es-ES'), 'Tarjetas']}
                  labelStyle={{ color: '#1A1A1A' }}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: `1px solid ${PEIBO_COLORS.blue}`,
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={PEIBO_COLORS.blue}
                  strokeWidth={3}
                  dot={{ fill: PEIBO_COLORS.blue, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: PEIBO_COLORS.blue, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-peibo-text">
            Distribución por Estado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="chart-container rounded-lg p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [value.toLocaleString('es-ES'), 'Tarjetas']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: `1px solid ${PEIBO_COLORS.blue}`,
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
