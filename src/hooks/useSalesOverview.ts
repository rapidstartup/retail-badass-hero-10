
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSalesOverview = () => {
  return useQuery({
    queryKey: ["sales-overview"],
    queryFn: async () => {
      // Get the current month and year
      const now = new Date();
      
      // Initialize month data array (past 6 months)
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const salesData = [];
      
      // Generate the past 6 months (including current)
      for (let i = 5; i >= 0; i--) {
        const month = new Date(now);
        month.setMonth(now.getMonth() - i);
        
        const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
        const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);
        
        // Query transactions for this month
        const { data: transactions, error } = await supabase
          .from('transactions')
          .select('total')
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString())
          .eq('status', 'completed');
        
        if (error) {
          console.error('Error fetching month data:', error);
          continue;
        }
        
        // Calculate total sales for the month
        const monthTotal = transactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
        
        salesData.push({
          name: monthNames[month.getMonth()],
          total: monthTotal
        });
      }
      
      return salesData;
    }
  });
};
