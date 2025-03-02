
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import POSNumpad from "@/components/pos/POSNumpad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaxSettingsProps {
  taxRate: number;
  setTaxRate: (rate: number) => void;
}

const TaxSettings: React.FC<TaxSettingsProps> = ({ taxRate, setTaxRate }) => {
  const [showNumpad, setShowNumpad] = useState(false);
  const [inputMode, setInputMode] = useState<"standard" | "numpad">("standard");
  
  const handleValueChange = (value: string) => {
    if (value === "") {
      setTaxRate(0);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setTaxRate(numValue);
      }
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Settings</CardTitle>
        <CardDescription>
          Configure tax rates for your transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue={inputMode} onValueChange={(value) => setInputMode(value as "standard" | "numpad")}>
          <TabsList className="mb-4">
            <TabsTrigger value="standard">Standard Input</TabsTrigger>
            <TabsTrigger value="numpad">Numpad Input</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Sales Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <p className="text-sm text-muted-foreground">
                  This is the default tax rate applied to all transactions
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="numpad">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxRateNumpad">Sales Tax Rate (%)</Label>
                <div className="flex items-center">
                  <div className="text-2xl font-medium p-2 bg-muted/30 rounded-md w-full text-right">
                    {taxRate}%
                  </div>
                </div>
                <POSNumpad 
                  initialValue={taxRate.toString()}
                  isPercentage={true}
                  onValueChange={handleValueChange}
                  hideItemName={true}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Future Enhancements</h3>
          <p className="text-sm text-muted-foreground">
            In future updates, you'll be able to configure:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Product-specific tax rates</li>
            <li>Regional tax rules</li>
            <li>Tax exemptions</li>
            <li>Multiple tax categories</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxSettings;
