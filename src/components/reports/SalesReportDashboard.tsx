
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { useSettings } from "@/contexts/SettingsContext";
import { DatePickerWithRange } from "@/components/reports/DateRangePicker";
import { Calendar, CreditCard, DollarSign, TrendingUp, Users } from "lucide-react";
import StatCard from "@/components/StatCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface SalesReportDashboardProps {
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
}

const SalesReportDashboard: React.FC<SalesReportDashboardProps> = ({ dateRange, setDateRange }) => {
  const { settings } = useSettings();
  
  // Sales data query
  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['sales-data', dateRange],
    queryFn: async () => {
      const fromDate = dateRange.from ? new Date(dateRange.from) : new Date();
      fromDate.setDate(fromDate.getDate() - 30);
      
      const toDate = dateRange.to ? new Date(dateRange.to) : new Date();
      
      // This would normally be a backend call with proper aggregation
      // For now, we'll simulate the data
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('created_at', fromDate.toISOString())
        .lte('created_at', toDate.toISOString())
        .eq('status', 'completed');
      
      if (error) {
        console.error('Error fetching sales data:', error);
        return {
          dailySales: [],
          paymentMethods: [],
          topProducts: [],
          summary: {
            totalSales: 0,
            transactionCount: 0,
            averageOrder: 0,
            growth: 0
          }
        };
      }
      
      // Process the data
      const dailySalesMap = new Map();
      const paymentMethodsMap = new Map();
      const productsMap = new Map();
      
      let totalSales = 0;
      
      transactions?.forEach(transaction => {
        // Daily sales
        const date = new Date(transaction.created_at).toISOString().split('T')[0];
        const existing = dailySalesMap.get(date) || 0;
        dailySalesMap.set(date, existing + transaction.total);
        
        // Payment methods
        const method = transaction.payment_method || 'unknown';
        const methodCount = paymentMethodsMap.get(method) || { count: 0, amount: 0 };
        methodCount.count += 1;
        methodCount.amount += transaction.total;
        paymentMethodsMap.set(method, methodCount);
        
        // Products (from items JSON)
        if (transaction.items) {
          try {
            const items = typeof transaction.items === 'string' 
              ? JSON.parse(transaction.items) 
              : transaction.items;
              
            items.forEach((item: any) => {
              const productName = item.name;
              const product = productsMap.get(productName) || { 
                quantity: 0, 
                revenue: 0 
              };
              product.quantity += item.quantity;
              product.revenue += item.price * item.quantity;
              productsMap.set(productName, product);
            });
          } catch (e) {
            console.error('Error parsing transaction items:', e);
          }
        }
        
        totalSales += transaction.total;
      });
      
      // Convert maps to arrays for charts
      const dailySales = Array.from(dailySalesMap.entries())
        .map(([date, total]) => ({ 
          date, 
          total 
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
      
      const paymentMethods = Array.from(paymentMethodsMap.entries())
        .map(([name, data]) => ({ 
          name, 
          count: data.count, 
          amount: data.amount 
        }));
      
      const topProducts = Array.from(productsMap.entries())
        .map(([name, data]) => ({ 
          name, 
          quantity: data.quantity, 
          revenue: data.revenue 
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);
      
      return {
        dailySales,
        paymentMethods,
        topProducts,
        summary: {
          totalSales,
          transactionCount: transactions?.length || 0,
          averageOrder: transactions?.length ? totalSales / transactions.length : 0,
          growth: 8.2 // Mock data for growth
        }
      };
    },
    initialData: {
      dailySales: [],
      paymentMethods: [],
      topProducts: [],
      summary: {
        totalSales: 0,
        transactionCount: 0,
        averageOrder: 0,
        growth: 0
      }
    }
  });

  const COLORS = ['#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Sales Reports & Analytics</h2>
        <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Sales" 
          value={formatCurrency(salesData?.summary.totalSales || 0)} 
          icon={<DollarSign className="h-6 w-6" />}
          trend={salesData?.summary.growth ? { value: salesData.summary.growth, positive: true } : undefined}
          className="theme-container-bg border"
        />
        <StatCard 
          title="Transactions" 
          value={formatNumber(salesData?.summary.transactionCount || 0)} 
          icon={<CreditCard className="h-6 w-6" />}
          className="theme-container-bg border"
        />
        <StatCard 
          title="Average Order" 
          value={formatCurrency(salesData?.summary.averageOrder || 0)} 
          icon={<Users className="h-6 w-6" />}
          className="theme-container-bg border"
        />
        <StatCard 
          title="Sales Growth" 
          value={`${salesData?.summary.growth.toFixed(1)}%`} 
          icon={<TrendingUp className="h-6 w-6" />}
          className="theme-container-bg border"
        />
      </div>
      
      {/* Sales Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Over Time</CardTitle>
          <CardDescription>Revenue trends for selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData?.dailySales}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--theme-accent-color)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--theme-accent-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={date => {
                    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis 
                  tickFormatter={value => `$${value}`}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Sales']}
                  labelFormatter={label => new Date(label).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="var(--theme-accent-color)" 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling items by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData?.topProducts.slice(0, 5)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="var(--theme-accent-color)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution of transaction methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesData?.paymentMethods}
                    nameKey="name"
                    dataKey="amount"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="var(--theme-accent-color)"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesData?.paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Transaction Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Breakdown</CardTitle>
          <CardDescription>Detailed sales analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData?.dailySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={date => {
                      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }}
                  />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Sales']}
                    labelFormatter={label => new Date(label).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  />
                  <Legend />
                  <Bar dataKey="total" fill="var(--theme-accent-color)" name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="weekly" className="h-96">
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Weekly breakdown coming soon</p>
              </div>
            </TabsContent>
            
            <TabsContent value="monthly" className="h-96">
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Monthly breakdown coming soon</p>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="h-96">
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Custom breakdown coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Reports
        </Button>
        <Button>
          Download Detailed Report
        </Button>
      </div>
    </div>
  );
};

export default SalesReportDashboard;
