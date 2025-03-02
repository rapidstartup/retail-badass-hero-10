
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
    container: string; // New container color property
  };
  darkModeColors: {
    background: string;
    sidebar: string;
    accent: string;
    text: string;
    accentHover: string;
    sidebarHover: string;
    container: string; // New container color property
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
  theme: "dark",  // Changed from "light" to "dark" as default
  lightModeColors: {
    background: "#ffffff",
    sidebar: "#f8f9fa",
    accent: "#0ea5e9", // Default blue accent
    text: "#1e293b",
    accentHover: "#0284c7",
    sidebarHover: "#f1f5f9",
    container: "#f8fafc", // New default light container color
  },
  darkModeColors: {
    background: "#1e293b",
    sidebar: "#0f172a",
    accent: "#38bdf8", // Slightly lighter blue for dark mode
    text: "#f8fafc",
    accentHover: "#0ea5e9",
    sidebarHover: "#1e293b",
    container: "#1e293b", // New default dark container color
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<POSSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load settings from Supabase on initial render
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        
        // Try to get settings from Supabase
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single();
          
        if (error) {
          console.error("Error fetching settings:", error);
          // Fallback to localStorage if database fetch fails
          const savedSettings = localStorage.getItem("posSettings");
          if (savedSettings) {
            setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
          }
        } else if (data) {
          // Map database settings to our settings object
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
          
          // Try to get theme settings from localStorage (these aren't stored in DB)
          const savedSettings = localStorage.getItem("posSettings");
          if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            // Merge theme settings from localStorage
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

  // Effect to apply theme when settings change
  useEffect(() => {
    // Save theme settings to localStorage whenever they change
    localStorage.setItem("posSettings", JSON.stringify({
      theme: settings.theme,
      lightModeColors: settings.lightModeColors,
      darkModeColors: settings.darkModeColors
    }));
    
    // Apply theme
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
    
    // Apply CSS variables for theming
    const root = document.documentElement;
    
    if (settings.theme === "light") {
      // Light mode colors
      root.style.setProperty("--theme-background-color", settings.lightModeColors.background);
      root.style.setProperty("--theme-sidebar-color", settings.lightModeColors.sidebar);
      root.style.setProperty("--theme-accent-color", settings.lightModeColors.accent);
      root.style.setProperty("--theme-text-color", settings.lightModeColors.text);
      root.style.setProperty("--theme-accent-hover-color", settings.lightModeColors.accentHover);
      root.style.setProperty("--theme-sidebar-hover-color", settings.lightModeColors.sidebarHover);
      root.style.setProperty("--theme-container-color", settings.lightModeColors.container); // New CSS variable
    } else {
      // Dark mode colors
      root.style.setProperty("--theme-background-color", settings.darkModeColors.background);
      root.style.setProperty("--theme-sidebar-color", settings.darkModeColors.sidebar);
      root.style.setProperty("--theme-accent-color", settings.darkModeColors.accent);
      root.style.setProperty("--theme-text-color", settings.darkModeColors.text);
      root.style.setProperty("--theme-accent-hover-color", settings.darkModeColors.accentHover);
      root.style.setProperty("--theme-sidebar-hover-color", settings.darkModeColors.sidebarHover);
      root.style.setProperty("--theme-container-color", settings.darkModeColors.container); // New CSS variable
    }
  }, [settings.theme, settings.lightModeColors, settings.darkModeColors]);

  // Save settings to Supabase
  const saveSettings = async () => {
    if (!settings.id) {
      // If no settings ID exists yet, insert new settings
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
      
      // Update the ID in our state
      setSettings(prev => ({ ...prev, id: data.id }));
      toast.success("Settings saved");
    } else {
      // Update existing settings
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
    
    // Clear any existing save timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    // Set a new timeout for auto-saving to database
    // This debounces the save to prevent excessive database writes
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
