
import React from "react";
import Layout from "@/components/Layout";
import POSCart from "@/components/pos/POSCart";
import POSProductsView from "@/components/pos/POSProductsView";
import { useSettings } from "@/contexts/SettingsContext";
import { useCart } from "@/hooks/pos/useCart";
import { useCategories } from "@/hooks/pos/useCategories";

const POS = () => {
  const { settings } = useSettings();
  const { categories, activeCategory, setActiveCategory } = useCategories();
  const { 
    cartItems, 
    selectedCustomer, 
    setSelectedCustomer, 
    addToCart,
    updateItemQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getTaxAmount,
    getTotal,
    handleCheckoutTab,
    processTransaction
  } = useCart(settings.taxRate);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-6 p-4 h-[calc(100vh-64px)]">
        {/* Left side: Products */}
        <POSProductsView 
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          handleCheckoutTab={handleCheckoutTab}
          addToCart={addToCart}
          tabEnabled={settings.tabEnabled}
          tabThreshold={settings.tabThreshold}
        />
        
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
