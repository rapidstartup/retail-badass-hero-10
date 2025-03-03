import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction, TransactionFilters } from '@/types/transaction';

export const useTransactionList = (filters: TransactionFilters) => {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          id,
          status,
          total,
          subtotal,
          tax,
          items,
          payment_method,
          created_at,
          completed_at,
          customers(id, first_name, last_name)
        `);

      // Apply filters
      if (filters.dateRange?.from) {
        query = query.gte('created_at', filters.dateRange.from.toISOString());
      }

      if (filters.dateRange?.to) {
        query = query.lte('created_at', filters.dateRange.to.toISOString());
      }

      if (filters.paymentMethod) {
        query = query.eq('payment_method', filters.paymentMethod);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.minimumAmount) {
        query = query.gte('total', filters.minimumAmount);
      }

      if (filters.maximumAmount) {
        query = query.lte('total', filters.maximumAmount);
      }

      if (filters.searchQuery) {
        query = query.or(`id.ilike.%${filters.searchQuery}%`);
      }

      // Add pagination
      const from = 0;
      const to = 19; // Get 20 results
      
      query = query.range(from, to).order('created_at', { ascending: false });
      
      const { data, error, count } = await query;
      
      if (error) throw error;

      // Parse items for each transaction
      const transactions: Transaction[] = data.map(transaction => {
        let parsedItems = [];
        
        // Handle different item formats
        if (typeof transaction.items === 'string') {
          try {
            parsedItems = JSON.parse(transaction.items);
          } catch (e) {
            console.error(`Failed to parse items for transaction ${transaction.id}:`, e);
          }
        } else if (Array.isArray(transaction.items)) {
          parsedItems = transaction.items;
        }
        
        return {
          ...transaction,
          status: transaction.status as 'open' | 'completed' | 'refunded',
          items: parsedItems
        };
      });

      return { 
        transactions,
        count: count || 0
      };
    }
  });
};
