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
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  
  // Local state for form values
  const [taxRate, setTaxRate] = useState<number>(settings.taxRate);
  const [tabEnabled, setTabEnabled] = useState<boolean>(settings.tabEnabled);
  const [tabThreshold, setTabThreshold] = useState<number>(settings.tabThreshold);
  
  // Stripe API integration fields
  const [stripeLiveSecretKey, setStripeLiveSecretKey] = useState<string>("");
  const [stripeLivePublicKey, setStripeLivePublicKey] = useState<string>("");
  const [stripeTestSecretKey, setStripeTestSecretKey] = useState<string>("");
  const [stripeTestPublicKey, setStripeTestPublicKey] = useState<string>("");
  const [stripeMode, setStripeMode] = useState<"live" | "test">("test");
  
  // GoHighLevel integration field
  const [goHighLevelApiKey, setGoHighLevelApiKey] = useState<string>("");
  
  // Theme settings
  const [theme, setTheme] = useState<"light" | "dark">(settings.theme);
  const [lightBackground, setLightBackground] = useState<string>(settings.lightModeColors.background);
  const [lightAccent, setLightAccent] = useState<string>(settings.lightModeColors.accent);
  const [darkBackground, setDarkBackground] = useState<string>(settings.darkModeColors.background);
  const [darkAccent, setDarkAccent] = useState<string>(settings.darkModeColors.accent);
  
  // Password visibility toggles
  const [showLiveSecretKey, setShowLiveSecretKey] = useState<boolean>(false);
  const [showTestSecretKey, setShowTestSecretKey] = useState<boolean>(false);
  const [showGoHighLevelKey, setShowGoHighLevelKey] = useState<boolean>(false);
  
  // Sync local state with context when settings change
  useEffect(() => {
    setTaxRate(settings.taxRate);
    setTabEnabled(settings.tabEnabled);
    setTabThreshold(settings.tabThreshold);
    
    // If we have these settings stored, load them
    if (settings.stripeLiveSecretKey) setStripeLiveSecretKey(settings.stripeLiveSecretKey);
    if (settings.stripeLivePublicKey) setStripeLivePublicKey(settings.stripeLivePublicKey);
    if (settings.stripeTestSecretKey) setStripeTestSecretKey(settings.stripeTestSecretKey);
    if (settings.stripeTestPublicKey) setStripeTestPublicKey(settings.stripeTestPublicKey);
    if (settings.stripeMode) setStripeMode(settings.stripeMode);
    if (settings.goHighLevelApiKey) setGoHighLevelApiKey(settings.goHighLevelApiKey);
    
    // Theme settings
    setTheme(settings.theme);
    setLightBackground(settings.lightModeColors.background);
    setLightAccent(settings.lightModeColors.accent);
    setDarkBackground(settings.darkModeColors.background);
    setDarkAccent(settings.darkModeColors.accent);
  }, [settings]);
  
  const handleSaveSettings = () => {
    // Update the global settings context
    updateSettings({
      taxRate,
      tabEnabled,
      tabThreshold,
      stripeLiveSecretKey,
      stripeLivePublicKey,
      stripeTestSecretKey,
      stripeTestPublicKey,
      stripeMode,
      goHighLevelApiKey,
      theme,
      lightModeColors: {
        background: lightBackground,
        accent: lightAccent
      },
      darkModeColors: {
        background: darkBackground,
        accent: darkAccent
      }
    });
    
    // Show success notification
    toast.success("Settings saved successfully!");
  };

  // Toggle function for password visibility
  const toggleKeyVisibility = (
    field: "liveSK" | "testSK" | "goHighLevel"
  ) => {
    if (field === "liveSK") setShowLiveSecretKey(!showLiveSecretKey);
    else if (field === "testSK") setShowTestSecretKey(!showTestSecretKey);
    else if (field === "goHighLevel") setShowGoHighLevelKey(!showGoHighLevelKey);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">System Settings</h1>
          <Button onClick={handleSaveSettings}>Save All Settings</Button>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="tax">Tax Settings</TabsTrigger>
            <TabsTrigger value="tab">Tab System</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
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
          
          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Stripe Integration</CardTitle>
                <CardDescription>
                  Configure your Stripe payment processing integration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="stripe-mode">Stripe Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Select Live mode for production, Test mode for development.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={stripeMode === "test" ? "font-medium" : "text-muted-foreground"}>Test</span>
                    <Switch
                      id="stripe-mode"
                      checked={stripeMode === "live"}
                      onCheckedChange={(checked) => setStripeMode(checked ? "live" : "test")}
                    />
                    <span className={stripeMode === "live" ? "font-medium" : "text-muted-foreground"}>Live</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-6">
                  <h3 className="font-medium text-lg">Live Mode API Keys</h3>
                  <div className="space-y-1">
                    <Label htmlFor="stripe-live-sk">Secret Key (SK)</Label>
                    <div className="relative">
                      <Input
                        id="stripe-live-sk"
                        value={stripeLiveSecretKey}
                        onChange={(e) => setStripeLiveSecretKey(e.target.value)}
                        type={showLiveSecretKey ? "text" : "password"}
                        className="pr-10"
                        placeholder="sk_live_..."
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => toggleKeyVisibility("liveSK")}
                      >
                        {showLiveSecretKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your Stripe Live mode Secret Key.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="stripe-live-pk">Publishable Key (PK)</Label>
                    <Input
                      id="stripe-live-pk"
                      value={stripeLivePublicKey}
                      onChange={(e) => setStripeLivePublicKey(e.target.value)}
                      placeholder="pk_live_..."
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Your Stripe Live mode Publishable Key.
                    </p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-6">
                  <h3 className="font-medium text-lg">Test Mode API Keys</h3>
                  <div className="space-y-1">
                    <Label htmlFor="stripe-test-sk">Secret Key (SK)</Label>
                    <div className="relative">
                      <Input
                        id="stripe-test-sk"
                        value={stripeTestSecretKey}
                        onChange={(e) => setStripeTestSecretKey(e.target.value)}
                        type={showTestSecretKey ? "text" : "password"}
                        className="pr-10"
                        placeholder="sk_test_..."
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => toggleKeyVisibility("testSK")}
                      >
                        {showTestSecretKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your Stripe Test mode Secret Key.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="stripe-test-pk">Publishable Key (PK)</Label>
                    <Input
                      id="stripe-test-pk"
                      value={stripeTestPublicKey}
                      onChange={(e) => setStripeTestPublicKey(e.target.value)}
                      placeholder="pk_test_..."
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Your Stripe Test mode Publishable Key.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>GoHighLevel Integration</CardTitle>
                <CardDescription>
                  Configure GoHighLevel CRM integration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="gohighlevel-api-key">API Key</Label>
                  <div className="relative">
                    <Input
                      id="gohighlevel-api-key"
                      value={goHighLevelApiKey}
                      onChange={(e) => setGoHighLevelApiKey(e.target.value)}
                      type={showGoHighLevelKey ? "text" : "password"}
                      className="pr-10"
                      placeholder="Enter your GoHighLevel API key"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => toggleKeyVisibility("goHighLevel")}
                    >
                      {showGoHighLevelKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your GoHighLevel API key for connecting your POS to the CRM.
                  </p>
                </div>
                
                <div className="p-4 bg-muted/20 rounded-md mt-4">
                  <h3 className="font-medium mb-2">Integration Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {goHighLevelApiKey 
                      ? "GoHighLevel integration is configured. Save to apply changes."
                      : "GoHighLevel integration is not configured yet."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* New Design Tab */}
          <TabsContent value="design">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>
                  Customize the appearance of your POS system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="theme-mode">Theme Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Select light or dark mode for your POS interface.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun size={20} className={theme === "light" ? "text-orange-400" : "text-muted-foreground"} />
                    <Switch
                      id="theme-mode"
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                    <Moon size={20} className={theme === "dark" ? "text-blue-400" : "text-muted-foreground"} />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Light Mode Colors */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Light Mode Colors</h3>
                    <ColorPicker 
                      label="Background Color" 
                      value={lightBackground}
                      onChange={setLightBackground}
                    />
                    <ColorPicker 
                      label="Accent Color" 
                      value={lightAccent}
                      onChange={setLightAccent}
                    />
                    
                    {/* Preview */}
                    <div className="mt-4 border rounded-md overflow-hidden">
                      <div className="text-sm font-medium p-2 bg-muted">Light Mode Preview</div>
                      <div 
                        className="p-4 flex flex-col items-center gap-2"
                        style={{ backgroundColor: lightBackground }}
                      >
                        <span className="text-sm">Sample Text</span>
                        <Button
                          size="sm"
                          style={{ backgroundColor: lightAccent }}
                        >
                          Sample Button
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dark Mode Colors */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Dark Mode Colors</h3>
                    <ColorPicker 
                      label="Background Color" 
                      value={darkBackground}
                      onChange={setDarkBackground}
                    />
                    <ColorPicker 
                      label="Accent Color" 
                      value={darkAccent}
                      onChange={setDarkAccent}
                    />
                    
                    {/* Preview */}
                    <div className="mt-4 border rounded-md overflow-hidden">
                      <div className="text-sm font-medium p-2 bg-muted">Dark Mode Preview</div>
                      <div 
                        className="p-4 flex flex-col items-center gap-2"
                        style={{ backgroundColor: darkBackground, color: "#ffffff" }}
                      >
                        <span className="text-sm">Sample Text</span>
                        <Button
                          size="sm"
                          style={{ backgroundColor: darkAccent }}
                        >
                          Sample Button
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md mt-6">
                  <h3 className="font-medium mb-2">Theme Usage</h3>
                  <p className="text-sm text-muted-foreground">
                    These color settings will be applied throughout the POS system. 
                    Click "Save All Settings" to apply your changes.
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
