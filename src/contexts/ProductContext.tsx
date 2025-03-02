import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Product,
  ProductCategory,
  fetchProducts,
  fetchCategories
} from "@/api/inventoryApi";

interface ProductContextType {
  products: Product[];
  categories: ProductCategory[];
  loading: boolean;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const refreshProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error refreshing products:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error refreshing categories:", error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          refreshProducts(),
          refreshCategories()
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        categories, 
        loading, 
        selectedProduct, 
        setSelectedProduct,
        refreshProducts,
        refreshCategories
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
