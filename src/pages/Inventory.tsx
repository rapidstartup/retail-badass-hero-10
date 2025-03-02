
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductManagement from "@/components/inventory/ProductManagement";
import CategoryManagement from "@/components/inventory/CategoryManagement";
import InventoryAdjustments from "@/components/inventory/InventoryAdjustments";
import { ProductProvider } from "@/contexts/ProductContext";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState<string>("products");

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
        </div>

        <ProductProvider>
          <Tabs 
            defaultValue="products" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="adjustments">Inventory Adjustments</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              <ProductManagement />
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <CategoryManagement />
            </TabsContent>

            <TabsContent value="adjustments" className="space-y-4">
              <InventoryAdjustments />
            </TabsContent>
          </Tabs>
        </ProductProvider>
      </div>
    </Layout>
  );
};

export default Inventory;
