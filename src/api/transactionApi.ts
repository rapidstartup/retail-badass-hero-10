
import { supabase } from "@/integrations/supabase/client";

// Add the missing export for fetchTransactionsByCustomer
export const fetchTransactionsByCustomer = async (customerId: string) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('customer_id', customerId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching transactions for customer ${customerId}:`, error);
    return [];
  }
};

// Export the Transaction type
export interface Transaction {
  id: string;
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  payment_method: string | null;
  cashier_id: string | null;
  customer_id: string | null;
  created_at: string;
  completed_at: string | null;
  updated_at: string | null;
}
