
import { Product, ProductVariant } from "@/types";

export interface VariantCombination {
  id?: string;
  attributes: Record<string, string>;
  sku: string;
  price: number;
  stock_count: number;
  product_id: string;
}

export interface UseProductVariantsReturn {
  variants: ProductVariant[];
  variantTypes: Map<string, string[]>;
  combinations: VariantCombination[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchVariants: () => Promise<void>;
  setVariantTypes: React.Dispatch<React.SetStateAction<Map<string, string[]>>>;
  setCombinations: React.Dispatch<React.SetStateAction<VariantCombination[]>>;
  updateCombination: (index: number, updates: Partial<VariantCombination>) => void;
  deleteCombination: (index: number) => void;
  saveVariants: () => Promise<boolean>;
  generateCombinations: () => void;
}
