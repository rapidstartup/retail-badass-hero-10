
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
  flavor?: string; // Make sure flavor is included
  [key: string]: any;
}

export interface ProductVariantState {
  variants: any[];
  variantTypes: VariantType[];
  combinations: VariantCombination[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}
