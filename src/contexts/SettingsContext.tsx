import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface POSSettings {
  id?: string;
  taxRate: number;
  tabEnabled: boolean;
  tabThreshold: number;
  tabMaxDays: number;
  // Store Information
  storeName: string;
  storeAddress?: string;
  storePhone?: string;
  // Stripe Integration
  stripeLiveSecretKey?: string;
  stripeLivePublicKey?: string;
  stripeTestSecretKey?: string;
  stripeTestPublicKey?: string;
  stripeMode?: "live" | "test";
  // GoHighLevel Integration
  goHighLevelApiKey?: string;
  // Theme Settings
  theme: "light" | "dark";
  lightModeColors: {
    background: string;
    sidebar: string;
    accent: string;
    text: string;
    accentHover: string;
    sidebarHover: string;
    container: string;
    section: string;
    sectionSelected: string;
  };
  darkModeColors: {
    background: string;
    sidebar: string;
    accent: string;
    text: string;
    accentHover: string;
    sidebarHover: string;
    container: string;
    section: string;
    sectionSelected: string;
  };
}

interface SettingsContextType {
  settings: POSSettings;
  updateSettings: (newSettings: Partial<POSSettings>) => Promise<void>;
  isLoading: boolean;
  saveSettings: () => Promise<void>;
}

const defaultSettings: POSSettings = {
  taxRate: 8.0,
  tabEnabled: true,
  tabThreshold: 100,
  tabMaxDays: 7,
  storeName: "NextPOS",
  stripeMode: "test",
  theme: "dark",
  lightModeColors: {
    background: "#ffffff",
    sidebar: "#f0f4f8",
    accent: "#3b82f6",
    text: "#1e293b",
    accentHover: "#2563eb",
    sidebarHover: "#e0e7ff",
    container: "#f9fafb",
    section: "#f1f5f9",
    sectionSelected: "#e2e8f0",
  },
  darkModeColors: {
    background: "#0f172a",
    sidebar: "#1e293b",
    accent: "#60a5fa",
    text: "#f8fafc",
    accentHover: "#3b82f6",
    sidebarHover: "#334155",
    container: "#1e293b",
    section: "#1e293b",
    sectionSelected: "#0f172a",
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<POSSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single();
          
        if (error) {
          console.error("Error fetching settings:", error);
          const savedSettings = localStorage.getItem("posSettings");
          if (savedSettings) {
            setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
          }
        } else if (data) {
          const dbSettings: POSSettings = {
            ...defaultSettings,
            id: data.id,
            taxRate: data.tax_rate,
            tabEnabled: data.tab_enabled,
            tabThreshold: data.tab_threshold,
            tabMaxDays: data.tab_max_days,
            storeName: data.store_name || defaultSettings.storeName,
            storeAddress: data.store_address,
            storePhone: data.store_phone,
          };
          
          const savedSettings = localStorage.getItem("posSettings");
          if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            dbSettings.theme = parsedSettings.theme || defaultSettings.theme;
            dbSettings.lightModeColors = parsedSettings.lightModeColors || defaultSettings.lightModeColors;
            dbSettings.darkModeColors = parsedSettings.darkModeColors || defaultSettings.darkModeColors;
          }
          
          setSettings(dbSettings);
        }
      } catch (error) {
        console.error("Unexpected error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem("posSettings", JSON.stringify({
      theme: settings.theme,
      lightModeColors: settings.lightModeColors,
      darkModeColors: settings.darkModeColors
    }));
    
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
    
    const root = document.documentElement;
    
    if (settings.theme === "light") {
      root.style.setProperty("--theme-background-color", settings.lightModeColors.background);
      root.style.setProperty("--theme-sidebar-color", settings.lightModeColors.sidebar);
      root.style.setProperty("--theme-accent-color", settings.lightModeColors.accent);
      root.style.setProperty("--theme-text-color", settings.lightModeColors.text);
      root.style.setProperty("--theme-accent-hover-color", settings.lightModeColors.accentHover);
      root.style.setProperty("--theme-sidebar-hover-color", settings.lightModeColors.sidebarHover);
      root.style.setProperty("--theme-container-color", settings.lightModeColors.container);
      root.style.setProperty("--theme-section-color", settings.lightModeColors.section);
      root.style.setProperty("--theme-section-selected-color", settings.lightModeColors.sectionSelected);
    } else {
      root.style.setProperty("--theme-background-color", settings.darkModeColors.background);
      root.style.setProperty("--theme-sidebar-color", settings.darkModeColors.sidebar);
      root.style.setProperty("--theme-accent-color", settings.darkModeColors.accent);
      root.style.setProperty("--theme-text-color", settings.darkModeColors.text);
      root.style.setProperty("--theme-accent-hover-color", settings.darkModeColors.accentHover);
      root.style.setProperty("--theme-sidebar-hover-color", settings.darkModeColors.sidebarHover);
      root.style.setProperty("--theme-container-color", settings.darkModeColors.container);
      root.style.setProperty("--theme-section-color", settings.darkModeColors.section);
      root.style.setProperty("--theme-section-selected-color", settings.darkModeColors.sectionSelected);
    }
  }, [settings.theme, settings.lightModeColors, settings.darkModeColors]);

  const saveSettings = async () => {
    if (!settings.id) {
      const { data, error } = await supabase
        .from('settings')
        .insert({
          tax_rate: settings.taxRate,
          tab_enabled: settings.tabEnabled,
          tab_threshold: settings.tabThreshold,
          tab_max_days: settings.tabMaxDays,
          store_name: settings.storeName,
          store_address: settings.storeAddress,
          store_phone: settings.storePhone,
        })
        .select('*')
        .single();
        
      if (error) {
        toast.error("Failed to save settings");
        console.error("Error saving settings:", error);
        return;
      }
      
      setSettings(prev => ({ ...prev, id: data.id }));
      toast.success("Settings saved");
    } else {
      const { error } = await supabase
        .from('settings')
        .update({
          tax_rate: settings.taxRate,
          tab_enabled: settings.tabEnabled,
          tab_threshold: settings.tabThreshold,
          tab_max_days: settings.tabMaxDays,
          store_name: settings.storeName,
          store_address: settings.storeAddress,
          store_phone: settings.storePhone,
        })
        .eq('id', settings.id);
        
      if (error) {
        toast.error("Failed to save settings");
        console.error("Error updating settings:", error);
        return;
      }
      
      toast.success("Settings saved");
    }
  };

  const updateSettings = async (newSettings: Partial<POSSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    const timeout = setTimeout(saveSettings, 1000);
    setSaveTimeout(timeout);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
