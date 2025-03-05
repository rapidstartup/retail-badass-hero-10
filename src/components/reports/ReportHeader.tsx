
import React from "react";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { DateRange } from "react-day-picker";

interface ReportHeaderProps {
  dateRange: {
    from: Date;
    to: Date | undefined;
  };
  handleDateRangeChange: (range: DateRange | undefined) => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ dateRange, handleDateRangeChange }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
      
      <div className="flex flex-col md:flex-row items-center gap-4">
        <DatePickerWithRange
          dateRange={{
            from: dateRange.from,
            to: dateRange.to as Date
          }}
          setDateRange={handleDateRangeChange}
        />
        <Button>
          Export Report
        </Button>
      </div>
    </div>
  );
};

export default ReportHeader;
