
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TransactionFilters as TransactionFiltersType } from "@/types/transaction";
import { DatePickerWithRange } from "@/components/ui/date-picker";

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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Search input */}
        <div className="sm:col-span-3 lg:col-span-2">
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
        <div className="sm:col-span-3 lg:col-span-2">
          <Label>Date Range</Label>
          <DatePickerWithRange 
            dateRange={filters.dateRange as {from: Date, to: Date}}
            setDateRange={(range) => setFilters({ ...filters, dateRange: range })}
          />
        </div>

        {/* Payment method */}
        <div>
          <Label>Payment Method</Label>
          <Select 
            value={filters.paymentMethod || ""}
            onValueChange={(value) => setFilters({ ...filters, paymentMethod: value || undefined })}
          >
            <SelectTrigger>
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

        {/* Status */}
        <div>
          <Label>Status</Label>
          <Select 
            value={filters.status || ""}
            onValueChange={(value) => setFilters({ ...filters, status: value || undefined })}
          >
            <SelectTrigger>
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

        {/* Amount range */}
        <div>
          <Label>Min Amount ($)</Label>
          <Input
            type="number"
            placeholder="Min"
            value={filters.minimumAmount || ""}
            onChange={(e) => setFilters({ ...filters, minimumAmount: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
        <div>
          <Label>Max Amount ($)</Label>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maximumAmount || ""}
            onChange={(e) => setFilters({ ...filters, maximumAmount: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
      </div>
    </div>
  );
};

export default TransactionFilters;
