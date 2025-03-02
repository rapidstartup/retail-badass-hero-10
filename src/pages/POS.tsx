
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import POSCart from "@/components/pos/POSCart";
import POSProductGrid from "@/components/pos/POSProductGrid";
import POSNumpad from "@/components/pos/POSNumpad";
import POSCustomerSearch from "@/components/pos/POSCustomerSearch";
import { useSettings } from "@/contexts/SettingsContext";
import { TabManager } from "@/components/pos/TabManager";
import { InventoryTracker } from "@/components/inventory/InventoryTracker";
import { calculateTotalTax, formatTaxRulesFromSettings } from "@/utils/taxCalculator";

// Temporary data until we connect to a database
const categories = ["All", "Food", "Drinks", "Merchandise", "Services"];

const POS = () => {
  const { settings } = useSettings();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "numpad" | "tabs" | "inventory">("products");

  const addToCart = (product: any) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } else {
      setCartItems(
        cartItems.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Use the dynamic tax calculator
  const getTaxAmount = () => {
    // For now we'll just use the default tax rate since we haven't stored
    // the tax rules in the database yet
    const taxRules = formatTaxRulesFromSettings([], settings.taxRate);
    return calculateTotalTax(
      cartItems.map(item => ({
        price: item.price,
        quantity: item.quantity,
        category: item.category
      })),
      taxRules,
      settings.taxRate
    );
  };

  const getTotal = () => {
    return getSubtotal() + getTaxAmount();
  };

  const handleCheckoutTab = (tabId: string) => {
    // This would load the tab items into the cart
    console.log("Loading tab for checkout:", tabId);
    // In a real implementation, we'd fetch the tab details from Supabase
    // and populate the cart with those items
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-6 p-4 h-[calc(100vh-64px)]">
        {/* Left side: Products */}
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
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 sticky top-[48px] z-10 bg-background">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    onClick={() => setActiveCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
              
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
                tabEnabled={settings.tabEnabled} 
                tabThreshold={settings.tabThreshold}
                onCheckoutTab={handleCheckoutTab}
              />
            </TabsContent>
            
            <TabsContent value="inventory" className="flex-1">
              <InventoryTracker lowStockThreshold={5} />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right side: Cart */}
        <div className="w-full md:w-[400px] flex flex-col gap-4">
          <POSCart 
            items={cartItems}
            updateItemQuantity={updateItemQuantity}
            removeItem={removeItem}
            clearCart={clearCart}
            subtotal={getSubtotal()}
            tax={getTaxAmount()}
            total={getTotal()}
            selectedCustomer={selectedCustomer}
            taxRate={settings.taxRate}
            storeName={settings.storeName}
          />
        </div>
      </div>
    </Layout>
  );
};

export default POS;
