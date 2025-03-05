
import { calculatePeriodRanges } from './useDatePeriods';
import { calculateItemsSold } from './useItemsCalculations';
import { calculateTrendPercentage } from './useTrendCalculations';
import { 
  fetchCurrentPeriodTransactions, 
  fetchPreviousPeriodTransactions,
  fetchTodayTransactions,
  fetchCurrentPeriodCustomers,
  fetchPreviousPeriodCustomers 
} from './useDashboardQueries';
import { useDashboardStats } from './useDashboardStats';

// Use export type for types to avoid TS1205 error when isolatedModules is enabled
export type { PeriodType, DashboardStats } from './types';

export { 
  calculatePeriodRanges,
  calculateItemsSold,
  calculateTrendPercentage,
  fetchCurrentPeriodTransactions, 
  fetchPreviousPeriodTransactions,
  fetchTodayTransactions,
  fetchCurrentPeriodCustomers,
  fetchPreviousPeriodCustomers,
  useDashboardStats
};
