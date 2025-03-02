
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/contexts/SettingsContext";

// Import refactored components
import GeneralSettings from "@/components/settings/GeneralSettings";
import TaxSettings from "@/components/settings/TaxSettings";
import TabSettings from "@/components/settings/TabSettings";
import IntegrationSettings from "@/components/settings/IntegrationSettings";
import DesignSettings from "@/components/settings/DesignSettings";

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
  const [lightSidebar, setLightSidebar] = useState<string>(settings.lightModeColors.sidebar);
  const [lightAccent, setLightAccent] = useState<string>(settings.lightModeColors.accent);
  const [darkBackground, setDarkBackground] = useState<string>(settings.darkModeColors.background);
  const [darkSidebar, setDarkSidebar] = useState<string>(settings.darkModeColors.sidebar);
  const [darkAccent, setDarkAccent] = useState<string>(settings.darkModeColors.accent);
  
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
    setLightSidebar(settings.lightModeColors.sidebar);
    setLightAccent(settings.lightModeColors.accent);
    setDarkBackground(settings.darkModeColors.background);
    setDarkSidebar(settings.darkModeColors.sidebar);
    setDarkAccent(settings.darkModeColors.accent);
  }, [settings]);
  
  const handleSaveSettings = () => {
    // Define hover and text colors
    const lightText = "#1e293b";
    const lightAccentHover = "#0284c7";
    const lightSidebarHover = "#f1f5f9";
    
    const darkText = "#f8fafc";
    const darkAccentHover = "#0ea5e9";
    const darkSidebarHover = "#1e293b";
  
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
        sidebar: lightSidebar,
        accent: lightAccent,
        text: lightText,
        accentHover: lightAccentHover,
        sidebarHover: lightSidebarHover
      },
      darkModeColors: {
        background: darkBackground,
        sidebar: darkSidebar,
        accent: darkAccent,
        text: darkText,
        accentHover: darkAccentHover,
        sidebarHover: darkSidebarHover
      }
    });
    
    // Show success notification
    toast.success("Settings saved successfully!");
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
            <GeneralSettings />
          </TabsContent>
          
          {/* Tax Settings Tab */}
          <TabsContent value="tax">
            <TaxSettings 
              taxRate={taxRate}
              setTaxRate={setTaxRate}
            />
          </TabsContent>
          
          {/* Tab System Settings */}
          <TabsContent value="tab">
            <TabSettings 
              tabEnabled={tabEnabled}
              setTabEnabled={setTabEnabled}
              tabThreshold={tabThreshold}
              setTabThreshold={setTabThreshold}
            />
          </TabsContent>
          
          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <IntegrationSettings 
              stripeLiveSecretKey={stripeLiveSecretKey}
              setStripeLiveSecretKey={setStripeLiveSecretKey}
              stripeLivePublicKey={stripeLivePublicKey}
              setStripeLivePublicKey={setStripeLivePublicKey}
              stripeTestSecretKey={stripeTestSecretKey}
              setStripeTestSecretKey={setStripeTestSecretKey}
              stripeTestPublicKey={stripeTestPublicKey}
              setStripeTestPublicKey={setStripeTestPublicKey}
              stripeMode={stripeMode}
              setStripeMode={setStripeMode}
              goHighLevelApiKey={goHighLevelApiKey}
              setGoHighLevelApiKey={setGoHighLevelApiKey}
            />
          </TabsContent>
          
          {/* Design Tab */}
          <TabsContent value="design">
            <DesignSettings 
              theme={theme}
              setTheme={setTheme}
              lightBackground={lightBackground}
              setLightBackground={setLightBackground}
              lightSidebar={lightSidebar}
              setLightSidebar={setLightSidebar}
              lightAccent={lightAccent}
              setLightAccent={setLightAccent}
              darkBackground={darkBackground}
              setDarkBackground={setDarkBackground}
              darkSidebar={darkSidebar}
              setDarkSidebar={setDarkSidebar}
              darkAccent={darkAccent}
              setDarkAccent={setDarkAccent}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
