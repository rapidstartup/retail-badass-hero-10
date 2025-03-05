
import React from "react";
import Layout from "@/components/Layout";
import ReportHeader from "@/components/reports/ReportHeader";
import ReportStatCards from "@/components/reports/ReportStatCards";
import ReportTabs from "@/components/reports/ReportTabs";
import { useReportData } from "@/hooks/reports/useReportData";

const Reports = () => {
  const {
    activeTab,
    setActiveTab,
    dateRange,
    handleDateRangeChange,
    topProducts,
    dailySales,
    topCustomers,
    inventoryStatus
  } = useReportData();

  return (
    <Layout>
      <ReportHeader 
        dateRange={dateRange} 
        handleDateRangeChange={handleDateRangeChange} 
      />
      
      <ReportStatCards />
      
      <ReportTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        topProducts={topProducts}
        dailySales={dailySales}
        topCustomers={topCustomers}
        inventoryStatus={inventoryStatus}
      />
    </Layout>
  );
};

export default Reports;
