
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createProduct, updateProduct, fetchCategories } from '@/api/inventoryApi';
import { Product } from '@/types';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Form } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { 
  Package,
  Save, 
  X,
  Plus
} from 'lucide-react';
import ProductVariantsManager from './ProductVariantsManager';

// Import our new form section components
import BasicProductInfo from './product-form/BasicProductInfo';
import PricingInfo from './product-form/PricingInfo';
import InventoryDetails from './product-form/InventoryDetails';
import { ProductFormData } from './product-form/types';

interface ProductFormProps {
  product?: Product;
  productId?: string;
  onClose: () => void;
  onSave?: () => void;
  threeColumns?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  productId, 
  onClose, 
  onSave, 
  threeColumns = false 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string; }[]>([]);
  const [showVariantsManager, setShowVariantsManager] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  // Initialize form with useForm
  const form = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      cost: undefined,
      stock: undefined,
      sku: '',
      barcode: '',
      image_url: '',
      category: '',
      category_id: '',
      has_variants: false,
    }
  });

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategoriesData();
  }, []);

  useEffect(() => {
    if (product) {
      setIsEditing(true);
      setCurrentProduct(product);
      form.reset({
        name: product.name || '',
        description: product.description || '',
        price: product.price,
        cost: product.cost || undefined,
        stock: product.stock || undefined,
        sku: product.sku || '',
        barcode: product.barcode || '',
        image_url: product.image_url || '',
        category: product.category || '',
        category_id: product.category_id || '',
        has_variants: product.has_variants || false,
      });
    } else if (productId) {
      setIsEditing(true);
      const fetchProductDetails = async () => {
        try {
          const response = await fetch(`/api/products/${productId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const productData = await response.json();
          setCurrentProduct(productData);
          form.reset({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            cost: productData.cost,
            stock: productData.stock,
            sku: productData.sku,
            barcode: productData.barcode,
            image_url: productData.image_url,
            category: productData.category || '',
            category_id: productData.category_id,
            has_variants: productData.has_variants,
          });
        } catch (error) {
          console.error("Could not fetch product details", error);
          toast.error("Failed to load product details");
        }
      };

      fetchProductDetails();
    }
  }, [product, productId, form]);

  const onSubmit = async (data: ProductFormData) => {
    if (!data.name) {
      toast.error("Product name is required");
      return;
    }
  
    if (data.price === undefined || isNaN(Number(data.price))) {
      toast.error("Valid product price is required");
      return;
    }
  
    try {
      setIsSubmitting(true);
    
      const productData = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        cost: data.cost !== undefined ? Number(data.cost) : undefined,
        stock: data.stock !== undefined ? Number(data.stock) : undefined,
        sku: data.sku,
        barcode: data.barcode,
        image_url: data.image_url,
        category_id: data.category_id,
        category: data.category,
        has_variants: Boolean(data.has_variants)
      };
    
      let savedProduct: Product | null = null;
      
      if (isEditing && (productId || (product && product.id))) {
        savedProduct = await updateProduct(productId || (product?.id as string), productData);
        setCurrentProduct(savedProduct);
      } else {
        savedProduct = await createProduct(productData);
        setCurrentProduct(savedProduct);
        
        // If the product has variants, show the variants manager immediately
        if (data.has_variants && savedProduct) {
          setShowVariantsManager(true);
          return; // Don't close the form yet
        }
      }
    
      if (onSave) onSave();
      if (!data.has_variants) {
        onClose(); // Only close if it's not a variant product or if we're editing
      }
    
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVariantManagerClose = () => {
    setShowVariantsManager(false);
    if (onSave) onSave();
    onClose();
  };

  return (
    <>
      <Card className="w-full mx-auto shadow-lg border border-border/30 bg-card">
        <CardHeader className="bg-muted/30 rounded-t-lg border-b border-border/30">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
          </div>
          <CardDescription>
            {isEditing ? 'Update product information in your inventory' : 'Add a new product to your inventory'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className={`grid grid-cols-1 ${threeColumns ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                <BasicProductInfo form={form} />
                <PricingInfo form={form} />
                <InventoryDetails form={form} categories={categories} />
              </div>
              
              <CardFooter className="px-0 pb-0 pt-4 flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </Button>
                {isEditing && currentProduct && currentProduct.has_variants && (
                  <Button 
                    type="button" 
                    onClick={() => setShowVariantsManager(true)}
                    disabled={isSubmitting}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Manage Variants
                  </Button>
                )}
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>

      {showVariantsManager && currentProduct && (
        <ProductVariantsManager 
          product={currentProduct} 
          onClose={handleVariantManagerClose} 
        />
      )}
    </>
  );
};

export default ProductForm;
