
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { POSSettings, SettingsContextType, defaultSettings } from "@/types/settings";
import { useThemeManager } from "@/hooks/useThemeManager";

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<POSSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Apply theme changes whenever settings are updated
  useThemeManager(settings);

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
