
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { calculateTierFromSpend, calculateSpendToNextTier } from "@/utils/tierCalculator";
import type { Customer } from "@/types/index";

interface ClientMetrics {
  avgTransaction: number;
  numTransactions: number;
  totalSpent: number;
  mostPurchased: string;
  currentTabBalance: number;
  spendToNextTier: number;
}

export const useClientMetrics = (clientId: string | undefined, customer: Customer | null) => {
  const [metrics, setMetrics] = useState<ClientMetrics>({
    avgTransaction: 0,
    numTransactions: 0,
    totalSpent: 0,
    mostPurchased: "None",
    currentTabBalance: 0,
    spendToNextTier: 0
  });

  useEffect(() => {
    const calculateClientMetrics = async () => {
      if (!clientId) return;
      
      try {
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
        console.error('Error calculating client metrics:', error);
      }
    };
    
    calculateClientMetrics();
  }, [clientId, customer]);
  
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
        
        toast.success(`Customer tier upgraded to ${calculatedTier}!`);
      } catch (error) {
        console.error('Error updating customer tier:', error);
      }
    }
  };

  return { metrics };
};

// We need to import toast at the top
import { toast } from "sonner";
