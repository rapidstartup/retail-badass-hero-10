
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction, TransactionItem } from '@/types/transaction';

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
      
      // Parse items from JSON if needed
      let parsedItems: TransactionItem[] = [];
      
      if (data) {
        // Handle various item formats
        if (typeof data.items === 'string') {
          try {
            parsedItems = JSON.parse(data.items);
          } catch (e) {
            console.error('Failed to parse transaction items:', e);
          }
        } else if (Array.isArray(data.items)) {
          parsedItems = data.items.map((item: any) => ({
            id: item.id || '',
            name: item.name || '',
            price: item.price || 0,
            quantity: item.quantity || 0,
            subtotal: item.subtotal || 0,
            product_id: item.product_id,
            variant_id: item.variant_id
          }));
        }
        
        // Create a properly typed transaction object
        const transaction: Transaction = {
          id: data.id,
          status: data.status as 'open' | 'completed' | 'refunded',
          total: data.total,
          subtotal: data.subtotal,
          tax: data.tax,
          payment_method: data.payment_method,
          created_at: data.created_at,
          completed_at: data.completed_at,
          customers: data.customers,
          items: parsedItems
        };
        
        return transaction;
      }
      
      return null;
    },
    enabled: !!transactionId
  });
};
