
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
      return data;
    },
    enabled: !!transactionId
  });
};
