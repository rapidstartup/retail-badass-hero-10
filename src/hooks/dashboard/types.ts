
export type PeriodType = 'day' | 'week' | 'month';

export interface DashboardStats {
  todaySales: number;
  currentPeriodSales: number;
  salesTrend: number;
  transactionCount: number;
  transactionTrend: number;
  newCustomersCount: number;
  customersTrend: number;
  itemsSold: number;
  todayItemsSold: number;
  itemsSoldTrend: number;
  formattedDate: string;
  periodLabel: string;
}
