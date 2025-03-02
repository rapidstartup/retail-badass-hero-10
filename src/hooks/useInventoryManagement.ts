
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Product, 
  ProductFormState,
  ProductVariantFormState
} from "@/types/inventory";
import { 
  fetchProducts,
  fetchProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchLowStockProducts
} from "@/api/inventoryApi";

export function useInventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Initialize empty form state
  const emptyVariant: ProductVariantFormState = {
    sku: '',
    color: '',
    size: '',
    stock_count: 0,
    price: 0
  };
  
  const emptyFormState: ProductFormState = {
    name: '',
    description: '',
    price: 0,
    cost: 0,
    category: '',
    sku: '',
    barcode: '',
    image_url: '',
    variants: [{ ...emptyVariant }]
  };
  
  const [formState, setFormState] = useState<ProductFormState>(emptyFormState);
  
  // Load products on initial render
  useEffect(() => {
    loadProducts();
    loadLowStockProducts();
  }, []);
  
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error: any) {
      toast.error(`Error fetching products: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const loadLowStockProducts = async (threshold = 5) => {
    try {
      const data = await fetchLowStockProducts(threshold);
      setLowStockProducts(data);
    } catch (error: any) {
      toast.error(`Error fetching low stock products: ${error.message}`);
    }
  };
  
  const loadProductDetails = async (id: string) => {
    try {
      const data = await fetchProduct(id);
      setSelectedProduct(data);
      return data;
    } catch (error: any) {
      toast.error(`Error fetching product details: ${error.message}`);
      return null;
    }
  };
  
  const startAddProduct = () => {
    setIsAdding(true);
    setIsEditing(null);
    setFormState(emptyFormState);
  };
  
  const startEditProduct = async (id: string) => {
    setIsAdding(false);
    setIsEditing(id);
    
    try {
      const product = await loadProductDetails(id);
      if (product) {
        // Convert product data to form state
        setFormState({
          name: product.name,
          description: product.description || '',
          price: product.price,
          cost: product.cost || 0,
          category: product.category || '',
          sku: product.sku || '',
          barcode: product.barcode || '',
          image_url: product.image_url || '',
          variants: product.variants?.map(v => ({
            id: v.id,
            sku: v.sku || '',
            color: v.color || '',
            size: v.size || '',
            stock_count: v.stock_count,
            price: v.price || 0
          })) || [{ ...emptyVariant }]
        });
      }
    } catch (error: any) {
      toast.error(`Error loading product for edit: ${error.message}`);
      resetForm();
    }
  };
  
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addProduct(formState);
      toast.success("Product added successfully");
      resetForm();
      loadProducts();
      loadLowStockProducts();
    } catch (error: any) {
      toast.error(`Error adding product: ${error.message}`);
    }
  };
  
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    
    try {
      await updateProduct(isEditing, formState);
      toast.success("Product updated successfully");
      resetForm();
      loadProducts();
      loadLowStockProducts();
    } catch (error: any) {
      toast.error(`Error updating product: ${error.message}`);
    }
  };
  
  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      loadProducts();
      loadLowStockProducts();
    } catch (error: any) {
      toast.error(`Error deleting product: ${error.message}`);
    }
  };
  
  const addVariantField = () => {
    setFormState(prev => ({
      ...prev,
      variants: [...prev.variants, { ...emptyVariant }]
    }));
  };
  
  const removeVariantField = (index: number) => {
    setFormState(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };
  
  const updateVariantField = (index: number, field: keyof ProductVariantFormState, value: string | number) => {
    setFormState(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value
      };
      return {
        ...prev,
        variants: updatedVariants
      };
    });
  };
  
  const resetForm = () => {
    setIsAdding(false);
    setIsEditing(null);
    setFormState(emptyFormState);
  };
  
  return {
    products,
    lowStockProducts,
    loading,
    selectedProduct,
    isAdding,
    isEditing,
    formState,
    setFormState,
    startAddProduct,
    startEditProduct,
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    addVariantField,
    removeVariantField,
    updateVariantField,
    resetForm,
    loadProductDetails
  };
}
