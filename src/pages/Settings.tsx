
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { TabsContent } from "@/components/ui/tabs";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

// Import refactored components
import GeneralSettings from "@/components/settings/GeneralSettings";
import TaxSettings from "@/components/settings/TaxSettings";
import TabSettings from "@/components/settings/TabSettings";
import IntegrationSettings from "@/components/settings/IntegrationSettings";
import DesignSettings from "@/components/settings/DesignSettings";
import StaffSettings from "@/components/settings/StaffSettings";
import SettingsContainer from "@/components/settings/SettingsContainer";

const Settings = () => {
  const { settings } = useSettings();
  const { isAuthenticated, loading } = useAuth();
  
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

  // Redirect to login page if not authenticated
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <SettingsContainer
        taxRate={taxRate}
        tabEnabled={tabEnabled}
        tabThreshold={tabThreshold}
        stripeLiveSecretKey={stripeLiveSecretKey}
        stripeLivePublicKey={stripeLivePublicKey}
        stripeTestSecretKey={stripeTestSecretKey}
        stripeTestPublicKey={stripeTestPublicKey}
        stripeMode={stripeMode}
        goHighLevelApiKey={goHighLevelApiKey}
        theme={theme}
        lightBackground={lightBackground}
        lightSidebar={lightSidebar}
        lightAccent={lightAccent}
        darkBackground={darkBackground}
        darkSidebar={darkSidebar}
        darkAccent={darkAccent}
      >
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
        
        {/* Staff Tab */}
        <TabsContent value="staff">
          <StaffSettings />
        </TabsContent>
      </SettingsContainer>
    </Layout>
  );
};

export default Settings;
