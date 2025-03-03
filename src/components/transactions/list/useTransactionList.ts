
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TransactionFilters } from "@/types/transaction";

export const useTransactionList = (status?: string, filters: TransactionFilters) => {
  return useQuery({
    queryKey: ['transactions', status, filters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          id,
          status,
          total,
          subtotal,
          tax,
          payment_method,
          created_at,
          completed_at,
          customers(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      // Apply status filter
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Apply date range filter
      if (filters.dateRange?.from) {
        const fromDate = new Date(filters.dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        query = query.gte('created_at', fromDate.toISOString());
      }
      
      if (filters.dateRange?.to) {
        const toDate = new Date(filters.dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        query = query.lte('created_at', toDate.toISOString());
      }

      // Apply payment method filter
      if (filters.paymentMethod) {
        query = query.eq('payment_method', filters.paymentMethod);
      }

      // Apply amount range filters
      if (filters.minimumAmount !== undefined) {
        query = query.gte('total', filters.minimumAmount);
      }
      
      if (filters.maximumAmount !== undefined) {
        query = query.lte('total', filters.maximumAmount);
      }

      // Apply search query (customer name or transaction ID)
      if (filters.searchQuery) {
        query = query.or(`id.ilike.%${filters.searchQuery}%,customers.first_name.ilike.%${filters.searchQuery}%,customers.last_name.ilike.%${filters.searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching transactions:", error);
        throw new Error(error.message);
      }
      
      return data || [];
    },
  });
};
