
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface SalesOverviewChartProps {
  salesData: any[] | undefined;
  isLoading: boolean;
}

// Custom tooltip component with improved contrast
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-theme-background border border-theme-accent rounded-md shadow-lg p-3">
        <p className="font-medium text-theme-text">Month: {label}</p>
        <p className="text-theme-text">
          Revenue: <span className="font-medium">${payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const SalesOverviewChart: React.FC<SalesOverviewChartProps> = ({ salesData, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly sales performance</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading sales data...</p>
            </div>
          ) : (
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="var(--theme-accent-color)" 
                fill="var(--theme-accent-color)"
                fillOpacity={0.2}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesOverviewChart;
