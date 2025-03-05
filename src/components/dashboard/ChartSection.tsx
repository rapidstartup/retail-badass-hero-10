
import React from "react";
import SalesOverviewChart from "./SalesOverviewChart";
import TopProductsChart from "./TopProductsChart";

interface ChartSectionProps {
  salesData: any[] | undefined;
  salesLoading: boolean;
  topProducts: any[] | undefined;
  productsLoading: boolean;
}

const ChartSection: React.FC<ChartSectionProps> = ({ 
  salesData, 
  salesLoading, 
  topProducts, 
  productsLoading 
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 mb-6">
      <SalesOverviewChart 
        salesData={salesData} 
        isLoading={salesLoading} 
      />
      <TopProductsChart 
        topProducts={topProducts} 
        isLoading={productsLoading} 
      />
    </div>
  );
};

export default ChartSection;
