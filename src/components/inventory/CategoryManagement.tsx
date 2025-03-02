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
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      createCategory({
        name: newCategory.name,
        description: newCategory.description
      });
      
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
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Category Management</h2>

      {/* Category Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Category Name</label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              id="description"
              name="description"
              placeholder="Description"
              value={newCategory.description}
              onChange={handleInputChange}
              className="w-full min-h-[100px]"
            />
          </div>
          
          <div className="pt-2">
            <Button 
              disabled={isLoading} 
              onClick={handleCreateCategory} 
              className="inline-flex items-center justify-center w-full md:w-auto mr-4 theme-accent-bg hover:opacity-90"
            >
              {isLoading ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display Categories in a Table */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Categories</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManagement;
