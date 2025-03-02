
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";

const TabSettings = () => {
  const { settings, updateSettings, saveSettings } = useSettings();
  const [tabEnabled, setTabEnabled] = useState(settings.tabEnabled);
  const [tabThreshold, setTabThreshold] = useState(settings.tabThreshold);
  const [tabMaxDays, setTabMaxDays] = useState(settings.tabMaxDays);
  
  // Update local state when settings change
  useEffect(() => {
    setTabEnabled(settings.tabEnabled);
    setTabThreshold(settings.tabThreshold);
    setTabMaxDays(settings.tabMaxDays);
  }, [settings.tabEnabled, settings.tabThreshold, settings.tabMaxDays]);
  
  const handleSave = async () => {
    try {
      await updateSettings({ 
        tabEnabled, 
        tabThreshold, 
        tabMaxDays 
      });
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
            onChange={(e) => setTabThreshold(parseFloat(e.target.value) || 0)}
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
            value={tabMaxDays}
            onChange={(e) => setTabMaxDays(parseInt(e.target.value) || 7)}
            disabled={!tabEnabled}
            min="1"
            max="90"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Maximum number of days a tab can remain open.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={!tabEnabled}>
          Save Tab Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TabSettings;
