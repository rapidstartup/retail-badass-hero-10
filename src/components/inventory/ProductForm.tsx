
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import VariantField from "./VariantField";
import { ProductFormState, DEFAULT_CATEGORIES } from "@/types/inventory";

interface ProductFormProps {
  formState: ProductFormState;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  setFormState: (state: ProductFormState) => void;
  addVariantField: () => void;
  removeVariantField: (index: number) => void;
  updateVariantField: (index: number, field: string, value: string | number) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  formState,
  isEditing,
  onSubmit,
  onCancel,
  setFormState,
  addVariantField,
  removeVariantField,
  updateVariantField
}) => {
  const handleChange = (field: keyof ProductFormState, value: string | number) => {
    setFormState({
      ...formState,
      [field]: value
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formState.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Product Name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formState.category}
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formState.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Product description"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Base Price</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formState.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cost">Cost</Label>
          <Input
            id="cost"
            type="number"
            min="0"
            step="0.01"
            value={formState.cost}
            onChange={(e) => handleChange('cost', parseFloat(e.target.value))}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="sku">Main SKU</Label>
          <Input
            id="sku"
            value={formState.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            placeholder="SKU-001"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="barcode">Barcode</Label>
          <Input
            id="barcode"
            value={formState.barcode}
            onChange={(e) => handleChange('barcode', e.target.value)}
            placeholder="123456789012"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          value={formState.image_url}
          onChange={(e) => handleChange('image_url', e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Product Variants</h3>
          <Button 
            type="button" 
            variant="outline" 
            onClick={addVariantField}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" /> Add Variant
          </Button>
        </div>
        
        <div className="space-y-4">
          {formState.variants.map((variant, index) => (
            <VariantField
              key={index}
              index={index}
              sku={variant.sku}
              color={variant.color}
              size={variant.size}
              stock={variant.stock_count}
              price={variant.price}
              onUpdate={updateVariantField}
              onRemove={removeVariantField}
              canRemove={formState.variants.length > 1}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
