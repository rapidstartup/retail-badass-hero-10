
import React, { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { deleteProduct } from "@/api/productApi";
import { toast } from "sonner";
import ProductForm from "./ProductForm";
import ProductVariantsManager from "./ProductVariantsManager";
import ProductTable from "./products/ProductTable";
import ProductSearch from "./products/ProductSearch";
import ProductHeader from "./products/ProductHeader";

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

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.barcode && product.barcode.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowAddForm(true);
  };

  const handleEditProduct = (product: any) => {
    console.log("Edit product clicked:", product);
    setSelectedProduct(product);
    setShowEditForm(true);
  };

  const handleManageVariants = (product: any) => {
    setSelectedProduct(product);
    setShowVariantsManager(true);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const success = await deleteProduct(id);
      if (success) {
        toast.success("Product deleted successfully");
        refreshProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An error occurred while deleting the product");
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

  return (
    <div className="space-y-4">
      <ProductHeader 
        handleAddProduct={handleAddProduct} 
        refreshProducts={refreshProducts} 
      />

      <ProductSearch 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />

      <Card>
        <CardContent className="p-0">
          <ProductTable 
            products={filteredProducts}
            loading={loading}
            handleEditProduct={handleEditProduct}
            handleManageVariants={handleManageVariants}
            handleDeleteProduct={handleDeleteProduct}
          />
        </CardContent>
      </Card>

      {/* Dialogs for adding/editing products and managing variants */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-7xl max-h-[85vh] bg-background overflow-y-auto">
          <ProductForm onClose={handleFormClose} onSave={refreshProducts} threeColumns={true} />
        </DialogContent>
      </Dialog>
      
      {showEditForm && selectedProduct && (
        <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
          <DialogContent className="max-w-7xl max-h-[85vh] bg-background overflow-y-auto custom-scrollbar">
            <ProductForm 
              product={selectedProduct} 
              onClose={handleFormClose} 
              onSave={refreshProducts} 
              threeColumns={true} 
            />
          </DialogContent>
        </Dialog>
      )}
      
      {showVariantsManager && selectedProduct && (
        <ProductVariantsManager 
          product={selectedProduct} 
          onClose={handleVariantsClose} 
        />
      )}
    </div>
  );
};

export default ProductManagement;
