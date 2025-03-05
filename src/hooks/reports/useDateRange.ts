
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { startOfWeek, endOfWeek } from "date-fns";

export const useDateRange = () => {
  // Set default date range to current week (Monday-Sunday)
  const today = new Date();
  const defaultFrom = startOfWeek(today, { weekStartsOn: 1 }); // 1 = Monday
  const defaultTo = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
  
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date | undefined;
  }>({
    from: defaultFrom,
    to: defaultTo,
  });

  // Handler for date range changes that correctly types the data
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setDateRange({
        from: range.from,
        to: range.to || range.from
      });
    }
  };

  return {
    dateRange,
    handleDateRangeChange
  };
};
