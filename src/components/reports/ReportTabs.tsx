
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalesTab from "./SalesTab";
import InventoryTab from "./InventoryTab";
import CustomersTab from "./CustomersTab";
import PredictiveTab from "./PredictiveTab";

interface ReportTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  dailySales: Array<{ date: Date; sales: number }>;
  topCustomers: Array<{ name: string; spent: number; visits: number }>;
  inventoryStatus: Array<{ 
    product: string; 
    stock: number; 
    reorderLevel: number; 
    status: "Good" | "Low" | "Critical";
  }>;
  isInventoryLoading?: boolean;
}

const ReportTabs: React.FC<ReportTabsProps> = ({
  activeTab,
  setActiveTab,
  topProducts,
  dailySales,
  topCustomers,
  inventoryStatus,
  isInventoryLoading = false
}) => {
  return (
    <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 theme-section-bg mb-6">
        <TabsTrigger value="sales" className="data-[state=active]:theme-section-selected-bg">Sales</TabsTrigger>
        <TabsTrigger value="inventory" className="data-[state=active]:theme-section-selected-bg">Inventory</TabsTrigger>
        <TabsTrigger value="customers" className="data-[state=active]:theme-section-selected-bg">Customers</TabsTrigger>
        <TabsTrigger value="predictive" className="data-[state=active]:theme-section-selected-bg">Predictive</TabsTrigger>
      </TabsList>
      
      <TabsContent value="sales" className="space-y-6">
        <SalesTab topProducts={topProducts} dailySales={dailySales} />
      </TabsContent>
      
      <TabsContent value="inventory" className="space-y-6">
        <InventoryTab inventoryStatus={inventoryStatus} isLoading={isInventoryLoading} />
      </TabsContent>
      
      <TabsContent value="customers" className="space-y-6">
        <CustomersTab topCustomers={topCustomers} />
      </TabsContent>
      
      <TabsContent value="predictive" className="space-y-6">
        <PredictiveTab />
      </TabsContent>
    </Tabs>
  );
};

export default ReportTabs;
