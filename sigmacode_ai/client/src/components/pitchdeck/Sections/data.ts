// Zentrale, typisierte Datenhaltung für Pitchdeck-Sections
// Vermeidet Duplikate und erleichtert Tests/Refactoring

export type CostItem = { name: string; value: number };
export const costData: CostItem[] = [
  { name: 'Personal', value: 700 },
  { name: 'Hardware', value: 300 },
  { name: 'Cloud & Pilot', value: 100 },
];

export type RevenueItem = { year: number; revenue: number };
export const revenueData: RevenueItem[] = [
  { year: 2025, revenue: 0.2 },
  { year: 2026, revenue: 0.6 },
  { year: 2027, revenue: 1.15 },
  { year: 2028, revenue: 6.0 },
  { year: 2029, revenue: 16.0 },
  { year: 2030, revenue: 28.0 },
];
