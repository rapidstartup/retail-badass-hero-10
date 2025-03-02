
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSettings } from "@/contexts/SettingsContext";

interface TabSettingsProps {
  tabEnabled: boolean;
  setTabEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  tabThreshold: number;
  setTabThreshold: React.Dispatch<React.SetStateAction<number>>;
}

const TabSettings: React.FC<TabSettingsProps> = ({ 
  tabEnabled, 
  setTabEnabled, 
  tabThreshold, 
  setTabThreshold 
}) => {
  const { updateSettings } = useSettings();
  
  const handleThresholdChange = (value: string) => {
    const numValue = parseInt(value, 10);
    setTabThreshold(isNaN(numValue) ? 0 : numValue);
  };
  
  const handleSave = async () => {
    try {
      await updateSettings({ tabEnabled, tabThreshold });
      toast.success("Tab settings updated");
    } catch (error) {
      toast.error("Failed to update tab settings");
      console.error("Error updating tab settings:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tab System</CardTitle>
        <CardDescription>
          Configure tab system settings for customer accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="tab-enabled">Enable Tab System</Label>
            <p className="text-sm text-muted-foreground">
              Allow customers to create tabs for future payment
            </p>
          </div>
          <Switch
            id="tab-enabled"
            checked={tabEnabled}
            onCheckedChange={setTabEnabled}
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="tab-threshold">Tab Threshold Limit ($)</Label>
          <Input
            id="tab-threshold"
            type="number"
            value={tabThreshold}
            onChange={(e) => handleThresholdChange(e.target.value)}
            min="0"
            step="10"
            disabled={!tabEnabled}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Maximum amount allowed for a customer tab
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>
          Save Tab Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TabSettings;
