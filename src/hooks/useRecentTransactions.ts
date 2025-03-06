
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/transaction";
import { PeriodType } from "@/hooks/dashboard/types";
import { calculatePeriodRanges } from "@/hooks/dashboard";

export const useRecentTransactions = (limit = 5, periodType: PeriodType = 'week') => {
  return useQuery({
    queryKey: ["recent-transactions", limit, periodType],
    queryFn: async () => {
      // Get date range for the selected period
      const { currentPeriodStart } = calculatePeriodRanges(periodType);
      
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
          id,
          total,
          created_at,
          items,
          status,
          customer_id,
          customers(id, first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .eq('status', 'completed')
        .gte('created_at', currentPeriodStart.toISOString())
        .limit(limit);
      
      if (error) throw error;
      
      return transactions.map(transaction => {
        let parsedItems = [];
        let itemsCount = 0;
        
        // Parse items
        if (typeof transaction.items === 'string') {
          try {
            parsedItems = JSON.parse(transaction.items);
            itemsCount = parsedItems.length;
          } catch (e) {
            console.error(`Failed to parse items for transaction ${transaction.id}:`, e);
          }
        } else if (Array.isArray(transaction.items)) {
          parsedItems = transaction.items;
          itemsCount = parsedItems.reduce((count, item) => {
            const quantity = typeof item === 'object' && item !== null && 'quantity' in item 
              ? Number(item.quantity) || 1 
              : 1;
            return count + quantity;
          }, 0);
        }
        
        // Extract customer name safely
        let customerName = 'Walk-in Customer';
        
        if (transaction.customers) {
          const customer = transaction.customers as Record<string, any>;
          if (customer && typeof customer === 'object' && 'first_name' in customer && 'last_name' in customer) {
            customerName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim();
            if (!customerName) {
              customerName = 'Walk-in Customer';
            }
          }
        }
        
        let date;
        try {
          date = new Date(transaction.created_at);
          // Validate the date
          if (isNaN(date.getTime())) {
            // If date is invalid, use current date as fallback
            date = new Date();
          }
        } catch (error) {
          console.error(`Error parsing date for transaction ${transaction.id}:`, error);
          // Use current date as fallback
          date = new Date();
        }
        
        return {
          id: transaction.id,
          customer: customerName,
          amount: transaction.total || 0,
          items: itemsCount,
          date: date
        };
      });
    }
  });
};
