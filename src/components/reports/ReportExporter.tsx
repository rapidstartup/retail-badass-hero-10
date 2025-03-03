
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DownloadCloud } from "lucide-react";
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ReportExporterProps {
  activeTab: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const ReportExporter: React.FC<ReportExporterProps> = ({ activeTab, dateRange }) => {
  const [format, setFormat] = useState("csv");
  const [includeCharts, setIncludeCharts] = useState(true);
  
  const exportOptions = {
    sales: [
      { value: "sales_summary", label: "Sales Summary" },
      { value: "sales_by_product", label: "Sales by Product" },
      { value: "sales_by_payment", label: "Sales by Payment Method" },
      { value: "sales_daily", label: "Daily Sales Breakdown" }
    ],
    inventory: [
      { value: "inventory_summary", label: "Inventory Summary" },
      { value: "low_stock", label: "Low Stock Report" },
      { value: "turnover", label: "Inventory Turnover" },
      { value: "valuation", label: "Inventory Valuation" }
    ],
    customers: [
      { value: "customer_summary", label: "Customer Summary" },
      { value: "top_customers", label: "Top Customers" },
      { value: "loyalty_tiers", label: "Loyalty Tier Distribution" },
      { value: "customer_lifetime", label: "Customer Lifetime Value" }
    ],
    predictive: [
      { value: "sales_forecast", label: "Sales Forecast" },
      { value: "inventory_predictions", label: "Inventory Predictions" },
      { value: "seasonal_trends", label: "Seasonal Trends" },
      { value: "customer_projections", label: "Customer Spending Projections" }
    ]
  };
  
  const currentOptions = exportOptions[activeTab as keyof typeof exportOptions] || exportOptions.sales;
  
  const [selectedReports, setSelectedReports] = useState<string[]>([currentOptions[0].value]);
  
  const handleExport = () => {
    const fromDate = dateRange.from ? dateRange.from.toLocaleDateString() : 'all time';
    const toDate = dateRange.to ? dateRange.to.toLocaleDateString() : 'today';
    
    toast.success(`Report exported as ${format.toUpperCase()}`, {
      description: `${selectedReports.length} report(s) for ${fromDate} to ${toDate}`
    });
  };
  
  React.useEffect(() => {
    setSelectedReports([exportOptions[activeTab as keyof typeof exportOptions][0].value]);
  }, [activeTab]);
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <DownloadCloud className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Reports</DialogTitle>
          <DialogDescription>
            Select which reports you want to export and the format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Select Reports</h4>
            
            <div className="space-y-2 mt-2 border rounded-md p-3">
              {currentOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option.value} 
                    checked={selectedReports.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedReports([...selectedReports, option.value]);
                      } else {
                        setSelectedReports(selectedReports.filter(r => r !== option.value));
                      }
                    }}
                  />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="format">Export Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Format</SelectLabel>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {(format === 'pdf' || format === 'excel') && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-charts" 
                checked={includeCharts}
                onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
              />
              <Label htmlFor="include-charts">Include charts and graphs</Label>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleExport} disabled={selectedReports.length === 0}>
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportExporter;
