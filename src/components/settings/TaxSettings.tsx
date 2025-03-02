
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface TaxSettingsProps {
  taxRate: number;
  setTaxRate: (value: number) => void;
}

const TaxSettings = ({ taxRate, setTaxRate }: TaxSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Configuration</CardTitle>
        <CardDescription>
          Set up tax rates for your transactions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="default-tax-rate">Default Tax Rate (%)</Label>
          <Input
            id="default-tax-rate"
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(parseFloat(e.target.value))}
            step="0.01"
            min="0"
            max="100"
          />
          <p className="text-sm text-muted-foreground mt-1">
            This is the default tax rate that will be applied to all transactions.
          </p>
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h3 className="font-medium mb-2">Category-specific Tax Rates</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Set different tax rates for specific product categories (coming soon).
          </p>
          {/* Placeholder for future category-specific tax rates */}
          <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground">
            Category-specific tax rates will be available in a future update.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxSettings;
