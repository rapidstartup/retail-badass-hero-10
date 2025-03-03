
import { useState } from "react";
import { useCustomerData } from "./client/useCustomerData";
import { useClientTransactions } from "./client/useClientTransactions";
import { useClientMetrics } from "./client/useClientMetrics";
import { calculateTierFromSpend } from "@/utils/tierCalculator";
import type { Customer } from "@/types/index";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useClientProfile = (clientId: string | undefined) => {
  const [isSaving, setIsSaving] = useState(false);
  
  // Use our specialized hooks
  const { customer, loading, setCustomer } = useCustomerData(clientId);
  const { 
    transactions, 
    transactionsLoading, 
    pagination, 
    changePage, 
    changePageSize 
  } = useClientTransactions(clientId);
  const { metrics } = useClientMetrics(clientId, customer);

  // Update customer with tier validation logic
  const updateCustomer = async (values: Partial<Customer>) => {
    if (!clientId) return false;
    
    setIsSaving(true);
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
    } finally {
      setIsSaving(false);
    }
  };

  return {
    customer,
    transactions,
    loading: loading || transactionsLoading,
    metrics,
    updateCustomer,
    pagination,
    changePage,
    changePageSize,
    isSaving
  };
};
