
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Transaction } from "@/types/transaction";

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
        
        // Convert string status to the correct type
        const typedData = data?.map(transaction => ({
          ...transaction,
          status: transaction.status as 'open' | 'completed' | 'refunded',
          items: transaction.items || []
        })) as Transaction[];
        
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
