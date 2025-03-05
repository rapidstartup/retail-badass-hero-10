
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { PeriodType } from "@/hooks/dashboard/types";

interface DashboardHeaderProps {
  periodType: PeriodType;
  onPeriodChange: (value: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  periodType,
  onPeriodChange
}) => {
  const navigate = useNavigate();
  
  const handleNewTransaction = () => {
    navigate("/pos");
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="flex items-center gap-4">
        <Select value={periodType} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Daily</SelectItem>
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleNewTransaction}>New Transaction</Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
