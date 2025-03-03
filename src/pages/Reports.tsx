
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalesReportDashboard from "@/components/reports/SalesReportDashboard";
import InventoryReports from "@/components/reports/InventoryReports";
import CustomerInsights from "@/components/reports/CustomerInsights";
import PredictiveModels from "@/components/reports/PredictiveModels";
import ReportExporter from "@/components/reports/ReportExporter";
import { useSettings } from "@/contexts/SettingsContext";

const Reports = () => {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<string>("sales");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <ReportExporter activeTab={activeTab} dateRange={dateRange} />
      </div>

      <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 theme-section-bg">
          <TabsTrigger value="sales" className="data-[state=active]:theme-section-selected-bg">Sales</TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:theme-section-selected-bg">Inventory</TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:theme-section-selected-bg">Customers</TabsTrigger>
          <TabsTrigger value="predictive" className="data-[state=active]:theme-section-selected-bg">Predictive</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="mt-6">
          <SalesReportDashboard dateRange={dateRange} setDateRange={setDateRange} />
        </TabsContent>
        
        <TabsContent value="inventory" className="mt-6">
          <InventoryReports dateRange={dateRange} setDateRange={setDateRange} />
        </TabsContent>
        
        <TabsContent value="customers" className="mt-6">
          <CustomerInsights dateRange={dateRange} setDateRange={setDateRange} />
        </TabsContent>
        
        <TabsContent value="predictive" className="mt-6">
          <PredictiveModels dateRange={dateRange} setDateRange={setDateRange} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Reports;
