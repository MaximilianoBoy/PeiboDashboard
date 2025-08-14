export interface DashboardKPIs {
  active: number;
  blocked: number;
  delivered: number;
  transit: number;
}

export interface ChartData {
  name?: string;
  value: number;
  month?: string;
}

export interface FilterState {
  dateRange: string;
  client: string;
  channel: string;
}

export interface InventoryAlert {
  id: string;
  itemName: string;
  currentStock: number;
  minimumStock: number;
  alertLevel: 'critical' | 'low' | 'optimal';
  daysRemaining: number;
}
