
export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string | null; 
  updated_at: string | null; 
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  cost?: number | null;
  stock?: number | null;
  sku?: string | null;
  barcode?: string | null;
  image_url?: string | null;
  category?: string | null;
  category_id?: string | null;
  has_variants?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku?: string | null;
  price: number;
  stock_count?: number | null;
  color?: string | null;
  size?: string | null;
  flavor?: string | null;
  variant_attributes: Record<string, any>;
  created_at?: string | null;
  updated_at?: string | null;
}

// Variant type definitions for UI components
export interface VariantType {
  name: string;
  values: string[];
}

export interface VariantCombination {
  id?: string;
  sku: string;
  price: number;
  stock_count: number;
  color?: string;
  size?: string;
  flavor?: string;
  product_id: string;
  attributes: Record<string, string>;
}

export interface Transaction {
  id: string;
  customer_id?: string | null;
  cashier_id?: string | null;
  subtotal: number;
  tax: number;
  total: number;
  items: any;
  status: string;
  payment_method?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  completed_at?: string | null;
  amount?: number; // Added for compatibility with CustomerTransactionList
  date?: string; // Added for compatibility with CustomerTransactionList
}

export type { Customer, GiftCard } from './database.types';
