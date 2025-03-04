
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/formatters";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Get the date for today at 00:00:00
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      // Query for today's transactions
      const { data: todayTransactions, error: todayError } = await supabase
        .from('transactions')
        .select('total, items')
        .gte('created_at', today.toISOString())
        .eq('status', 'completed');
      
      if (todayError) throw todayError;
      
      // Query for yesterday's transactions
      const { data: yesterdayTransactions, error: yesterdayError } = await supabase
        .from('transactions')
        .select('total')
        .gte('created_at', yesterday.toISOString())
        .lt('created_at', today.toISOString())
        .eq('status', 'completed');
      
      if (yesterdayError) throw yesterdayError;
      
      // Calculate today's stats
      const todaySales = todayTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
      const todayItemsSold = todayTransactions.reduce((sum, tx) => {
        const items = Array.isArray(tx.items) ? tx.items : [];
        const itemCount = items.reduce((count, item) => count + (item.quantity || 1), 0);
        return sum + itemCount;
      }, 0);
      
      // Calculate yesterday's stats
      const yesterdaySales = yesterdayTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
      
      // Calculate trends
      const salesTrend = yesterdaySales > 0 
        ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 
        : 0;
      
      // Query for today's new customers
      const { data: todayCustomers, error: customersError } = await supabase
        .from('customers')
        .select('id')
        .gte('created_at', today.toISOString());
      
      if (customersError) throw customersError;
      
      // Query for yesterday's new customers
      const { data: yesterdayCustomers, error: yesterdayCustomersError } = await supabase
        .from('customers')
        .select('id')
        .gte('created_at', yesterday.toISOString())
        .lt('created_at', today.toISOString());
      
      if (yesterdayCustomersError) throw yesterdayCustomersError;
      
      const newCustomersCount = todayCustomers.length;
      const yesterdayNewCustomersCount = yesterdayCustomers.length;
      
      const customersTrend = yesterdayNewCustomersCount > 0 
        ? ((newCustomersCount - yesterdayNewCustomersCount) / yesterdayNewCustomersCount) * 100 
        : 0;
      
      return {
        todaySales,
        salesTrend,
        transactionCount: todayTransactions.length,
        transactionTrend: salesTrend, // Using sales trend as proxy for transaction trend
        newCustomersCount,
        customersTrend,
        itemsSold: todayItemsSold,
        itemsSoldTrend: salesTrend, // Using sales trend as proxy for items trend
        formattedDate: formatDate(today)
      };
    }
  });
};
