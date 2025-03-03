
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TransactionItem } from '@/types/transaction';

export const useTransactionDetail = (transactionId: string | null) => {
  return useQuery({
    queryKey: ['transaction-detail', transactionId],
    queryFn: async () => {
      if (!transactionId) return null;
      
      const { data, error } = await supabase
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
          customers(id, first_name, last_name, email, phone)
        `)
        .eq('id', transactionId)
        .single();
        
      if (error) throw error;
      
      // Ensure items is properly parsed as TransactionItem[]
      if (data && typeof data.items === 'string') {
        try {
          data.items = JSON.parse(data.items) as TransactionItem[];
        } catch (e) {
          console.error('Failed to parse transaction items:', e);
          data.items = [] as TransactionItem[];
        }
      } else if (data && !Array.isArray(data.items)) {
        data.items = [] as TransactionItem[];
      }
      
      return data;
    },
    enabled: !!transactionId
  });
};
