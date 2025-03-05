
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/formatters";

type PeriodType = 'day' | 'week' | 'month';

export const useDashboardStats = (periodType: PeriodType = 'week') => {
  return useQuery({
    queryKey: ["dashboard-stats", periodType],
    queryFn: async () => {
      // Get the date for today at 00:00:00
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Setup period ranges based on the selected period type
      let currentPeriodStart: Date;
      let previousPeriodStart: Date;
      let previousPeriodEnd: Date;
      let periodLabel: string;
      
      if (periodType === 'day') {
        // Compare today vs yesterday
        currentPeriodStart = today;
        
        previousPeriodStart = new Date(today);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 1);
        
        previousPeriodEnd = new Date(previousPeriodStart);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        
        periodLabel = "yesterday";
      } else if (periodType === 'week') {
        // Current week (starting Monday)
        currentPeriodStart = new Date(today);
        const dayOfWeek = currentPeriodStart.getDay();
        const diff = currentPeriodStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        currentPeriodStart.setDate(diff);
        
        // Previous week
        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
        
        previousPeriodEnd = new Date(currentPeriodStart);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        
        periodLabel = "last week";
      } else if (periodType === 'month') {
        // Current month
        currentPeriodStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        // Previous month
        previousPeriodStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        
        previousPeriodEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        
        periodLabel = "last month";
      }
      
      // Query for current period transactions
      const { data: currentPeriodTransactions, error: currentPeriodError } = await supabase
        .from('transactions')
        .select('total, items')
        .gte('created_at', currentPeriodStart.toISOString())
        .eq('status', 'completed');
      
      if (currentPeriodError) throw currentPeriodError;
      
      // Query for previous period transactions
      const { data: previousPeriodTransactions, error: previousPeriodError } = await supabase
        .from('transactions')
        .select('total')
        .gte('created_at', previousPeriodStart.toISOString())
        .lt('created_at', previousPeriodEnd.toISOString())
        .eq('status', 'completed');
      
      if (previousPeriodError) throw previousPeriodError;
      
      // Query for today's transactions (always needed)
      const { data: todayTransactions, error: todayError } = await supabase
        .from('transactions')
        .select('total, items')
        .gte('created_at', today.toISOString())
        .eq('status', 'completed');
      
      if (todayError) throw todayError;
      
      // Calculate today's stats
      const todaySales = todayTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
      
      // Calculate current period stats
      const currentPeriodSales = currentPeriodTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
      
      // Calculate previous period stats
      const previousPeriodSales = previousPeriodTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
      
      // Calculate trends
      const salesTrend = previousPeriodSales > 0 
        ? ((currentPeriodSales - previousPeriodSales) / previousPeriodSales) * 100 
        : 0;
      
      // Calculate total items sold for current period
      const currentPeriodItemsSold = currentPeriodTransactions.reduce((sum, tx) => {
        // Safely handle items array
        if (!tx.items) return sum;
        
        let items: any[] = [];
        
        // Handle string or array
        if (typeof tx.items === 'string') {
          try {
            items = JSON.parse(tx.items);
          } catch (e) {
            console.error('Failed to parse items:', e);
            return sum;
          }
        } else if (Array.isArray(tx.items)) {
          items = tx.items;
        } else {
          return sum;
        }
        
        // Sum up quantities from items
        return sum + items.reduce((count, item) => {
          const quantity = typeof item === 'object' && item !== null && 'quantity' in item 
            ? Number(item.quantity) || 1 
            : 1;
          return count + quantity;
        }, 0);
      }, 0);
      
      // Calculate today's items sold
      const todayItemsSold = todayTransactions.reduce((sum, tx) => {
        if (!tx.items) return sum;
        
        let items: any[] = [];
        
        if (typeof tx.items === 'string') {
          try {
            items = JSON.parse(tx.items);
          } catch (e) {
            console.error('Failed to parse items:', e);
            return sum;
          }
        } else if (Array.isArray(tx.items)) {
          items = tx.items;
        } else {
          return sum;
        }
        
        return sum + items.reduce((count, item) => {
          const quantity = typeof item === 'object' && item !== null && 'quantity' in item 
            ? Number(item.quantity) || 1 
            : 1;
          return count + quantity;
        }, 0);
      }, 0);
      
      // Query for current period's new customers
      const { data: currentPeriodCustomers, error: customersError } = await supabase
        .from('customers')
        .select('id')
        .gte('created_at', currentPeriodStart.toISOString());
      
      if (customersError) throw customersError;
      
      // Query for previous period's new customers
      const { data: previousPeriodCustomers, error: previousCustomersError } = await supabase
        .from('customers')
        .select('id')
        .gte('created_at', previousPeriodStart.toISOString())
        .lt('created_at', previousPeriodEnd.toISOString());
      
      if (previousCustomersError) throw previousCustomersError;
      
      const newCustomersCount = currentPeriodCustomers.length;
      const previousPeriodNewCustomersCount = previousPeriodCustomers.length;
      
      const customersTrend = previousPeriodNewCustomersCount > 0 
        ? ((newCustomersCount - previousPeriodNewCustomersCount) / previousPeriodNewCustomersCount) * 100 
        : 0;
      
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
