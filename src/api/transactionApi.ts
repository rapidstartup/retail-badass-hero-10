
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  customer_id: string | null;
  cashier_id: string | null;
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'open' | 'completed' | 'refunded';
  payment_method: string | null;
  created_at: string | null;
  updated_at: string | null;
  completed_at: string | null;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  customerId?: string;
  paymentMethod?: string;
  cashierId?: string;
  minAmount?: number;
  maxAmount?: number;
}

export const fetchTransactions = async (filters?: TransactionFilters): Promise<Transaction[]> => {
  try {
    let query = supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });
    
    // Apply filters if provided
    if (filters) {
      if (filters.startDate) {
        query = query.gte("created_at", filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.lte("created_at", filters.endDate);
      }
      
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      
      if (filters.customerId) {
        query = query.eq("customer_id", filters.customerId);
      }
      
      if (filters.paymentMethod) {
        query = query.eq("payment_method", filters.paymentMethod);
      }
      
      if (filters.cashierId) {
        query = query.eq("cashier_id", filters.cashierId);
      }
      
      if (filters.minAmount) {
        query = query.gte("total", filters.minAmount);
      }
      
      if (filters.maxAmount) {
        query = query.lte("total", filters.maxAmount);
      }
    }
    
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    toast.error("Failed to fetch transactions");
    return [];
  }
};

export const fetchTransactionById = async (id: string): Promise<Transaction | null> => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching transaction with id ${id}:`, error);
    toast.error("Failed to fetch transaction details");
    return null;
  }
};

export const fetchCustomerTransactions = async (customerId: string): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error(`Error fetching transactions for customer ${customerId}:`, error);
    toast.error("Failed to fetch customer transactions");
    return [];
  }
};

export const createTransaction = async (transaction: Omit<Transaction, "id" | "created_at" | "updated_at">): Promise<Transaction | null> => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert([transaction])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    toast.error("Failed to create transaction");
    return null;
  }
};

export const updateTransactionStatus = async (id: string, status: 'open' | 'completed' | 'refunded'): Promise<Transaction | null> => {
  try {
    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    };
    
    // If completing the transaction, add completed_at timestamp
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from("transactions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error updating transaction status for ${id}:`, error);
    toast.error("Failed to update transaction status");
    return null;
  }
};
