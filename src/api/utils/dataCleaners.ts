
import { Product, ProductInsert, ProductUpdate } from "../types/productTypes";
import { ProductVariant, VariantInsert, VariantUpdate } from "../types/variantTypes";

// Utility function to clean product data before sending to Supabase
export const cleanProductData = (product: Partial<Product>): ProductInsert | ProductUpdate => {
  const cleanedData = { ...product } as ProductInsert | ProductUpdate;
  
  // Remove empty category_id to prevent UUID format error
  if (!cleanedData.category_id || cleanedData.category_id === "") {
    delete cleanedData.category_id;
  }
  
  // Remove any undefined fields
  Object.keys(cleanedData).forEach(key => {
    if (cleanedData[key as keyof typeof cleanedData] === undefined) {
      delete cleanedData[key as keyof typeof cleanedData];
    }
  });
  
  return cleanedData;
};

// Utility function to clean variant data before sending to Supabase
export const cleanVariantData = (variant: Partial<ProductVariant>): VariantInsert | VariantUpdate => {
  const cleanedData = { ...variant } as VariantInsert | VariantUpdate;
  
  // Handle null or empty string fields that should be null in the database
  ['color', 'size', 'flavor', 'sku'].forEach(field => {
    if (field in cleanedData && (cleanedData[field as keyof typeof cleanedData] === '' || cleanedData[field as keyof typeof cleanedData] === undefined)) {
      cleanedData[field as keyof typeof cleanedData] = null;
    }
  });
  
  // Make sure product_id is always included for inserts
  if ('id' in variant === false && (!cleanedData.product_id || cleanedData.product_id === '')) {
    throw new Error("Product ID is required for variants");
  }
  
  // Remove any undefined fields
  Object.keys(cleanedData).forEach(key => {
    if (cleanedData[key as keyof typeof cleanedData] === undefined) {
      delete cleanedData[key as keyof typeof cleanedData];
    }
  });
  
  return cleanedData;
};
