
// This file re-exports all inventory-related APIs for backward compatibility
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Re-export types from types/index.ts
export type {
  Category,
  Product,
  ProductVariant,
  VariantType,
  VariantCombination
} from '@/types';

// Re-export types from types/inventoryTypes.ts
export type {
  ProductCategory
} from './types/inventoryTypes';

// Re-export category APIs
export {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from './categoryApi';

// Re-export product APIs
export {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustProductStock
} from './productApi';

// Re-export variant APIs
export {
  fetchVariantsByProductId,
  createVariant,
  updateVariant,
  deleteVariant,
  adjustVariantStock
} from './variantApi';
