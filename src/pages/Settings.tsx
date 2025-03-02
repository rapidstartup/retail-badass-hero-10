
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/contexts/SettingsContext";

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  
  // Local state for form values
  const [taxRate, setTaxRate] = useState<number>(settings.taxRate);
  const [tabEnabled, setTabEnabled] = useState<boolean>(settings.tabEnabled);
  const [tabThreshold, setTabThreshold] = useState<number>(settings.tabThreshold);
  
  // Sync local state with context when settings change
  useEffect(() => {
    setTaxRate(settings.taxRate);
    setTabEnabled(settings.tabEnabled);
    setTabThreshold(settings.tabThreshold);
  }, [settings]);
  
  const handleSaveSettings = () => {
    // Update the global settings context
    updateSettings({
      taxRate,
      tabEnabled,
      tabThreshold
    });
    
    // Show success notification
    toast.success("Settings saved successfully!");
    
    // Log the updated settings to console for debugging
    console.log("Updated settings:", {
      taxRate,
      tabEnabled,
      tabThreshold,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">System Settings</h1>
          <Button onClick={handleSaveSettings}>Save All Settings</Button>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="tax">Tax Settings</TabsTrigger>
            <TabsTrigger value="tab">Tab System</TabsTrigger>
          </TabsList>
          
          {/* General Settings Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure general system settings for your POS.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input id="store-name" placeholder="Enter your store name" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="store-address">Store Address</Label>
                  <Input id="store-address" placeholder="Enter your store address" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="store-phone">Store Phone</Label>
                  <Input id="store-phone" placeholder="Enter your store phone" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tax Settings Tab */}
          <TabsContent value="tax">
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
          </TabsContent>
          
          {/* Tab System Settings */}
          <TabsContent value="tab">
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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
