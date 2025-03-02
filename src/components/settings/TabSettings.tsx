
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import POSNumpad from "@/components/pos/POSNumpad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabSettingsProps {
  tabEnabled: boolean;
  setTabEnabled: (enabled: boolean) => void;
  tabThreshold: number;
  setTabThreshold: (threshold: number) => void;
}

const TabSettings: React.FC<TabSettingsProps> = ({
  tabEnabled,
  setTabEnabled,
  tabThreshold,
  setTabThreshold,
}) => {
  const [inputMode, setInputMode] = useState<"standard" | "numpad">("standard");
  
  const handleThresholdChange = (value: string) => {
    if (value === "") {
      setTabThreshold(0);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setTabThreshold(numValue);
      }
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tab System Settings</CardTitle>
        <CardDescription>
          Configure how customer tabs work in your POS system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="tabEnabled" className="flex flex-col space-y-1">
            <span>Enable Tab System</span>
            <span className="font-normal text-sm text-muted-foreground">
              Allow customers to run a tab for later payment
            </span>
          </Label>
          <Switch
            id="tabEnabled"
            checked={tabEnabled}
            onCheckedChange={setTabEnabled}
          />
        </div>
        
        {tabEnabled && (
          <Tabs defaultValue={inputMode} onValueChange={(value) => setInputMode(value as "standard" | "numpad")}>
            <TabsList className="mb-4">
              <TabsTrigger value="standard">Standard Input</TabsTrigger>
              <TabsTrigger value="numpad">Numpad Input</TabsTrigger>
            </TabsList>
            
            <TabsContent value="standard">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tabThreshold">Tab Threshold ($)</Label>
                  <Input
                    id="tabThreshold"
                    type="number"
                    value={tabThreshold}
                    onChange={(e) => setTabThreshold(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="5"
                  />
                  <p className="text-sm text-muted-foreground">
                    Alert staff when a tab exceeds this amount
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="numpad">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tabThresholdNumpad">Tab Threshold ($)</Label>
                  <div className="flex items-center">
                    <div className="text-2xl font-medium p-2 bg-muted/30 rounded-md w-full text-right">
                      ${tabThreshold.toFixed(2)}
                    </div>
                  </div>
                  <POSNumpad 
                    initialValue={tabThreshold.toString()}
                    onValueChange={handleThresholdChange}
                    hideItemName={true}
                  />
                  <p className="text-sm text-muted-foreground">
                    Alert staff when a tab exceeds this amount
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tab System Benefits</h3>
          <p className="text-sm text-muted-foreground">
            The tab system allows customers to:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Order multiple items over time</li>
            <li>Settle their bill at the end of their visit</li>
            <li>Have multiple people contribute to a single tab</li>
            <li>Receive detailed receipts of all purchases</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TabSettings;
