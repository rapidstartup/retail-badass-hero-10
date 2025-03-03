
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface CustomerTierSettingsProps {
  tierThresholdSilver: number;
  setTierThresholdSilver: (value: number) => void;
  tierThresholdGold: number;
  setTierThresholdGold: (value: number) => void;
}

const CustomerTierSettings: React.FC<CustomerTierSettingsProps> = ({
  tierThresholdSilver,
  setTierThresholdSilver,
  tierThresholdGold,
  setTierThresholdGold,
}) => {
  const handleSilverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTierThresholdSilver(isNaN(value) ? 0 : value);
  };

  const handleGoldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTierThresholdGold(isNaN(value) ? 0 : value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Tier Settings</CardTitle>
        <CardDescription>
          Set spending thresholds for customer tier progression
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          <Badge variant="secondary">Bronze</Badge>
          <span className="text-sm">Default tier - No minimum spend required</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Silver</Badge>
              <Label htmlFor="tierThresholdSilver">Minimum Spend Threshold ($)</Label>
            </div>
            <Input
              id="tierThresholdSilver"
              type="number"
              min="0"
              step="10"
              value={tierThresholdSilver}
              onChange={handleSilverChange}
            />
            <p className="text-xs text-gray-500">
              Customers will reach Silver tier when their total spend reaches this amount
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge className="bg-theme-accent text-white">Gold</Badge>
              <Label htmlFor="tierThresholdGold">Minimum Spend Threshold ($)</Label>
            </div>
            <Input
              id="tierThresholdGold"
              type="number"
              min="0"
              step="100"
              value={tierThresholdGold}
              onChange={handleGoldChange}
            />
            <p className="text-xs text-gray-500">
              Customers will reach Gold tier when their total spend reaches this amount
            </p>
          </div>
        </div>
        
        {tierThresholdGold <= tierThresholdSilver && (
          <div className="text-red-500 text-sm mt-2">
            Gold threshold should be higher than Silver threshold
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerTierSettings;
