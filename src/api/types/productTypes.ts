
// Types for products

// Define proper types for products
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
  created_at?: string;
  updated_at?: string;
  product_categories?: { id: string; name: string } | null;
}

// ProductInsert with required fields still required
export type ProductInsert = {
  name: string; // Still required for inserts
  price: number; // Still required for inserts
  description?: string | null;
  cost?: number | null;
  stock?: number | null;
  sku?: string | null;
  barcode?: string | null;
  image_url?: string | null;
  category?: string | null;
  category_id?: string | null;
  has_variants?: boolean;
};

export type ProductUpdate = Partial<ProductInsert>;
