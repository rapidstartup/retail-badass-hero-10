
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createProduct, updateProduct, fetchProductById } from '@/api/productApi';
import { fetchCategories } from '@/api/inventoryApi';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from "@/components/ui/form";
import { useForm } from 'react-hook-form';

// Import our new form section components
import BasicProductInfo from './product-form/BasicProductInfo';
import PricingInfo from './product-form/PricingInfo';
import InventoryDetails from './product-form/InventoryDetails';
import FormHeader from './product-form/FormHeader';
import FormFooter from './product-form/FormFooter';
import VariantManagerModal from './product-form/VariantManagerModal';
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
          const productData = await fetchProductById(productId);
          if (productData) {
            setCurrentProduct(productData);
            form.reset({
              name: productData.name,
              description: productData.description || '',
              price: productData.price,
              cost: productData.cost || undefined,
              stock: productData.stock || undefined,
              sku: productData.sku || '',
              barcode: productData.barcode || '',
              image_url: productData.image_url || '',
              category: productData.category || '',
              category_id: productData.category_id || '',
              has_variants: productData.has_variants || false,
            });
          } else {
            throw new Error("Product not found");
          }
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
        <FormHeader isEditing={isEditing} />
        
        <CardContent className="p-4 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className={`grid grid-cols-1 ${threeColumns ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                <BasicProductInfo form={form} />
                <PricingInfo form={form} />
                <InventoryDetails form={form} categories={categories} />
              </div>
              
              <FormFooter 
                isSubmitting={isSubmitting}
                isEditing={isEditing}
                hasVariants={currentProduct?.has_variants || false}
                onClose={onClose}
                onManageVariants={() => setShowVariantsManager(true)}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      <VariantManagerModal 
        product={currentProduct}
        showVariantsManager={showVariantsManager}
        onClose={handleVariantManagerClose}
      />
    </>
  );
};

export default ProductForm;
