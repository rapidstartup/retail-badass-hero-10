
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";

export const useTransactionStats = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ["transaction-stats", dateRange],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('total, status, payment_method, created_at')
        .order('created_at', { ascending: false });

      // Apply date range filters if provided
      if (dateRange?.from) {
        query = query.gte('created_at', dateRange.from.toISOString());
      }

      if (dateRange?.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        query = query.lte('created_at', toDate.toISOString());
      }

      const { data: transactions, error } = await query;

      if (error) throw error;

      const totalSales = transactions.reduce((sum, tx) => 
        tx.status === 'completed' ? sum + (tx.total || 0) : sum, 0);
      
      const completedCount = transactions.filter(tx => tx.status === 'completed').length;
      const openTabsCount = transactions.filter(tx => tx.status === 'open').length;
      
      const paymentMethods = transactions
        .filter(tx => tx.status === 'completed')
        .reduce((acc: Record<string, number>, tx) => {
          const method = tx.payment_method || 'unknown';
          acc[method] = (acc[method] || 0) + 1;
          return acc;
        }, {});
      
      const topPaymentMethod = Object.entries(paymentMethods)
        .sort((a, b) => b[1] - a[1])
        .map(([method]) => method)[0] || 'None';
      
      const avgTransactionValue = completedCount > 0 
        ? totalSales / completedCount 
        : 0;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTransactions = transactions.filter(tx => 
        new Date(tx.created_at) >= today && 
        tx.status === 'completed'
      );
      const todaySales = todayTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      fourteenDaysAgo.setHours(0, 0, 0, 0);
      
      const last7DaysTransactions = transactions.filter(tx => 
        new Date(tx.created_at) >= sevenDaysAgo && 
        tx.status === 'completed'
      );
      
      const previous7DaysTransactions = transactions.filter(tx => 
        new Date(tx.created_at) >= fourteenDaysAgo && 
        new Date(tx.created_at) < sevenDaysAgo && 
        tx.status === 'completed'
      );
      
      const last7DaysSales = last7DaysTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
      const previous7DaysSales = previous7DaysTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
      
      const salesTrend = previous7DaysSales > 0 
        ? ((last7DaysSales - previous7DaysSales) / previous7DaysSales) * 100 
        : 0;

      return {
        totalSales,
        completedCount,
        openTabsCount,
        topPaymentMethod,
        avgTransactionValue,
        todaySales,
        salesTrend
      };
    }
  });
};
