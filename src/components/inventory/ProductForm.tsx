import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createProduct, updateProduct, getCategories } from '@/api/inventory';

interface FormData {
  name: string;
  description: string;
  price: number | undefined;
  cost: number | undefined;
  stock: number | undefined;
  sku: string;
  barcode: string;
  image_url: string;
  category_id: string;
  has_variants: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  productId?: string;
  onSave: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: undefined,
    cost: undefined,
    stock: undefined,
    sku: '',
    barcode: '',
    image_url: '',
    category_id: '',
    has_variants: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategoriesData();
  }, []);

  useEffect(() => {
    if (productId) {
      setIsEditing(true);
      // Fetch product details and populate the form
      // This is a placeholder, replace with actual API call
      const fetchProductDetails = async () => {
        try {
          const response = await fetch(`/api/products/${productId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const productData = await response.json();
          setFormData({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            cost: productData.cost,
            stock: productData.stock,
            sku: productData.sku,
            barcode: productData.barcode,
            image_url: productData.image_url,
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
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : parseFloat(value),
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      category_id: e.target.value,
    }));
  };

  // Update the handleSubmit function to ensure required fields
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.name) {
      toast.error("Product name is required");
      return;
    }
  
    if (formData.price === undefined || isNaN(Number(formData.price))) {
      toast.error("Valid product price is required");
      return;
    }
  
    try {
      setIsSubmitting(true);
    
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        cost: Number(formData.cost),
        stock: Number(formData.stock),
        sku: formData.sku,
        barcode: formData.barcode,
        image_url: formData.image_url,
        category_id: formData.category_id,
        has_variants: Boolean(formData.has_variants),
        category: '' // Adding required field with empty string as placeholder
      };
    
      if (isEditing && productId) {
        await updateProduct(productId, productData);
      } else {
        await createProduct(productData);
      }
    
      if (onSave) onSave();
    
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          id="price"
          value={formData.price === undefined ? '' : formData.price}
          onChange={handleNumberChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Cost</label>
        <input
          type="number"
          name="cost"
          id="cost"
          value={formData.cost === undefined ? '' : formData.cost}
          onChange={handleNumberChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          name="stock"
          id="stock"
          value={formData.stock === undefined ? '' : formData.stock}
          onChange={handleNumberChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
        <input
          type="text"
          name="sku"
          id="sku"
          value={formData.sku}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">Barcode</label>
        <input
          type="text"
          name="barcode"
          id="barcode"
          value={formData.barcode}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          name="image_url"
          id="image_url"
          value={formData.image_url}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category_id"
          name="category_id"
          value={formData.category_id}
          onChange={handleCategoryChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <input
          id="has_variants"
          name="has_variants"
          type="checkbox"
          checked={formData.has_variants}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="has_variants" className="ml-2 block text-sm text-gray-900">
          Has Variants
        </label>
      </div>
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
