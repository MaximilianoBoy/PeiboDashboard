import { ChartData } from "@/types/dashboard";

export const cardEvolutionData: ChartData[] = [
  { month: 'Ene', value: 18500, name: 'Enero' },
  { month: 'Feb', value: 19200, name: 'Febrero' },
  { month: 'Mar', value: 20100, name: 'Marzo' },
  { month: 'Abr', value: 21800, name: 'Abril' },
  { month: 'May', value: 22900, name: 'Mayo' },
  { month: 'Jun', value: 24567, name: 'Junio' },
];

export const statusDistributionData: ChartData[] = [
  { name: 'Activas', value: 24567 },
  { name: 'Bloqueadas', value: 1234 },
  { name: 'Entregadas', value: 18945 },
  { name: 'En Tránsito', value: 3456 },
];

export const PEIBO_COLORS = {
  blue: '#004481',
  lightBlue: '#0073E6',
  aqua: '#2DCCCD',
  gray: '#F4F6F9',
  lightGray: '#FAFBFC',
  text: '#1A1A1A',
  muted: '#6C7B7F',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#f59e0b',
};
