
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility functions to fetch dashboard data from Supabase
 */
export const fetchCurrentPeriodTransactions = async (currentPeriodStart: Date) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('total, items')
    .gte('created_at', currentPeriodStart.toISOString())
    .eq('status', 'completed');
  
  if (error) throw error;
  return data || [];
};

export const fetchPreviousPeriodTransactions = async (
  previousPeriodStart: Date, 
  previousPeriodEnd: Date
) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('total, items')
    .gte('created_at', previousPeriodStart.toISOString())
    .lt('created_at', previousPeriodEnd.toISOString())
    .eq('status', 'completed');
  
  if (error) throw error;
  return data || [];
};

export const fetchTodayTransactions = async (today: Date) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('total, items')
    .gte('created_at', today.toISOString())
    .eq('status', 'completed');
  
  if (error) throw error;
  return data || [];
};

export const fetchYesterdayTransactions = async () => {
  // Get yesterday's date range
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const yesterdayEnd = new Date(yesterday);
  yesterdayEnd.setHours(23, 59, 59, 999);
  
  const { data, error } = await supabase
    .from('transactions')
    .select('total, items')
    .gte('created_at', yesterday.toISOString())
    .lte('created_at', yesterdayEnd.toISOString())
    .eq('status', 'completed');
  
  if (error) throw error;
  return data || [];
};

export const fetchCurrentPeriodCustomers = async (currentPeriodStart: Date) => {
  const { data, error } = await supabase
    .from('customers')
    .select('id')
    .gte('created_at', currentPeriodStart.toISOString());
  
  if (error) throw error;
  return data || [];
};

export const fetchPreviousPeriodCustomers = async (
  previousPeriodStart: Date, 
  previousPeriodEnd: Date
) => {
  const { data, error } = await supabase
    .from('customers')
    .select('id')
    .gte('created_at', previousPeriodStart.toISOString())
    .lt('created_at', previousPeriodEnd.toISOString());
  
  if (error) throw error;
  return data || [];
};
