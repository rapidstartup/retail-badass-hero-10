
export interface ProductFormData {
  name: string;
  description: string;
  price: number | undefined;
  cost: number | undefined;
  stock: number | undefined;
  sku: string;
  barcode: string;
  image_url: string;
  category: string;
  category_id: string;
  has_variants: boolean;
}
