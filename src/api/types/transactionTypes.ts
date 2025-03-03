
import { Json } from "@/integrations/supabase/types";

export interface Transaction {
  id: string;
  customer_id?: string | null;
  cashier_id?: string | null;
  subtotal: number;
  tax: number;
  total: number;
  items: any[];
  status: string;
  payment_method?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  completed_at?: string | null;
}

export interface RawTransaction {
  id: string;
  customer_id?: string | null;
  cashier_id?: string | null;
  subtotal: number;
  tax: number;
  total: number;
  items: Json;
  status: string;
  payment_method?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  completed_at?: string | null;
}

export interface CreateTransactionParams {
  customer_id?: string | null;
  cashier_id?: string | null;
  subtotal: number;
  tax: number;
  total: number;
  items: any[];
  status?: string;
  payment_method?: string | null;
}

export interface UpdateTransactionParams {
  customer_id?: string | null;
  items?: any[];
  subtotal?: number;
  tax?: number;
  total?: number;
  status?: string;
  payment_method?: string | null;
  completed_at?: string | null;
}
