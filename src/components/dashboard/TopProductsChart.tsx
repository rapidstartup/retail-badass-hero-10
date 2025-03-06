
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface TopProductsChartProps {
  topProducts: any[] | undefined;
  isLoading: boolean;
}

// Custom tooltip component with improved contrast
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-theme-background border border-theme-accent rounded-md shadow-lg p-3">
        <p className="font-medium text-theme-text">Product: {label}</p>
        <p className="text-theme-text">
          Sales: <span className="font-medium">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const TopProductsChart: React.FC<TopProductsChartProps> = ({ topProducts, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best selling items this period</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading product data...</p>
            </div>
          ) : (
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="var(--theme-accent-color)" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopProductsChart;
