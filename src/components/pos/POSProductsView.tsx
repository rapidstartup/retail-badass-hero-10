
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import POSProductGrid from "@/components/pos/POSProductGrid";
import POSNumpad from "@/components/pos/POSNumpad";
import POSCustomerSearch from "@/components/pos/POSCustomerSearch";
import { TabManager } from "@/components/pos/TabManager";
import { InventoryTracker } from "@/components/inventory/InventoryTracker";
import POSCategorySelector from "@/components/pos/POSCategorySelector";
import { Product } from "@/hooks/pos/useCart";

interface POSProductsViewProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  selectedCustomer: any;
  setSelectedCustomer: (customer: any) => void;
  handleCheckoutTab: (tabId: string) => void;
  addToCart: (product: Product) => void;
  tabEnabled: boolean;
  tabThreshold: number;
}

const POSProductsView: React.FC<POSProductsViewProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
  selectedCustomer,
  setSelectedCustomer,
  handleCheckoutTab,
  addToCart,
  tabEnabled,
  tabThreshold
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "numpad" | "tabs" | "inventory">("products");

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-md border border-input bg-background"
          />
        </div>
        <POSCustomerSearch 
          selectedCustomer={selectedCustomer} 
          setSelectedCustomer={setSelectedCustomer} 
        />
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "products" | "numpad" | "tabs" | "inventory")} 
        className="flex-1 flex flex-col"
      >
        <TabsList className="mb-4 w-full border-b sticky top-0 z-10 bg-background">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="numpad">Numpad</TabsTrigger>
          <TabsTrigger value="tabs">Open Tabs</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="flex-1 overflow-hidden flex flex-col mt-0">
          <POSCategorySelector 
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
          
          <Card className="flex-1 overflow-hidden">
            <CardContent className="p-4 h-full">
              <POSProductGrid 
                activeCategory={activeCategory}
                searchTerm={searchTerm}
                addToCart={addToCart}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="numpad" className="flex-1">
          <POSNumpad addToCart={addToCart} />
        </TabsContent>
        
        <TabsContent value="tabs" className="flex-1">
          <TabManager 
            tabEnabled={tabEnabled} 
            tabThreshold={tabThreshold}
            onCheckoutTab={handleCheckoutTab}
          />
        </TabsContent>
        
        <TabsContent value="inventory" className="flex-1">
          <InventoryTracker lowStockThreshold={5} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default POSProductsView;
