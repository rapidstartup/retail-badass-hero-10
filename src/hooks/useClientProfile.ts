import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateTierFromSpend, calculateSpendToNextTier } from "@/utils/tierCalculator";
import type { Customer, Transaction } from "@/types/index";

interface ClientMetrics {
  avgTransaction: number;
  numTransactions: number;
  totalSpent: number;
  mostPurchased: string;
  currentTabBalance: number;
  spendToNextTier: number;
}

interface PaginationState {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

export const useClientProfile = (clientId: string | undefined) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<ClientMetrics>({
    avgTransaction: 0,
    numTransactions: 0,
    totalSpent: 0,
    mostPurchased: "None",
    currentTabBalance: 0,
    spendToNextTier: 0
  });
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
    const fetchCustomer = async () => {
      if (!clientId) return;
      
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', clientId)
          .single();
        
        if (error) throw error;
        setCustomer(data);
      } catch (error) {
        console.error('Error fetching customer:', error);
      }
    };

    fetchCustomer();
  }, [clientId]);

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
        setTransactions(data || []);
        
        setPagination(prev => ({
          ...prev,
          totalPages,
          totalCount: count
        }));
        
        const { data: allTransactionsData } = await supabase
          .from('transactions')
          .select('total, status')
          .eq('customer_id', clientId);
          
        if (allTransactionsData && allTransactionsData.length > 0) {
          const totalSpent = allTransactionsData.reduce((sum, tx) => sum + (tx.total || 0), 0);
          const avgTransaction = totalSpent / allTransactionsData.length;
          const openTabs = allTransactionsData.filter(tx => tx.status === 'open');
          const tabBalance = openTabs.reduce((sum, tx) => sum + (tx.total || 0), 0);
          const spendToNextTier = calculateSpendToNextTier(totalSpent);
          
          setMetrics({
            avgTransaction,
            numTransactions: allTransactionsData.length,
            totalSpent,
            mostPurchased: "Coffee",
            currentTabBalance: tabBalance,
            spendToNextTier
          });
          
          updateCustomerTier(totalSpent);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [clientId, pagination.page, pagination.pageSize]);
  
  const updateCustomerTier = async (totalSpent: number) => {
    if (!customer || !clientId) return;
    
    const calculatedTier = calculateTierFromSpend(totalSpent);
    
    const tierRanking = { "Bronze": 1, "Silver": 2, "Gold": 3 };
    const currentTierRank = tierRanking[customer.tier as keyof typeof tierRanking] || 1;
    const calculatedTierRank = tierRanking[calculatedTier as keyof typeof tierRanking];
    
    if (calculatedTierRank > currentTierRank) {
      try {
        const { error } = await supabase
          .from('customers')
          .update({
            tier: calculatedTier,
            total_spend: totalSpent,
            updated_at: new Date().toISOString(),
          })
          .eq('id', clientId);
        
        if (error) throw error;
        
        setCustomer(prev => {
          if (!prev) return null;
          return { ...prev, tier: calculatedTier, total_spend: totalSpent };
        });
        
        toast.success(`Customer tier upgraded to ${calculatedTier}!`);
      } catch (error) {
        console.error('Error updating customer tier:', error);
      }
    }
  };

  const updateCustomer = async (values: Partial<Customer>) => {
    if (!clientId) return false;
    
    try {
      const totalSpend = customer?.total_spend || 0;
      
      const calculatedTier = calculateTierFromSpend(totalSpend);
      
      const tierRanking = { "Bronze": 1, "Silver": 2, "Gold": 3 };
      const formTierRank = tierRanking[values.tier as keyof typeof tierRanking] || 1;
      const calculatedTierRank = tierRanking[calculatedTier as keyof typeof tierRanking];
      const finalTier = formTierRank >= calculatedTierRank ? values.tier : calculatedTier;
      
      const { error } = await supabase
        .from('customers')
        .update({
          ...values,
          tier: finalTier,
          updated_at: new Date().toISOString(),
        })
        .eq('id', clientId);
      
      if (error) throw error;
      
      setCustomer(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          ...values, 
          tier: finalTier,
          updated_at: new Date().toISOString() 
        };
      });
      
      toast.success("Client updated successfully");
      return true;
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error("Failed to update client");
      return false;
    }
  };

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
    customer,
    transactions,
    loading,
    metrics,
    updateCustomer,
    pagination,
    changePage,
    changePageSize
  };
};
