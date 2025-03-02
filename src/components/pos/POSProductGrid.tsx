
import React from "react";
import { formatCurrency } from "@/utils/formatters";
import { ScrollArea } from "@/components/ui/scroll-area";

// Temporary mock data
const mockProducts = [
  { id: "1", name: "Coffee", price: 3.99, category: "Drinks", image: "/placeholder.svg" },
  { id: "2", name: "Tea", price: 2.99, category: "Drinks", image: "/placeholder.svg" },
  { id: "3", name: "Sandwich", price: 6.99, category: "Food", image: "/placeholder.svg" },
  { id: "4", name: "Salad", price: 7.99, category: "Food", image: "/placeholder.svg" },
  { id: "5", name: "T-Shirt", price: 19.99, category: "Merchandise", image: "/placeholder.svg" },
  { id: "6", name: "Mug", price: 12.99, category: "Merchandise", image: "/placeholder.svg" },
  { id: "7", name: "Consultation", price: 49.99, category: "Services", image: "/placeholder.svg" },
  { id: "8", name: "Cookie", price: 1.99, category: "Food", image: "/placeholder.svg" },
  { id: "9", name: "Smoothie", price: 5.99, category: "Drinks", image: "/placeholder.svg" },
  { id: "10", name: "Hat", price: 14.99, category: "Merchandise", image: "/placeholder.svg" },
  { id: "11", name: "Training", price: 29.99, category: "Services", image: "/placeholder.svg" },
  { id: "12", name: "Soda", price: 1.99, category: "Drinks", image: "/placeholder.svg" },
  { id: "13", name: "Cake", price: 4.99, category: "Food", image: "/placeholder.svg" },
  { id: "14", name: "Sticker", price: 2.99, category: "Merchandise", image: "/placeholder.svg" },
  { id: "15", name: "Support", price: 19.99, category: "Services", image: "/placeholder.svg" },
];

interface POSProductGridProps {
  activeCategory: string;
  searchTerm: string;
  addToCart: (product: any) => void;
}

const POSProductGrid: React.FC<POSProductGridProps> = ({ 
  activeCategory, 
  searchTerm,
  addToCart 
}) => {
  // Filter products based on category and search term
  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
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
              onClick={() => addToCart(product)}
            >
              <div className="aspect-square bg-muted relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium truncate">{product.name}</h3>
                <p className="text-muted-foreground">{formatCurrency(product.price)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default POSProductGrid;
