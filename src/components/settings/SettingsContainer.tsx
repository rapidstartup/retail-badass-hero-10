
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
}

const SettingsContainer: React.FC<SettingsContainerProps> = ({
  children,
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
  lightBackground,
  lightSidebar,
  lightAccent,
  darkBackground,
  darkSidebar,
  darkAccent,
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
    <div className="w-full max-w-4xl mx-auto px-3 py-2 space-y-3">
      <div className="flex flex-row justify-between items-center gap-2">
        <h1 className="text-xl font-bold">System Settings</h1>
        <Button size="sm" onClick={handleSaveSettings}>Save All Settings</Button>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-1 mb-2">
          <TabsTrigger value="general" className="text-sm py-1 px-2">General</TabsTrigger>
          <TabsTrigger value="tax" className="text-sm py-1 px-2">Tax Settings</TabsTrigger>
          <TabsTrigger value="tab" className="text-sm py-1 px-2">Tab System</TabsTrigger>
          <TabsTrigger value="integrations" className="text-sm py-1 px-2">Integrations</TabsTrigger>
          <TabsTrigger value="design" className="text-sm py-1 px-2">Design</TabsTrigger>
          <TabsTrigger value="staff" className="text-sm py-1 px-2">Staff</TabsTrigger>
        </TabsList>
        
        <div className="bg-card rounded-md border border-border p-3 shadow-sm">
          {children}
        </div>
      </Tabs>
    </div>
  );
};

export default SettingsContainer;
