
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HourlyData {
  hour: string; 
  count: number;
  total: number;
}

const TransactionHourlyChart = () => {
  const { data: hourlyData, isLoading } = useQuery({
    queryKey: ['transaction-hourly-data'],
    queryFn: async () => {
      const today = new Date();
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('created_at, total, status')
        .gte('created_at', oneWeekAgo.toISOString())
        .lte('created_at', today.toISOString())
        .eq('status', 'completed');
        
      if (error) throw error;
      
      const hourlyTotals: Record<number, { count: number; total: number }> = {};
      
      // Initialize hours
      for (let i = 0; i < 24; i++) {
        hourlyTotals[i] = { count: 0, total: 0 };
      }
      
      // Aggregate data by hour
      (data || []).forEach(transaction => {
        const date = new Date(transaction.created_at);
        const hour = date.getHours();
        
        hourlyTotals[hour].count += 1;
        hourlyTotals[hour].total += transaction.total || 0;
      });
      
      // Convert to array format for chart
      const chartData: HourlyData[] = Object.entries(hourlyTotals).map(([hour, data]) => ({
        hour: formatHour(parseInt(hour)),
        count: data.count,
        total: data.total
      }));
      
      return chartData;
    },
  });

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={hourlyData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 12 }}
            interval={1}
          />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'total') return [`$${value}`, 'Revenue'];
              return [value, 'Transactions'];
            }}
          />
          <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Transactions" />
          <Bar yAxisId="right" dataKey="total" fill="#82ca9d" name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionHourlyChart;
