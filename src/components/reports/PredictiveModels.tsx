
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/reports/DateRangePicker";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  ComposedChart,
  Area 
} from "recharts";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/contexts/SettingsContext";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface PredictiveModelsProps {
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
}

const PredictiveModels: React.FC<PredictiveModelsProps> = ({ dateRange, setDateRange }) => {
  const { settings } = useSettings();
  
  // Generate 30 days of mock data
  const generateSalesForecast = () => {
    const data = [];
    
    const now = new Date();
    const historicalStart = new Date(now);
    historicalStart.setDate(historicalStart.getDate() - 30);
    
    const forecastEnd = new Date(now);
    forecastEnd.setDate(forecastEnd.getDate() + 30);
    
    // Generate daily values with some randomness
    let current = new Date(historicalStart);
    let lastValue = 1000 + Math.random() * 200;
    
    while (current <= forecastEnd) {
      const isWeekend = current.getDay() === 0 || current.getDay() === 6;
      const isHistorical = current < now;
      
      // Add some seasonality
      const dayFactor = isWeekend ? 1.3 : 1.0;
      
      // Add random walk
      const variance = lastValue * 0.1;
      const newValue = lastValue + (Math.random() * variance * 2 - variance);
      
      // Apply day factor
      const adjustedValue = newValue * dayFactor;
      
      data.push({
        date: new Date(current),
        value: adjustedValue,
        forecast: isHistorical ? null : adjustedValue
      });
      
      lastValue = adjustedValue;
      current.setDate(current.getDate() + 1);
    }
    
    return data;
  };
  
  const salesForecastData = generateSalesForecast();
  
  // Generate mock inventory prediction data
  const inventoryPredictionData = [
    { id: 1, name: "T-Shirt", currentStock: 45, estimatedDepletion: "14 days", reorderSuggestion: "31 units", priority: "Medium" },
    { id: 2, name: "Jeans", currentStock: 12, estimatedDepletion: "8 days", reorderSuggestion: "25 units", priority: "High" },
    { id: 3, name: "Sneakers", currentStock: 8, estimatedDepletion: "5 days", reorderSuggestion: "20 units", priority: "Critical" },
    { id: 4, name: "Hoodie", currentStock: 32, estimatedDepletion: "21 days", reorderSuggestion: "15 units", priority: "Low" },
    { id: 5, name: "Cap", currentStock: 18, estimatedDepletion: "15 days", reorderSuggestion: "12 units", priority: "Medium" }
  ];
  
  // Generate seasonal trend data
  const seasonalTrendData = [
    { month: "Jan", sales: 3200, lastYear: 3000, forecast: 3400 },
    { month: "Feb", sales: 3500, lastYear: 3200, forecast: 3700 },
    { month: "Mar", sales: 4000, lastYear: 3900, forecast: 4200 },
    { month: "Apr", sales: 4200, lastYear: 4000, forecast: 4500 },
    { month: "May", sales: 4600, lastYear: 4400, forecast: 4900 },
    { month: "Jun", sales: 5000, lastYear: 4700, forecast: 5300 },
    { month: "Jul", sales: 5400, lastYear: 5100, forecast: 5700 },
    { month: "Aug", sales: 5800, lastYear: 5400, forecast: 6100 },
    { month: "Sep", sales: 5200, lastYear: 4900, forecast: 5500 },
    { month: "Oct", sales: 4800, lastYear: 4600, forecast: 5100 },
    { month: "Nov", sales: 5500, lastYear: 5200, forecast: 5800 },
    { month: "Dec", sales: 6800, lastYear: 6500, forecast: 7100 }
  ];
  
  // Generate customer spending prediction
  const customerSpendingPrediction = [
    { segment: "New Customers", currentSpend: 85, projectedSpend: 120, growthRate: 41 },
    { segment: "Occasional", currentSpend: 240, projectedSpend: 280, growthRate: 17 },
    { segment: "Regular", currentSpend: 420, projectedSpend: 470, growthRate: 12 },
    { segment: "Loyal", currentSpend: 750, projectedSpend: 850, growthRate: 13 },
    { segment: "VIP", currentSpend: 1200, projectedSpend: 1400, growthRate: 17 }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-red-500';
      case 'High':
        return 'text-orange-500';
      case 'Medium':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Predictive Analytics</h2>
        <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Predictive Analytics</AlertTitle>
        <AlertDescription>
          These forecasts are based on historical data and machine learning models. Actual results may vary.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Sales Forecast</CardTitle>
          <CardDescription>30-day prediction based on historical trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={salesForecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => {
                    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Sales']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  name="Historical" 
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  fill="rgba(99, 102, 241, 0.2)"
                  stroke="#8884d8"
                  name="Forecast"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-end mt-4">
            <Button>Generate New Forecast</Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="seasonal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 theme-section-bg">
          <TabsTrigger value="seasonal" className="data-[state=active]:theme-section-selected-bg">Seasonal Trends</TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:theme-section-selected-bg">Inventory Predictions</TabsTrigger>
          <TabsTrigger value="customer" className="data-[state=active]:theme-section-selected-bg">Customer Spending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="seasonal" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Sales Trends</CardTitle>
              <CardDescription>Annual forecast with last year comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={seasonalTrendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Sales']} />
                    <Legend />
                    <Bar dataKey="lastYear" fill="#94a3b8" name="Last Year" />
                    <Bar dataKey="sales" fill="#3b82f6" name="Current Year" />
                    <Bar dataKey="forecast" fill="#8884d8" name="Forecast" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-6">
                <Info className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Seasonal patterns suggest higher sales during November-December and summer months.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Depletion Forecast</CardTitle>
              <CardDescription>Predicted stock depletion and reorder suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium p-4">Product</th>
                      <th className="text-left font-medium p-4">Current Stock</th>
                      <th className="text-left font-medium p-4">Est. Depletion</th>
                      <th className="text-left font-medium p-4">Reorder Suggestion</th>
                      <th className="text-left font-medium p-4">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryPredictionData.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-4 font-medium">{item.name}</td>
                        <td className="p-4">{item.currentStock} units</td>
                        <td className="p-4">{item.estimatedDepletion}</td>
                        <td className="p-4">{item.reorderSuggestion}</td>
                        <td className={`p-4 font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button>Generate Purchase Orders</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customer" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Spending Projections</CardTitle>
              <CardDescription>Predicted spending growth by customer segment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={customerSpendingPrediction}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    barSize={40}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `$${value}`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'Growth Rate') return [`${value}%`, name];
                        return [formatCurrency(Number(value)), name];
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="currentSpend" fill="#3b82f6" name="Current Avg. Spend" />
                    <Bar yAxisId="left" dataKey="projectedSpend" fill="#8884d8" name="Projected Avg. Spend" />
                    <Line yAxisId="right" type="monotone" dataKey="growthRate" stroke="#ff7300" name="Growth Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Strategy Recommendations</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700 dark:text-blue-400">
                  <li>Focus marketing efforts on New Customers with highest growth potential.</li>
                  <li>Create VIP retention programs to maximize high-value customer spending.</li>
                  <li>Implement targeted promotions for Occasional customers to increase visit frequency.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveModels;
