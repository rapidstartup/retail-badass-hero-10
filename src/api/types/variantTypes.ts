
// Types for product variants

// Define proper types for product variants
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
  created_at?: string;
  updated_at?: string;
}

// VariantInsert with required fields still required
export type VariantInsert = {
  product_id: string; // Required for inserts
  price: number;
  sku?: string | null;
  stock_count?: number | null;
  color?: string | null;
  size?: string | null;
  flavor?: string | null;
  variant_attributes?: Record<string, any>;
};

export type VariantUpdate = Partial<VariantInsert>;
