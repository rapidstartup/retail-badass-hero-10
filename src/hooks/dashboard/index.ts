
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/utils/formatters";
import { calculatePeriodRanges } from "./useDatePeriods";
import { calculateItemsSold } from "./useItemsCalculations";
import { calculateTrendPercentage } from "./useTrendCalculations";
import { 
  fetchCurrentPeriodTransactions,
  fetchPreviousPeriodTransactions,
  fetchTodayTransactions,
  fetchCurrentPeriodCustomers,
  fetchPreviousPeriodCustomers
} from "./useDashboardQueries";
import { PeriodType, DashboardStats } from "./types";

export { PeriodType } from "./types";

export const useDashboardStats = (periodType: PeriodType = 'week') => {
  return useQuery({
    queryKey: ["dashboard-stats", periodType],
    queryFn: async (): Promise<DashboardStats> => {
      // Calculate date periods
      const {
        today,
        currentPeriodStart,
        previousPeriodStart,
        previousPeriodEnd,
        periodLabel
      } = calculatePeriodRanges(periodType);
      
      // Fetch data
      const currentPeriodTransactions = await fetchCurrentPeriodTransactions(currentPeriodStart);
      const previousPeriodTransactions = await fetchPreviousPeriodTransactions(previousPeriodStart, previousPeriodEnd);
      const todayTransactions = await fetchTodayTransactions(today);
      const currentPeriodCustomers = await fetchCurrentPeriodCustomers(currentPeriodStart);
      const previousPeriodCustomers = await fetchPreviousPeriodCustomers(previousPeriodStart, previousPeriodEnd);
      
      // Calculate stats
      const todaySales = todayTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
      const currentPeriodSales = currentPeriodTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
      const previousPeriodSales = previousPeriodTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
      
      // Calculate trends
      const salesTrend = calculateTrendPercentage(currentPeriodSales, previousPeriodSales);
      
      // Calculate total items sold
      const currentPeriodItemsSold = calculateItemsSold(currentPeriodTransactions);
      const todayItemsSold = calculateItemsSold(todayTransactions);
      
      // Calculate customer stats
      const newCustomersCount = currentPeriodCustomers.length;
      const previousPeriodNewCustomersCount = previousPeriodCustomers.length;
      const customersTrend = calculateTrendPercentage(newCustomersCount, previousPeriodNewCustomersCount);
      
      return {
        todaySales,
        currentPeriodSales,
        salesTrend,
        transactionCount: currentPeriodTransactions.length,
        transactionTrend: salesTrend, // Using sales trend as proxy for transaction trend
        newCustomersCount,
        customersTrend,
        itemsSold: currentPeriodItemsSold,
        todayItemsSold,
        itemsSoldTrend: salesTrend, // Using sales trend as proxy for items trend
        formattedDate: formatDate(today),
        periodLabel
      };
    }
  });
};
