
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant, ProductFormState } from "@/types/inventory";

// Fetch all products with their variants
export const fetchProducts = async (): Promise<Product[]> => {
  // Fetch products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (productsError) throw productsError;
  
  // Fetch variants for all products
  const { data: variants, error: variantsError } = await supabase
    .from('product_variants')
    .select('*');
  
  if (variantsError) throw variantsError;
  
  // Group variants by product_id
  const variantsByProduct: Record<string, ProductVariant[]> = {};
  variants.forEach(variant => {
    if (!variantsByProduct[variant.product_id]) {
      variantsByProduct[variant.product_id] = [];
    }
    variantsByProduct[variant.product_id].push(variant);
  });
  
  // Add variants to their respective products
  return products.map(product => ({
    ...product,
    variants: variantsByProduct[product.id] || []
  })) as Product[];
};

// Fetch a single product with its variants
export const fetchProduct = async (id: string): Promise<Product> => {
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (productError) throw productError;
  
  const { data: variants, error: variantsError } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', id);
  
  if (variantsError) throw variantsError;
  
  return {
    ...product,
    variants: variants || []
  } as Product;
};

// Add a new product with variants
export const addProduct = async (productData: ProductFormState): Promise<string> => {
  // First, insert the product
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert([{
      name: productData.name,
      description: productData.description,
      price: productData.price,
      cost: productData.cost,
      category: productData.category,
      sku: productData.sku,
      barcode: productData.barcode,
      image_url: productData.image_url,
      // Set stock to 0 initially, it will be calculated from variants
      stock: 0
    }])
    .select('id')
    .single();
  
  if (productError) throw productError;
  
  // Then insert the variants if any
  if (productData.variants && productData.variants.length > 0) {
    const variantsToInsert = productData.variants.map(variant => ({
      product_id: product.id,
      sku: variant.sku,
      color: variant.color,
      size: variant.size,
      stock_count: variant.stock_count,
      price: variant.price
    }));
    
    const { error: variantsError } = await supabase
      .from('product_variants')
      .insert(variantsToInsert);
    
    if (variantsError) throw variantsError;
    
    // Update the product's stock count based on the sum of all variants
    const totalStock = productData.variants.reduce((sum, variant) => sum + variant.stock_count, 0);
    
    const { error: updateStockError } = await supabase
      .from('products')
      .update({ stock: totalStock })
      .eq('id', product.id);
    
    if (updateStockError) throw updateStockError;
  }
  
  return product.id;
};

// Update an existing product and its variants
export const updateProduct = async (id: string, productData: ProductFormState): Promise<void> => {
  // First, update the product
  const { error: productError } = await supabase
    .from('products')
    .update({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      cost: productData.cost,
      category: productData.category,
      sku: productData.sku,
      barcode: productData.barcode,
      image_url: productData.image_url,
    })
    .eq('id', id);
  
  if (productError) throw productError;
  
  // Get existing variants
  const { data: existingVariants, error: variantsError } = await supabase
    .from('product_variants')
    .select('id')
    .eq('product_id', id);
  
  if (variantsError) throw variantsError;
  
  // Create a map of existing variant IDs
  const existingVariantIds = new Set(existingVariants.map(v => v.id));
  
  // Identify which variants to update, which to insert, and which to delete
  const variantsToUpdate: ProductVariant[] = [];
  const variantsToInsert: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>[] = [];
  
  productData.variants.forEach(variant => {
    if (variant.id && existingVariantIds.has(variant.id)) {
      // This variant exists and needs to be updated
      variantsToUpdate.push({
        id: variant.id,
        product_id: id,
        sku: variant.sku,
        color: variant.color,
        size: variant.size,
        stock_count: variant.stock_count,
        price: variant.price
      } as ProductVariant);
      // Remove from the set as we've handled it
      existingVariantIds.delete(variant.id);
    } else {
      // This is a new variant that needs to be inserted
      variantsToInsert.push({
        product_id: id,
        sku: variant.sku,
        color: variant.color,
        size: variant.size,
        stock_count: variant.stock_count,
        price: variant.price
      });
    }
  });
  
  // Any IDs left in existingVariantIds need to be deleted
  if (existingVariantIds.size > 0) {
    const { error: deleteError } = await supabase
      .from('product_variants')
      .delete()
      .in('id', Array.from(existingVariantIds));
    
    if (deleteError) throw deleteError;
  }
  
  // Insert new variants
  if (variantsToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from('product_variants')
      .insert(variantsToInsert);
    
    if (insertError) throw insertError;
  }
  
  // Update existing variants
  for (const variant of variantsToUpdate) {
    const { error: updateError } = await supabase
      .from('product_variants')
      .update({
        sku: variant.sku,
        color: variant.color,
        size: variant.size,
        stock_count: variant.stock_count,
        price: variant.price
      })
      .eq('id', variant.id);
    
    if (updateError) throw updateError;
  }
  
  // Update the product's stock count based on the sum of all variants
  const totalStock = productData.variants.reduce((sum, variant) => sum + variant.stock_count, 0);
  
  const { error: updateStockError } = await supabase
    .from('products')
    .update({ stock: totalStock })
    .eq('id', id);
  
  if (updateStockError) throw updateStockError;
};

// Delete a product (and its variants via CASCADE)
export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Update stock for a specific variant
export const updateVariantStock = async (variantId: string, newStock: number): Promise<void> => {
  // Update the variant's stock count
  const { data: variant, error: variantError } = await supabase
    .from('product_variants')
    .update({ stock_count: newStock })
    .eq('id', variantId)
    .select('product_id')
    .single();
  
  if (variantError) throw variantError;
  
  // Get all variants for this product to recalculate total stock
  const { data: variants, error: variantsError } = await supabase
    .from('product_variants')
    .select('stock_count')
    .eq('product_id', variant.product_id);
  
  if (variantsError) throw variantsError;
  
  // Calculate new total stock
  const totalStock = variants.reduce((sum, v) => sum + (v.stock_count || 0), 0);
  
  // Update the product's stock count
  const { error: updateStockError } = await supabase
    .from('products')
    .update({ stock: totalStock })
    .eq('id', variant.product_id);
  
  if (updateStockError) throw updateStockError;
};

// Fetch products with low stock (for alerts)
export const fetchLowStockProducts = async (threshold: number = 5): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .lt('stock', threshold);
  
  if (error) throw error;
  return data as Product[];
};
