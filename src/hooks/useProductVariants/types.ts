
import { ProductVariant } from "@/api/types/inventoryTypes";

export interface VariantType {
  name: string;
  values: string[];
}

export interface VariantCombination {
  id?: string;
  product_id: string;
  sku: string;
  price: number;
  stock_count: number;
  color?: string;
  size?: string;
  flavor?: string;
  attributes: Record<string, string>;
}

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
