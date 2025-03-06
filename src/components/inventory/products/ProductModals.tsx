
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/types";
import ProductForm from "../ProductForm";
import ProductVariantsManager from "../ProductVariantsManager";

interface ProductModalsProps {
  selectedProduct: Product | null;
  showAddForm: boolean;
  showEditForm: boolean;
  showVariantsManager: boolean;
  setShowAddForm: (show: boolean) => void;
  setShowEditForm: (show: boolean) => void;
  setShowVariantsManager: (show: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
  refreshProducts: () => void;
}

const ProductModals: React.FC<ProductModalsProps> = ({
  selectedProduct,
  showAddForm,
  showEditForm,
  showVariantsManager,
  setShowAddForm,
  setShowEditForm,
  setShowVariantsManager,
  setSelectedProduct,
  refreshProducts
}) => {
  const handleFormClose = () => {
    console.log("Closing form dialog");
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
    <>
      {/* Dialog for adding products */}
      <Dialog 
        open={showAddForm} 
        onOpenChange={(open) => {
          console.log("Add dialog open state changing to:", open);
          // If dialog is closing
          if (!open) {
            setShowAddForm(false);
            setSelectedProduct(null);
          }
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
          console.log("Edit dialog open state changing to:", open);
          // If dialog is closing
          if (!open) {
            setShowEditForm(false);
            setSelectedProduct(null);
          }
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
    </>
  );
};

export default ProductModals;
