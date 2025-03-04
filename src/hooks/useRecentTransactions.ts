
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/transaction";

export const useRecentTransactions = (limit = 5) => {
  return useQuery({
    queryKey: ["recent-transactions", limit],
    queryFn: async () => {
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
          itemsCount = parsedItems.reduce((count, item) => count + (item.quantity || 1), 0);
        }
        
        // Extract customer name
        const customer = transaction.customers || {};
        const customerName = customer.first_name && customer.last_name 
          ? `${customer.first_name} ${customer.last_name}` 
          : 'Walk-in Customer';
        
        return {
          id: transaction.id,
          customer: customerName,
          amount: transaction.total || 0,
          items: itemsCount,
          date: new Date(transaction.created_at || new Date())
        };
      });
    }
  });
};
