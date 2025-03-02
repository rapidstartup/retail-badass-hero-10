
import { Dispatch, SetStateAction } from "react";
import { ProductVariant } from "@/api/types/inventoryTypes";

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

export interface ProductVariantState {
  variants: ProductVariant[];
  variantTypes: VariantType[];
  combinations: VariantCombination[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export interface UseProductVariantsReturn {
  variants: ProductVariant[];
  variantTypes: VariantType[];
  combinations: VariantCombination[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchVariants: () => Promise<void>;
  setVariantTypes: Dispatch<SetStateAction<VariantType[]>>;
  setCombinations: Dispatch<SetStateAction<VariantCombination[]>>;
  updateCombination: (index: number, updates: Partial<VariantCombination>) => void;
  deleteCombination: (index: number) => void;
  saveVariants: () => Promise<boolean>;
  generateCombinations: () => void;
}
