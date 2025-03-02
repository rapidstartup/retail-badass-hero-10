
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertCircle, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import { useInventoryManagement } from "@/hooks/useInventoryManagement";
import { Product } from "@/types/inventory";

const InventoryManagement: React.FC = () => {
  const {
    products,
    lowStockProducts,
    loading,
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
    resetForm
  } = useInventoryManagement();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const confirmDelete = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const executeDelete = () => {
    if (productToDelete) {
      handleDeleteProduct(productToDelete.id);
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
        <Button onClick={startAddProduct} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {lowStockProducts.length > 0 && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Low Stock Alert</AlertTitle>
          <AlertDescription>
            {lowStockProducts.length} products are running low on stock and need attention.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all-products">
        <TabsList>
          <TabsTrigger value="all-products">All Products</TabsTrigger>
          <TabsTrigger value="low-stock">
            Low Stock
            {lowStockProducts.length > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {lowStockProducts.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-products" className="mt-6">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading products...</p>
            </div>
          ) : (
            <ProductList
              products={products}
              onEdit={(id) => startEditProduct(id)}
              onDelete={(id) => {
                const product = products.find(p => p.id === id);
                if (product) confirmDelete(product);
              }}
            />
          )}
        </TabsContent>
        
        <TabsContent value="low-stock" className="mt-6">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading products...</p>
            </div>
          ) : lowStockProducts.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">No Low Stock Products</p>
              <p className="text-muted-foreground">
                All your products have adequate stock levels.
              </p>
            </div>
          ) : (
            <ProductList
              products={lowStockProducts}
              onEdit={(id) => startEditProduct(id)}
              onDelete={(id) => {
                const product = products.find(p => p.id === id);
                if (product) confirmDelete(product);
              }}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Product Form Modal */}
      <Dialog
        open={isAdding || isEditing !== null}
        onOpenChange={(open) => {
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Make changes to the product and its variants.'
                : 'Add a new product with variants to your inventory.'}
            </DialogDescription>
          </DialogHeader>
          
          <ProductForm
            formState={formState}
            isEditing={isEditing !== null}
            onSubmit={isEditing ? handleUpdateProduct : handleAddProduct}
            onCancel={resetForm}
            setFormState={setFormState}
            addVariantField={addVariantField}
            removeVariantField={removeVariantField}
            updateVariantField={updateVariantField}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={executeDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManagement;
