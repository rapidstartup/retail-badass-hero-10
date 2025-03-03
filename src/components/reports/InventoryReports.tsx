
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { DatePickerWithRange } from "@/components/reports/DateRangePicker";
import { Package, RotateCcw, TrendingDown, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface InventoryReportsProps {
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
}

const InventoryReports: React.FC<InventoryReportsProps> = ({ dateRange, setDateRange }) => {
  const { data: inventoryData, isLoading } = useQuery({
    queryKey: ['inventory-reports', dateRange],
    queryFn: async () => {
      // This would normally be a backend call with proper aggregation
      // For now, we'll fetch some data and simulate the rest
      const { data: products, error } = await supabase
        .from('products')
        .select('*');
        
      if (error) {
        console.error('Error fetching inventory data:', error);
        return {
          lowStock: [],
          turnoverRate: [],
          categoryBreakdown: [],
          inventoryValue: 0,
          outOfStock: 0,
          lowStockCount: 0,
          averageTurnover: 0
        };
      }
      
      // Process the data
      const lowStock = products
        ?.filter(p => p.stock < 10 && p.stock > 0)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 10)
        .map(p => ({ 
          name: p.name, 
          stock: p.stock,
          id: p.id,
          price: p.price,
          cost: p.cost
        })) || [];
      
      // Generate mock turnover data
      const turnoverRate = [
        { category: 'Electronics', turnover: 4.2 },
        { category: 'Clothing', turnover: 3.7 },
        { category: 'Food', turnover: 12.5 },
        { category: 'Books', turnover: 1.8 },
        { category: 'Home', turnover: 2.9 }
      ];
      
      // Generate mock category breakdown
      const categoryBreakdown = [
        { name: 'Electronics', value: 35 },
        { name: 'Clothing', value: 25 },
        { name: 'Food', value: 15 },
        { name: 'Books', value: 10 },
        { name: 'Home', value: 15 }
      ];
      
      const inventoryValue = products?.reduce((total, p) => {
        return total + (p.cost || 0) * (p.stock || 0);
      }, 0) || 0;
      
      const outOfStock = products?.filter(p => p.stock === 0)?.length || 0;
      
      return {
        lowStock,
        turnoverRate,
        categoryBreakdown,
        inventoryValue,
        outOfStock,
        lowStockCount: lowStock.length,
        averageTurnover: 4.8 // mock value
      };
    },
    initialData: {
      lowStock: [],
      turnoverRate: [],
      categoryBreakdown: [],
      inventoryValue: 0,
      outOfStock: 0,
      lowStockCount: 0,
      averageTurnover: 0
    }
  });

  const COLORS = ['#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Inventory Analytics</h2>
        <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Inventory Value" 
          value={formatCurrency(inventoryData.inventoryValue)} 
          icon={<Package className="h-6 w-6" />}
          className="theme-container-bg border"
        />
        <StatCard 
          title="Out of Stock" 
          value={formatNumber(inventoryData.outOfStock)} 
          icon={<TrendingDown className="h-6 w-6" />}
          className="theme-container-bg border"
        />
        <StatCard 
          title="Low Stock Items" 
          value={formatNumber(inventoryData.lowStockCount)} 
          icon={<RotateCcw className="h-6 w-6" />}
          className="theme-container-bg border"
        />
        <StatCard 
          title="Avg. Turnover Rate" 
          value={`${inventoryData.averageTurnover}x`} 
          icon={<TrendingUp className="h-6 w-6" />}
          className="theme-container-bg border"
        />
      </div>
      
      {/* Low Stock Products */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Products</CardTitle>
          <CardDescription>Items that need to be restocked soon</CardDescription>
        </CardHeader>
        <CardContent>
          {inventoryData.lowStock.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Profit Margin</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.lowStock.map((product) => {
                    const margin = product.price && product.cost ? 
                      ((product.price - product.cost) / product.price) * 100 : 0;
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>{formatCurrency(product.cost)}</TableCell>
                        <TableCell>{margin.toFixed(1)}%</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={product.stock < 5 ? 
                              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" : 
                              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }
                          >
                            {product.stock < 5 ? "Critical" : "Low"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No low stock products found</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Turnover Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Turnover Rate</CardTitle>
            <CardDescription>How quickly inventory is sold by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={inventoryData.turnoverRate}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => `${value}x`} />
                  <Tooltip formatter={(value) => [`${value}x`, 'Turnover Rate']} />
                  <Legend />
                  <Bar dataKey="turnover" fill="var(--theme-accent-color)" name="Turnover Rate" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Inventory distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryData.categoryBreakdown}
                    nameKey="name"
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="var(--theme-accent-color)"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {inventoryData.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Inventory Value Over Time (Mock) */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Value Over Time</CardTitle>
          <CardDescription>Track changes in inventory valuation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { date: '2023-01', value: 35000 },
                  { date: '2023-02', value: 38000 },
                  { date: '2023-03', value: 42000 },
                  { date: '2023-04', value: 39000 },
                  { date: '2023-05', value: 44000 },
                  { date: '2023-06', value: 50000 },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Inventory Value']}
                  labelFormatter={label => `Date: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--theme-accent-color)" 
                  name="Inventory Value" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryReports;
