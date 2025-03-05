
import React, { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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

  const handleAddProduct = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("handleAddProduct called");
    if (e) {
      e.preventDefault(); // Prevent default behavior
      e.stopPropagation(); // Stop event propagation
    }
    setSelectedProduct(null);
    setShowAddForm(true);
    console.log("showAddForm set to true, state:", showAddForm);
  };

  const handleEditProduct = (product: any, e?: React.MouseEvent) => {
    console.log("handleEditProduct called");
    if (e) {
      e.preventDefault(); // Prevent default behavior
      e.stopPropagation(); // Stop event propagation
    }
    setSelectedProduct(product);
    setShowEditForm(true);
    console.log("showEditForm set to true, state:", showEditForm);
  };

  const handleManageVariants = (product: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault(); // Prevent default behavior
      e.stopPropagation(); // Stop event propagation
    }
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
    console.log("Form close called");
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

      {/* Dialog for adding products */}
      <Dialog 
        open={showAddForm} 
        onOpenChange={(open) => {
          console.log("Add dialog onOpenChange:", open);
          if (!open) {
            console.log("Closing add dialog");
            setSelectedProduct(null);
          }
          setShowAddForm(open);
        }}
      >
        <DialogContent className="max-w-7xl max-h-[85vh] bg-background overflow-y-auto custom-scrollbar">
          <DialogTitle>Add New Product</DialogTitle>
          <ProductForm onClose={handleFormClose} onSave={refreshProducts} threeColumns={true} />
        </DialogContent>
      </Dialog>
      
      {/* Dialog for editing products */}
      <Dialog 
        open={showEditForm} 
        onOpenChange={(open) => {
          console.log("Edit dialog onOpenChange:", open);
          if (!open) {
            console.log("Closing edit dialog");
            setSelectedProduct(null);
          }
          setShowEditForm(open);
        }}
      >
        <DialogContent className="max-w-7xl max-h-[85vh] bg-background overflow-y-auto custom-scrollbar">
          <DialogTitle>Edit Product</DialogTitle>
          {selectedProduct && (
            <ProductForm 
              product={selectedProduct} 
              onClose={handleFormClose} 
              onSave={refreshProducts} 
              threeColumns={true} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog for managing variants */}
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
