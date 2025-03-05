
import React from "react";
import Layout from "@/components/Layout";
import ReportHeader from "@/components/reports/ReportHeader";
import ReportStatCards from "@/components/reports/ReportStatCards";
import ReportTabs from "@/components/reports/ReportTabs";
import { useReportData } from "@/hooks/reports/useReportData";
import { useInventoryData } from "@/hooks/reports/useInventoryData";

const Reports = () => {
  const {
    activeTab,
    setActiveTab,
    dateRange,
    handleDateRangeChange,
    topProducts,
    dailySales,
    topCustomers,
    stats,
    isLoading
  } = useReportData();

  const { inventoryStatus, isLoading: inventoryLoading } = useInventoryData();

  return (
    <Layout>
      <ReportHeader 
        dateRange={dateRange} 
        handleDateRangeChange={handleDateRangeChange} 
      />
      
      <ReportStatCards 
        stats={stats}
        isLoading={isLoading}
      />
      
      <ReportTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        topProducts={topProducts}
        dailySales={dailySales}
        topCustomers={topCustomers}
        inventoryStatus={inventoryStatus}
        isInventoryLoading={inventoryLoading}
      />
    </Layout>
  );
};

export default Reports;
