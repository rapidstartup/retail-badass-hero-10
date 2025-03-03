
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useSettings } from "@/contexts/SettingsContext";

interface SettingsContainerProps {
  children: React.ReactNode;
  taxRate: number;
  tabEnabled: boolean;
  tabThreshold: number;
  tierThresholdSilver: number;
  tierThresholdGold: number;
  stripeLiveSecretKey: string;
  stripeLivePublicKey: string;
  stripeTestSecretKey: string;
  stripeTestPublicKey: string;
  stripeMode: "live" | "test";
  goHighLevelApiKey: string;
  theme: "light" | "dark";
  lightBackground: string;
  lightSidebar: string;
  lightAccent: string;
  darkBackground: string;
  darkSidebar: string;
  darkAccent: string;
  lightContainer: string;
  darkContainer: string;
  lightSection: string;
  darkSection: string;
  lightSectionSelected: string;
  darkSectionSelected: string;
}

const SettingsContainer: React.FC<SettingsContainerProps> = ({
  children,
  taxRate,
  tabEnabled,
  tabThreshold,
  tierThresholdSilver,
  tierThresholdGold,
  stripeLiveSecretKey,
  stripeLivePublicKey,
  stripeTestSecretKey,
  stripeTestPublicKey,
  stripeMode,
  goHighLevelApiKey,
  theme,
  lightBackground,
  lightSidebar,
  lightAccent,
  darkBackground,
  darkSidebar,
  darkAccent,
  lightContainer,
  darkContainer,
  lightSection,
  darkSection,
  lightSectionSelected,
  darkSectionSelected,
}) => {
  const { updateSettings } = useSettings();
  
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
      tierThresholdSilver,
      tierThresholdGold,
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
        sidebarHover: lightSidebarHover,
        container: lightContainer,
        section: lightSection,
        sectionSelected: lightSectionSelected
      },
      darkModeColors: {
        background: darkBackground,
        sidebar: darkSidebar,
        accent: darkAccent,
        text: darkText,
        accentHover: darkAccentHover,
        sidebarHover: darkSidebarHover,
        container: darkContainer,
        section: darkSection,
        sectionSelected: darkSectionSelected
      }
    });
    
    // Show success notification
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <Button onClick={handleSaveSettings}>Save All Settings</Button>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-7 theme-section-bg">
          <TabsTrigger value="general" className="data-[state=active]:theme-section-selected-bg">General</TabsTrigger>
          <TabsTrigger value="tax" className="data-[state=active]:theme-section-selected-bg">Tax Settings</TabsTrigger>
          <TabsTrigger value="tab" className="data-[state=active]:theme-section-selected-bg">Tab System</TabsTrigger>
          <TabsTrigger value="tiers" className="data-[state=active]:theme-section-selected-bg">Customer Tiers</TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:theme-section-selected-bg">Integrations</TabsTrigger>
          <TabsTrigger value="design" className="data-[state=active]:theme-section-selected-bg">Design</TabsTrigger>
          <TabsTrigger value="staff" className="data-[state=active]:theme-section-selected-bg">Staff</TabsTrigger>
        </TabsList>
        
        {children}
      </Tabs>
    </div>
  );
};

export default SettingsContainer;
