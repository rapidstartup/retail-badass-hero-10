
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TabSettingsProps {
  tabEnabled: boolean;
  setTabEnabled: (value: boolean) => void;
  tabThreshold: number;
  setTabThreshold: (value: number) => void;
}

const TabSettings = ({ 
  tabEnabled, 
  setTabEnabled, 
  tabThreshold, 
  setTabThreshold 
}: TabSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tab System</CardTitle>
        <CardDescription>
          Configure how customer tabs work in your POS.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="tab-enabled">Enable Tab System</Label>
            <p className="text-sm text-muted-foreground">
              Allow customers to run a tab for their purchases.
            </p>
          </div>
          <Switch
            id="tab-enabled"
            checked={tabEnabled}
            onCheckedChange={setTabEnabled}
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="tab-threshold">Tab Threshold ($)</Label>
          <Input
            id="tab-threshold"
            type="number"
            value={tabThreshold}
            onChange={(e) => setTabThreshold(parseFloat(e.target.value))}
            disabled={!tabEnabled}
            min="0"
            step="1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Alert will appear when a customer's tab reaches this amount.
          </p>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="tab-days">Maximum Tab Days</Label>
          <Input
            id="tab-days"
            type="number"
            defaultValue={7}
            disabled={!tabEnabled}
            min="1"
            max="90"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Maximum number of days a tab can remain open.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TabSettings;
