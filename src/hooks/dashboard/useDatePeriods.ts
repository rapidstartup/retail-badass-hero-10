
/**
 * Utility hook to calculate date periods for dashboard stats
 */
export const calculatePeriodRanges = (periodType: 'day' | 'week' | 'month') => {
  // Get the date for today at 00:00:00
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Setup period ranges based on the selected period type
  let currentPeriodStart: Date;
  let previousPeriodStart: Date;
  let previousPeriodEnd: Date;
  let periodLabel: string;
  
  if (periodType === 'day') {
    // Compare today vs yesterday
    currentPeriodStart = today;
    
    previousPeriodStart = new Date(today);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 1);
    
    previousPeriodEnd = new Date(previousPeriodStart);
    previousPeriodEnd.setHours(23, 59, 59, 999);
    
    periodLabel = "yesterday";
  } else if (periodType === 'week') {
    // Current week (starting Monday)
    currentPeriodStart = new Date(today);
    const dayOfWeek = currentPeriodStart.getDay();
    const diff = currentPeriodStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    currentPeriodStart.setDate(diff);
    
    // Previous week
    previousPeriodStart = new Date(currentPeriodStart);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
    
    previousPeriodEnd = new Date(currentPeriodStart);
    previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
    previousPeriodEnd.setHours(23, 59, 59, 999);
    
    periodLabel = "last week";
  } else if (periodType === 'month') {
    // Current month
    currentPeriodStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Previous month
    previousPeriodStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    
    previousPeriodEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    previousPeriodEnd.setHours(23, 59, 59, 999);
    
    periodLabel = "last month";
  }
  
  return {
    today,
    currentPeriodStart,
    previousPeriodStart,
    previousPeriodEnd,
    periodLabel
  };
};
