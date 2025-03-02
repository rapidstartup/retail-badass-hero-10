
import React, { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, FileEdit, Trash2, RefreshCw, Search, Package, Eye } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductForm from "./ProductForm";
import ProductVariantsManager from "./ProductVariantsManager";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteProduct } from "@/api/inventoryApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ProductManagement = () => {
  const {
    products,
    loading,
    refreshProducts,
    selectedProduct,
    setSelectedProduct
  } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showVariantsManager, setShowVariantsManager] = useState(false);

  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode && product.barcode.toLowerCase().includes(searchTerm.toLowerCase()) || product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowAddForm(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setShowEditForm(true);
  };

  const handleManageVariants = (product: any) => {
    setSelectedProduct(product);
    setShowVariantsManager(true);
  };

  const handleDeleteProduct = async (id: string) => {
    const success = await deleteProduct(id);
    if (success) {
      refreshProducts();
    }
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedProduct(null);
    refreshProducts();
  };

  const handleVariantsClose = () => {
    setShowVariantsManager(false);
    setSelectedProduct(null);
    refreshProducts();
  };

  return <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <h2 className="text-xl font-bold">Products</h2>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleAddProduct} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
          <Button variant="outline" onClick={refreshProducts} className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-full" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                  </TableCell>
                </TableRow> : filteredProducts.length === 0 ? <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No products found.
                  </TableCell>
                </TableRow> : filteredProducts.map(product => <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku || "-"}</TableCell>
                    <TableCell>
                      {product.category || product.category_id && (product as any).product_categories?.name || "Uncategorized"}
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      {product.has_variants ? <Badge variant="outline">Has variants</Badge> : <span>{product.stock ?? 0}</span>}
                    </TableCell>
                    <TableCell>
                      {product.has_variants ? <Button variant="outline" size="sm" onClick={() => handleManageVariants(product)} className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Manage
                        </Button> : <Badge variant="secondary">No variants</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this product? This action cannot be undone.
                                {product.has_variants && <p className="mt-2 font-bold text-destructive">
                                    All associated variants will also be deleted!
                                  </p>}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => handleDeleteProduct(product.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-7xl py-16 max-h-screen border-none bg-background">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm onClose={handleFormClose} onSave={refreshProducts} threeColumns={true} />
        </DialogContent>
      </Dialog>
      
      {showEditForm && selectedProduct && <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
          <DialogContent className="max-w-7xl py-16 max-h-screen border-none bg-background">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <ProductForm product={selectedProduct} onClose={handleFormClose} onSave={refreshProducts} threeColumns={true} />
          </DialogContent>
        </Dialog>}
      
      {showVariantsManager && selectedProduct && <ProductVariantsManager product={selectedProduct} onClose={handleVariantsClose} />}
    </div>;
};

export default ProductManagement;
