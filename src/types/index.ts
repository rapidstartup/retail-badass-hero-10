
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
  description: string | null;
  price: number;
  cost: number | null;
  stock: number | null;
  sku: string | null;
  barcode: string | null;
  image_url: string | null;
  category: string | null;
  category_id: string | null;
  has_variants: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string | null;
  price: number;
  stock_count: number | null;
  color: string | null;
  size: string | null;
  flavor: string | null;
  variant_attributes: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
}

// Add variant type definitions for UI components
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
