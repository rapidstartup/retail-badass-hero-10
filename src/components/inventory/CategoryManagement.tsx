
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCategories as getCategoriesAPI,
  createCategory as createCategoryAPI,
  Category
} from '@/api/category';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CategoryForm {
  name: string;
  description: string;
}

const CategoryManagement: React.FC = () => {
  const [newCategory, setNewCategory] = useState<CategoryForm>({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories, isLoading: isCategoriesLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesAPI,
  });

  const { mutate: createCategory } = useMutation({
    mutationFn: createCategoryAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
      setIsLoading(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to create category: ${error?.message || 'Unknown error'}`);
      setIsLoading(false);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory(prevCategory => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      toast.error("Category name is required");
      return;
    }
    
    try {
      setIsLoading(true);
      // Ensure we're passing an object with a required name property
      createCategory({
        name: newCategory.name,
        description: newCategory.description
      });
      
      // Reset form (the actual refresh will happen via the onSuccess callback)
      setNewCategory({ name: '', description: '' });
    } catch (error) {
      console.error("Error creating category:", error);
      setIsLoading(false);
    }
  };

  if (isCategoriesLoading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div>
      <h2>Category Management</h2>

      {/* Category Creation Form */}
      <div>
        <h3>Create New Category</h3>
        <Input
          type="text"
          name="name"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          name="description"
          placeholder="Description"
          value={newCategory.description}
          onChange={handleInputChange}
        />
        <Button disabled={isLoading} onClick={handleCreateCategory}>
          {isLoading ? 'Creating...' : 'Create Category'}
        </Button>
      </div>

      {/* Display Categories in a Table */}
      <div>
        <h3>Existing Categories</h3>
        <Table>
          <TableCaption>A list of your categories.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategoryManagement;
