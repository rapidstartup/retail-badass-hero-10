
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { 
  Package,
  Save, 
  X,
  DollarSign, 
  Barcode, 
  ImageIcon, 
  Layers,
  ShoppingCart
} from 'lucide-react';

interface FormData {
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

interface ProductFormProps {
  product?: Product;
  productId?: string;
  onClose: () => void;
  onSave?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, productId, onClose, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string; }[]>([]);

  // Initialize form with useForm
  const form = useForm<FormData>({
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

  const onSubmit = async (data: FormData) => {
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
        cost: Number(data.cost),
        stock: Number(data.stock),
        sku: data.sku,
        barcode: data.barcode,
        image_url: data.image_url,
        category_id: data.category_id,
        category: data.category,
        has_variants: Boolean(data.has_variants)
      };
    
      if (isEditing && (productId || (product && product.id))) {
        await updateProduct(productId || (product?.id as string), productData);
      } else {
        await createProduct(productData);
      }
    
      if (onSave) onSave();
      onClose();
    
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mt-6 shadow-lg border border-border/30 bg-card">
      <CardHeader className="bg-muted/30 rounded-t-lg border-b border-border/30">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
        </div>
        <CardDescription>
          {isEditing ? 'Update product information in your inventory' : 'Add a new product to your inventory'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-10"
                            value={field.value === undefined ? '' : field.value}
                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-10"
                            value={field.value === undefined ? '' : field.value}
                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ShoppingCart className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="0"
                            className="pl-10"
                            value={field.value === undefined ? '' : field.value}
                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Barcode className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Enter SKU" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter barcode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Image URL" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selectedCategory = categories.find(cat => cat.id === value);
                          if (selectedCategory) {
                            form.setValue('category', selectedCategory.name);
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter product description" 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_variants"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Has Variants
                    </FormLabel>
                    <FormDescription>
                      Enable if this product has multiple variants (e.g., sizes, colors)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
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
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
