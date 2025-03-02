
export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string | null;
  color: string | null;
  size: string | null;
  stock_count: number;
  price: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  cost: number | null;
  stock: number | null;
  barcode: string | null;
  sku: string | null;
  category: string | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
  variants?: ProductVariant[];
}

export interface ProductFormState {
  name: string;
  description: string;
  price: number;
  cost: number;
  category: string;
  sku: string;
  barcode: string;
  image_url: string;
  variants: ProductVariantFormState[];
}

export interface ProductVariantFormState {
  id?: string;
  sku: string;
  color: string;
  size: string;
  stock_count: number;
  price: number;
}

export type ProductCategory = {
  value: string;
  label: string;
};

export const DEFAULT_CATEGORIES: ProductCategory[] = [
  { value: 'clothing', label: 'Clothing' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'home', label: 'Home & Kitchen' },
  { value: 'beauty', label: 'Beauty & Personal Care' },
  { value: 'toys', label: 'Toys & Games' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'books', label: 'Books & Media' },
  { value: 'other', label: 'Other' }
];

export const DEFAULT_SIZES = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
  { value: '3xl', label: '3XL' }
];

export const DEFAULT_COLORS = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'orange', label: 'Orange' },
  { value: 'gray', label: 'Gray' }
];
