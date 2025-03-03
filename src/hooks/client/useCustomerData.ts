
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Customer } from "@/types/index";

export const useCustomerData = (clientId: string | undefined) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [clientId]);

  const updateCustomer = async (values: Partial<Customer>) => {
    if (!clientId) return false;
    
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          ...values,
          updated_at: new Date().toISOString(),
        })
        .eq('id', clientId);
      
      if (error) throw error;
      
      setCustomer(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          ...values,
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

  return {
    customer,
    setCustomer,
    loading,
    updateCustomer
  };
};
