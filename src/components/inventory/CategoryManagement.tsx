
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCategories as getCategoriesAPI,
  createCategory as createCategoryAPI,
  updateCategory as updateCategoryAPI,
  deleteCategory as deleteCategoryAPI
} from '@/api/categoryApi';
import { Category } from '@/types';
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
import { RefreshCw, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CategoryForm {
  name: string;
  description: string;
}

const CategoryManagement: React.FC = () => {
  const [newCategory, setNewCategory] = useState<CategoryForm>({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
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

  const { mutate: updateCategory } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => {
      console.log("Updating category:", id, data);
      return updateCategoryAPI(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully!');
      setEditingCategory(null);
      setIsLoading(false);
    },
    onError: (error: any) => {
      console.error("Error in update category mutation:", error);
      toast.error(`Failed to update category: ${error?.message || 'Unknown error'}`);
      setIsLoading(false);
    }
  });

  const { mutate: deleteCategory } = useMutation({
    mutationFn: (id: string) => {
      console.log("Deleting category:", id);
      return deleteCategoryAPI(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully!');
    },
    onError: (error: any) => {
      console.error("Error in delete category mutation:", error);
      toast.error(`Failed to delete category: ${error?.message || 'Unknown error'}`);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        [name]: value,
      });
    } else {
      setNewCategory(prevCategory => ({
        ...prevCategory,
        [name]: value,
      }));
    }
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

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name) {
      toast.error("Category name is required");
      return;
    }
    
    try {
      setIsLoading(true);
      updateCategory({
        id: editingCategory.id,
        data: {
          name: editingCategory.name,
          description: editingCategory.description
        }
      });
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(`Failed to update category: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
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

      {/* Category Creation/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Category Name</label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Category Name"
              value={editingCategory ? editingCategory.name : newCategory.name}
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
              value={editingCategory ? editingCategory.description || '' : newCategory.description}
              onChange={handleInputChange}
              className="w-full min-h-[100px]"
            />
          </div>
          
          <div className="pt-2 flex justify-end gap-2">
            {editingCategory ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={cancelEditing}
                >
                  Cancel
                </Button>
                <Button 
                  disabled={isLoading} 
                  onClick={handleUpdateCategory}
                >
                  {isLoading ? 'Updating...' : 'Update Category'}
                </Button>
              </>
            ) : (
              <Button 
                disabled={isLoading} 
                onClick={handleCreateCategory}
              >
                {isLoading ? 'Creating...' : 'Create Category'}
              </Button>
            )}
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
              <TableCaption>A list of your product categories.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="outline" onClick={() => startEditing(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="outline">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the category "{category.name}"? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
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
