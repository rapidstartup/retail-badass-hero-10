
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/reports/DateRangePicker";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { CreditCard, TrendingUp, Users, ShoppingCart } from "lucide-react";
import StatCard from "@/components/StatCard";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/contexts/SettingsContext";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface CustomerInsightsProps {
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
}

const CustomerInsights: React.FC<CustomerInsightsProps> = ({ dateRange, setDateRange }) => {
  const { settings } = useSettings();
  
  const { data: customerData, isLoading } = useQuery({
    queryKey: ['customer-insights', dateRange],
    queryFn: async () => {
      // Fetch customers data
      const { data: customers, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .order('total_spend', { ascending: false })
        .limit(50);
      
      if (customerError) {
        console.error('Error fetching customer data:', customerError);
        return {
          topCustomers: [],
          customerTiers: [],
          loyaltyDistribution: [],
          lifetimeValue: [],
          totalCustomers: 0,
          activeCustomers: 0,
          averageSpend: 0,
          retentionRate: 0
        };
      }
      
      // Process customers data for insights
      const topCustomers = customers
        ?.slice(0, 10)
        .map(c => ({
          id: c.id,
          name: `${c.first_name} ${c.last_name}`,
          total_spend: c.total_spend,
          loyalty_points: c.loyalty_points,
          tier: c.tier
        })) || [];
      
      // Generate customer tiers breakdown
      const tierCounts = {
        Bronze: 0,
        Silver: 0,
        Gold: 0
      };
      
      customers?.forEach(c => {
        if (c.tier && tierCounts[c.tier] !== undefined) {
          tierCounts[c.tier] += 1;
        } else {
          tierCounts.Bronze += 1;
        }
      });
      
      const customerTiers = Object.entries(tierCounts).map(([tier, count]) => ({
        tier,
        count
      }));
      
      // Generate loyalty points distribution (mock data)
      const loyaltyDistribution = [
        { points: '0-100', count: 35 },
        { points: '101-500', count: 25 },
        { points: '501-1000', count: 15 },
        { points: '1001-2000', count: 10 },
        { points: '2000+', count: 5 }
      ];
      
      // Generate lifetime value curve (mock data)
      const lifetimeValue = [
        { month: 1, value: 120 },
        { month: 2, value: 220 },
        { month: 3, value: 300 },
        { month: 6, value: 420 },
        { month: 12, value: 750 },
        { month: 24, value: 1200 }
      ];
      
      // Calculate summary statistics
      const totalCustomers = customers?.length || 0;
      const totalSpend = customers?.reduce((sum, c) => sum + (c.total_spend || 0), 0) || 0;
      const averageSpend = totalCustomers > 0 ? totalSpend / totalCustomers : 0;
      
      return {
        topCustomers,
        customerTiers,
        loyaltyDistribution,
        lifetimeValue,
        totalCustomers,
        activeCustomers: Math.round(totalCustomers * 0.7), // Mock active customer count
        averageSpend,
        retentionRate: 76 // Mock retention rate
      };
    },
    initialData: {
      topCustomers: [],
      customerTiers: [],
      loyaltyDistribution: [],
      lifetimeValue: [],
      totalCustomers: 0,
      activeCustomers: 0,
      averageSpend: 0,
      retentionRate: 0
    }
  });

  const COLORS = ['#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'];
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Gold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Silver':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Customer Insights</h2>
        <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Customers" 
          value={formatNumber(customerData.totalCustomers)} 
          icon={<Users className="h-6 w-6" />}
          className="theme-container-bg border"
        />
        <StatCard 
          title="Active Customers" 
          value={formatNumber(customerData.activeCustomers)} 
          description={`${Math.round(customerData.activeCustomers / customerData.totalCustomers * 100)}% of total`}
          icon={<ShoppingCart className="h-6 w-6" />}
          className="theme-container-bg border"
        />
        <StatCard 
          title="Average Spend" 
          value={formatCurrency(customerData.averageSpend)} 
          icon={<CreditCard className="h-6 w-6" />}
          className="theme-container-bg border"
        />
        <StatCard 
          title="Retention Rate" 
          value={`${customerData.retentionRate}%`} 
          icon={<TrendingUp className="h-6 w-6" />}
          className="theme-container-bg border"
        />
      </div>
      
      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <CardDescription>Highest spending customers</CardDescription>
        </CardHeader>
        <CardContent>
          {customerData.topCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total Spend</TableHead>
                    <TableHead>Loyalty Points</TableHead>
                    <TableHead>Tier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.topCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{formatCurrency(customer.total_spend)}</TableCell>
                      <TableCell>{formatNumber(customer.loyalty_points)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getTierColor(customer.tier || 'Bronze')}
                        >
                          {customer.tier || 'Bronze'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No customer data available</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Tiers */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Tiers</CardTitle>
            <CardDescription>Distribution of customers by loyalty tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerData.customerTiers}
                    nameKey="tier"
                    dataKey="count"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="var(--theme-accent-color)"
                    label={({ tier, percent }) => `${tier} ${(percent * 100).toFixed(0)}%`}
                  >
                    {customerData.customerTiers.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.tier === 'Gold' ? '#F7B538' : entry.tier === 'Silver' ? '#C0C0C0' : '#CD7F32'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>Silver tier begins at {formatCurrency(settings.tierThresholdSilver)} in spending</p>
              <p>Gold tier begins at {formatCurrency(settings.tierThresholdGold)} in spending</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Loyalty Points Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Points Distribution</CardTitle>
            <CardDescription>Customer count by loyalty point range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={customerData.loyaltyDistribution}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="points" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
                  <Bar dataKey="count" fill="var(--theme-accent-color)" name="Customers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Customer Lifetime Value */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Lifetime Value</CardTitle>
          <CardDescription>Average customer spending over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={customerData.lifetimeValue}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottomRight', offset: -10 }} />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Average Value']}
                  labelFormatter={label => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--theme-accent-color)" 
                  name="Customer Value" 
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

export default CustomerInsights;
