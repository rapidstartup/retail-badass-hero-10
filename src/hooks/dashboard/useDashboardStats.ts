
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '@/utils/formatters';
import { 
  PeriodType, 
  DashboardStats 
} from './types';
import { 
  calculatePeriodRanges,
  calculateItemsSold,
  calculateTrendPercentage,
  fetchCurrentPeriodTransactions,
  fetchPreviousPeriodTransactions,
  fetchTodayTransactions,
  fetchCurrentPeriodCustomers,
  fetchPreviousPeriodCustomers
} from './index';

export const useDashboardStats = (periodType: PeriodType) => {
  return useQuery({
    queryKey: ['dashboardStats', periodType],
    queryFn: async () => {
      // Get the date ranges for the selected period
      const { today, currentPeriodStart, previousPeriodStart, previousPeriodEnd, periodLabel } = calculatePeriodRanges(periodType);
      
      // Fetch transactions for current and previous periods
      const [
        currentPeriodTransactions,
        previousPeriodTransactions, 
        todayTransactions,
        currentPeriodCustomers,
        previousPeriodCustomers
      ] = await Promise.all([
        fetchCurrentPeriodTransactions(currentPeriodStart),
        fetchPreviousPeriodTransactions(previousPeriodStart, previousPeriodEnd),
        fetchTodayTransactions(today),
        fetchCurrentPeriodCustomers(currentPeriodStart),
        fetchPreviousPeriodCustomers(previousPeriodStart, previousPeriodEnd)
      ]);
      
      // Calculate sales amount for each period
      const currentPeriodSales = currentPeriodTransactions.reduce((sum, t) => sum + t.total, 0);
      const previousPeriodSales = previousPeriodTransactions.reduce((sum, t) => sum + t.total, 0);
      const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0);
      
      // Calculate items sold
      const currentPeriodItemsSold = calculateItemsSold(currentPeriodTransactions);
      const previousPeriodItemsSold = calculateItemsSold(previousPeriodTransactions);
      const todayItemsSold = calculateItemsSold(todayTransactions);
      
      // Calculate period-over-period trend percentages
      const salesTrend = calculateTrendPercentage(currentPeriodSales, previousPeriodSales);
      const transactionTrend = calculateTrendPercentage(
        currentPeriodTransactions.length, 
        previousPeriodTransactions.length
      );
      const customersTrend = calculateTrendPercentage(
        currentPeriodCustomers.length, 
        previousPeriodCustomers.length
      );
      const itemsSoldTrend = calculateTrendPercentage(currentPeriodItemsSold, previousPeriodItemsSold);
      
      // Format date range string for display - using start and end dates
      const formattedDate = `${formatDate(currentPeriodStart)} - ${formatDate(new Date())}`;
      
      // Prepare dashboard stats object
      const dashboardStats: DashboardStats = {
        todaySales,
        currentPeriodSales,
        salesTrend,
        transactionCount: currentPeriodTransactions.length,
        transactionTrend,
        newCustomersCount: currentPeriodCustomers.length,
        customersTrend,
        itemsSold: currentPeriodItemsSold,
        todayItemsSold,
        itemsSoldTrend,
        formattedDate,
        periodLabel
      };
      
      return dashboardStats;
    }
  });
};
