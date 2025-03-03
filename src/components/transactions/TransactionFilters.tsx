
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, X, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TransactionFilters as TransactionFiltersType } from "@/types/transaction";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { DateRange } from "react-day-picker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

interface TransactionFiltersProps {
  filters: TransactionFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<TransactionFiltersType>>;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ filters, setFilters }) => {
  const resetFilters = () => {
    setFilters({
      dateRange: { 
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date()
      },
      paymentMethod: undefined,
      status: undefined,
      minimumAmount: undefined,
      maximumAmount: undefined,
      searchQuery: '',
    });
  };

  // Handler for date range changes that correctly types the data
  const handleDateRangeChange = (range: DateRange | undefined) => {
    // Ensure we have a valid range with both from and to dates
    if (range?.from) {
      setFilters(prev => ({
        ...prev,
        dateRange: {
          from: range.from as Date,
          to: range.to as Date || range.from as Date
        }
      }));
    }
  };

  const dateRangePresets = [
    { label: 'Today', days: 0 },
    { label: 'Yesterday', days: 1 },
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'This month', days: 'month' },
    { label: 'Last month', days: 'lastMonth' },
  ];

  const applyDatePreset = (preset: { label: string, days: number | string }) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    let from = new Date();
    let to = new Date();
    
    if (typeof preset.days === 'number') {
      if (preset.days === 0) {
        // Today
        from = new Date();
        from.setHours(0, 0, 0, 0);
      } else if (preset.days === 1) {
        // Yesterday
        from = new Date();
        from.setDate(from.getDate() - 1);
        from.setHours(0, 0, 0, 0);
        
        to = new Date();
        to.setDate(to.getDate() - 1);
        to.setHours(23, 59, 59, 999);
      } else {
        // Last X days
        from = new Date();
        from.setDate(from.getDate() - preset.days);
        from.setHours(0, 0, 0, 0);
      }
    } else if (preset.days === 'month') {
      // This month
      from = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (preset.days === 'lastMonth') {
      // Last month
      from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      to = new Date(today.getFullYear(), today.getMonth(), 0);
      to.setHours(23, 59, 59, 999);
    }
    
    setFilters(prev => ({
      ...prev,
      dateRange: { from, to }
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
        {/* Search input */}
        <div className="lg:col-span-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by ID or customer"
              className="pl-8"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            />
            {filters.searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1.5 h-6 w-6"
                onClick={() => setFilters({ ...filters, searchQuery: '' })}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Date range */}
        <div className="lg:col-span-2">
          <Label>Date Range</Label>
          <DatePickerWithRange 
            dateRange={{
              from: filters.dateRange?.from as Date,
              to: filters.dateRange?.to as Date
            }}
            setDateRange={handleDateRangeChange}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={resetFilters} className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button 
            variant="secondary" 
            className="flex-1"
            onClick={() => document.getElementById('advancedFilters')?.click()}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="advanced-filters">
          <AccordionTrigger id="advancedFilters">Advanced Filters</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {/* Date presets */}
              <div>
                <Label>Date Presets</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {dateRangePresets.map((preset) => (
                    <Button 
                      key={preset.label} 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={() => applyDatePreset(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <Label>Status</Label>
                <Select 
                  value={filters.status || ""}
                  onValueChange={(value) => setFilters({ ...filters, status: value || undefined })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Any status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment method */}
              <div>
                <Label>Payment Method</Label>
                <Select 
                  value={filters.paymentMethod || ""}
                  onValueChange={(value) => setFilters({ ...filters, paymentMethod: value || undefined })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Any method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any method</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="tab">Tab</SelectItem>
                    <SelectItem value="gift_card">Gift Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Amount range */}
              <div className="space-y-2">
                <Label>Amount Range ($)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minimumAmount || ""}
                    onChange={(e) => setFilters({ ...filters, minimumAmount: e.target.value ? Number(e.target.value) : undefined })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maximumAmount || ""}
                    onChange={(e) => setFilters({ ...filters, maximumAmount: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TransactionFilters;
