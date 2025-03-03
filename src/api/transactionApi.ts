
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Transaction, 
  RawTransaction,
  CreateTransactionParams, 
  UpdateTransactionParams 
} from "./types/transactionTypes";

// Helper function to transform raw transaction from DB to Transaction type
const transformTransaction = (rawTx: RawTransaction): Transaction => {
  return {
    ...rawTx,
    items: Array.isArray(rawTx.items) ? rawTx.items : JSON.parse(rawTx.items as string)
  };
};

export const createTransaction = async (params: CreateTransactionParams): Promise<Transaction | null> => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert([{
        customer_id: params.customer_id || null,
        cashier_id: params.cashier_id || null,
        subtotal: params.subtotal,
        tax: params.tax,
        total: params.total,
        items: params.items,
        status: params.status || "open",
        payment_method: params.payment_method || null
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return transformTransaction(data as RawTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    toast.error("Failed to create transaction");
    return null;
  }
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data as RawTransaction[]).map(transformTransaction);
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

    return transformTransaction(data as RawTransaction);
  } catch (error) {
    console.error(`Error fetching transaction ${id}:`, error);
    toast.error("Failed to fetch transaction");
    return null;
  }
};

export const fetchOpenTabs = async (): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("status", "open")
      .eq("payment_method", "tab")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data as RawTransaction[]).map(transformTransaction);
  } catch (error) {
    console.error("Error fetching open tabs:", error);
    toast.error("Failed to fetch open tabs");
    return [];
  }
};

export const updateTransaction = async (id: string, updates: UpdateTransactionParams): Promise<Transaction | null> => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .update({
        customer_id: updates.customer_id,
        items: updates.items,
        subtotal: updates.subtotal,
        tax: updates.tax,
        total: updates.total,
        status: updates.status,
        payment_method: updates.payment_method,
        completed_at: updates.completed_at
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return transformTransaction(data as RawTransaction);
  } catch (error) {
    console.error(`Error updating transaction ${id}:`, error);
    toast.error("Failed to update transaction");
    return null;
  }
};
