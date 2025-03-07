import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/utils/formatters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";
import VariantSelectionModal from "./variant-selection/VariantSelectionModal";

// Product interface for type safety
interface Product {
  id: string;
  name: string;
  price: number;
  category: string | null;
  image_url: string | null;
  stock: number | null;
  description: string | null;
  has_variants: boolean;
}

interface POSProductGridProps {
  activeCategory: string;
  searchTerm: string;
  addToCart: (product: Product, variantId?: string) => void;
}

const POSProductGrid: React.FC<POSProductGridProps> = ({ 
  activeCategory, 
  searchTerm,
  addToCart 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  
  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");
        
      if (error) {
        console.error("Error fetching products:", error);
        return;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error("Unexpected error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch on component mount
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Set up real-time subscription for product updates
  useEffect(() => {
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, 
        () => {
          fetchProducts();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle product click - either add directly to cart or show variant selection
  const handleProductClick = (product: Product) => {
    if (product.has_variants) {
      setSelectedProduct(product);
      setShowVariantModal(true);
    } else {
      addToCart(product);
    }
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-280px)]">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-6 pr-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full flex items-center justify-center h-40 text-muted-foreground">
                No products found
              </div>
            ) : (
              filteredProducts.map(product => (
                <div 
                  key={product.id}
                  className="bg-card border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all transform hover:-translate-y-1"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img 
                      src={product.image_url || "/placeholder.svg"} 
                      alt={product.name}
                      className="object-cover h-full w-full"
                    />
                    {product.has_variants ? (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                        Options
                      </div>
                    ) : product.stock !== null && product.stock <= 5 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.stock <= 0 ? "Out of stock" : "Low stock"}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">{formatCurrency(product.price)}</p>
                      {!product.has_variants && product.stock !== null && (
                        <p className="text-xs text-muted-foreground">
                          Stock: {product.stock}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </ScrollArea>

      {/* Variant Selection Modal */}
      {selectedProduct && (
        <VariantSelectionModal
          product={selectedProduct}
          isOpen={showVariantModal}
          onClose={() => {
            setShowVariantModal(false);
            setSelectedProduct(null);
          }}
          onAddToCart={(variantId) => {
            addToCart(selectedProduct, variantId);
            setShowVariantModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </>
  );
};

export default POSProductGrid;
