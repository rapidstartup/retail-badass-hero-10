
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Transaction, TransactionItem } from "@/types/transaction";

interface PaginationState {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

export const useClientTransactions = (clientId: string | undefined) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 5,
    totalPages: 1,
    totalCount: 0
  });

  const fetchTransactionCount = async () => {
    if (!clientId) return 0;
    
    try {
      const { count, error } = await supabase
        .from('transactions')
        .select('id', { count: 'exact', head: true })
        .eq('customer_id', clientId);
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching transaction count:', error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!clientId) return;
      
      setLoading(true);
      try {
        const count = await fetchTransactionCount();
        const totalPages = Math.ceil(count / pagination.pageSize);
        
        const from = (pagination.page - 1) * pagination.pageSize;
        const to = from + pagination.pageSize - 1;
        
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('customer_id', clientId)
          .order('created_at', { ascending: false })
          .range(from, to);
        
        if (error) throw error;
        
        // Parse and convert transactions to the correct type
        const typedData = data?.map(transaction => {
          // Parse items based on their format (could be string, array, or JSON object)
          let parsedItems: TransactionItem[] = [];
          
          if (typeof transaction.items === 'string') {
            try {
              const parsed = JSON.parse(transaction.items);
              if (Array.isArray(parsed)) {
                parsedItems = parsed.map(item => {
                  // Safely access properties with type checking
                  const safeItem = typeof item === 'object' && item !== null ? item : {};
                  return {
                    id: safeItem.id?.toString() || `item-${Math.random().toString(36).substr(2, 9)}`,
                    name: safeItem.name?.toString() || 'Unknown Item',
                    price: typeof safeItem.price === 'number' ? safeItem.price : 
                           typeof safeItem.price === 'string' ? parseFloat(safeItem.price) : 0,
                    quantity: typeof safeItem.quantity === 'number' ? safeItem.quantity : 
                              typeof safeItem.quantity === 'string' ? parseInt(safeItem.quantity, 10) : 1,
                    subtotal: typeof safeItem.subtotal === 'number' ? safeItem.subtotal : 
                              typeof safeItem.subtotal === 'string' ? parseFloat(safeItem.subtotal) : 0,
                    product_id: safeItem.product_id?.toString(),
                    variant_id: safeItem.variant_id?.toString()
                  };
                });
              }
            } catch (e) {
              console.error('Failed to parse items JSON:', e);
            }
          } else if (Array.isArray(transaction.items)) {
            parsedItems = transaction.items.map(item => {
              // Safe type checking for array items
              if (typeof item !== 'object' || item === null) {
                return {
                  id: `item-${Math.random().toString(36).substr(2, 9)}`,
                  name: 'Unknown Item',
                  price: 0,
                  quantity: 1,
                  subtotal: 0
                };
              }
              
              // Now we can safely access properties
              const safeItem = item as Record<string, any>;
              return {
                id: safeItem.id?.toString() || `item-${Math.random().toString(36).substr(2, 9)}`,
                name: safeItem.name?.toString() || 'Unknown Item',
                price: typeof safeItem.price === 'number' ? safeItem.price : 
                       typeof safeItem.price === 'string' ? parseFloat(safeItem.price) : 0,
                quantity: typeof safeItem.quantity === 'number' ? safeItem.quantity : 
                          typeof safeItem.quantity === 'string' ? parseInt(safeItem.quantity, 10) : 1,
                subtotal: typeof safeItem.subtotal === 'number' ? safeItem.subtotal : 
                          typeof safeItem.subtotal === 'string' ? parseFloat(safeItem.subtotal) : 0,
                product_id: safeItem.product_id?.toString(),
                variant_id: safeItem.variant_id?.toString()
              };
            });
          }
          
          return {
            id: transaction.id,
            status: transaction.status as 'open' | 'completed' | 'refunded',
            total: transaction.total,
            subtotal: transaction.subtotal,
            tax: transaction.tax,
            payment_method: transaction.payment_method,
            created_at: transaction.created_at,
            completed_at: transaction.completed_at,
            items: parsedItems,
            customers: {
              id: clientId,
              // In real-world, we'd fetch these, but we know the client ID
              // which is enough for our current use case
            }
          } as Transaction;
        });
        
        setTransactions(typedData || []);
        
        setPagination(prev => ({
          ...prev,
          totalPages,
          totalCount: count
        }));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [clientId, pagination.page, pagination.pageSize]);

  const changePage = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const changePageSize = (newSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize: newSize,
      page: 1
    }));
  };

  return {
    transactions,
    transactionsLoading: loading,
    pagination,
    changePage,
    changePageSize
  };
};
