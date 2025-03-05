
/**
 * Utility functions to calculate trend percentages
 */
export const calculateTrendPercentage = (
  currentValue: number, 
  previousValue: number
): number => {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};
