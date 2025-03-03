
// Shared types for inventory-related APIs - aligns with src/types/index.ts

// Category types
export interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Product types 
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

// Variant types
export interface ProductVariant {
  id: string;
  product_id: string;
  sku?: string | null;
  price: number;
  stock_count?: number | null;
  color?: string | null;
  size?: string | null;
  flavor?: string | null;
  variant_attributes: Record<string, any> | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// Variant type definition for UI components
export interface VariantType {
  name: string;
  values: string[];
}

// Variant combination for UI
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

// Hook return type
export interface UseProductVariantsReturn {
  variants: ProductVariant[];
  variantTypes: VariantType[];
  combinations: VariantCombination[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchVariants: () => Promise<void>;
  setVariantTypes: React.Dispatch<React.SetStateAction<VariantType[]>>;
  setCombinations: React.Dispatch<React.SetStateAction<VariantCombination[]>>;
  updateCombination: (index: number, updates: Partial<VariantCombination>) => void;
  deleteCombination: (index: number) => void;
  saveVariants: () => Promise<boolean>;
  generateCombinations: () => void;
}
