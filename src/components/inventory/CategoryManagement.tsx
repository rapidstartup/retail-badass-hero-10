
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCategories as getCategoriesAPI,
  createCategory as createCategoryAPI,
  ProductCategory
} from '@/api/categoryApi';
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
import { RefreshCw } from 'lucide-react';

interface CategoryForm {
  name: string;
  description: string;
}

const CategoryManagement: React.FC = () => {
  const [newCategory, setNewCategory] = useState<CategoryForm>({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories, isLoading: isCategoriesLoading, error, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesAPI,
  });

  const { mutate: createCategory } = useMutation({
    mutationFn: (category: { name: string; description?: string }) => {
      console.log("Creating category:", category);
      return createCategoryAPI({ 
        name: category.name, 
        description: category.description || null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
      setNewCategory({ name: '', description: '' });
      setIsLoading(false);
    },
    onError: (error: any) => {
      console.error("Error in create category mutation:", error);
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
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(`Failed to create category: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
        <h3 className="text-destructive font-semibold">Error loading categories</h3>
        <p className="text-sm text-destructive/80">{(error as Error).message}</p>
        <Button variant="outline" className="mt-2" onClick={handleRefresh}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <Button variant="outline" onClick={handleRefresh} disabled={isCategoriesLoading} className="flex items-center gap-1">
          <RefreshCw className={`h-4 w-4 ${isCategoriesLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

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
          {isCategoriesLoading ? (
            <div className="flex items-center justify-center h-40">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableCaption>A list of your categories.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                      No categories found. Create your first category above.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManagement;
