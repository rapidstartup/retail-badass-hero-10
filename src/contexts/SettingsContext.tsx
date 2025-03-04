
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
            tabAutoClosePolicy: data.tab_auto_close_policy as "manual" | "daily" | "weekly" | "threshold" || defaultSettings.tabAutoClosePolicy,
            tabCustomerEligibility: data.tab_customer_eligibility as "all" | "registered" | "approved" || defaultSettings.tabCustomerEligibility,
            tabNotifications: data.tab_notifications !== null ? data.tab_notifications : defaultSettings.tabNotifications,
            storeName: data.store_name || defaultSettings.storeName,
            storeAddress: data.store_address,
            storePhone: data.store_phone,
            tierThresholdSilver: data.tier_threshold_silver || defaultSettings.tierThresholdSilver,
            tierThresholdGold: data.tier_threshold_gold || defaultSettings.tierThresholdGold,
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
    try {
      // Save to localStorage for theme settings
      localStorage.setItem("posSettings", JSON.stringify(settings));
      
      if (!settings.id) {
        const { data, error } = await supabase
          .from('settings')
          .insert({
            tax_rate: settings.taxRate,
            tab_enabled: settings.tabEnabled,
            tab_threshold: settings.tabThreshold,
            tab_max_days: settings.tabMaxDays,
            tab_auto_close_policy: settings.tabAutoClosePolicy,
            tab_customer_eligibility: settings.tabCustomerEligibility,
            tab_notifications: settings.tabNotifications,
            store_name: settings.storeName,
            store_address: settings.storeAddress,
            store_phone: settings.storePhone,
            tier_threshold_silver: settings.tierThresholdSilver,
            tier_threshold_gold: settings.tierThresholdGold,
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
            tab_auto_close_policy: settings.tabAutoClosePolicy,
            tab_customer_eligibility: settings.tabCustomerEligibility,
            tab_notifications: settings.tabNotifications,
            store_name: settings.storeName,
            store_address: settings.storeAddress,
            store_phone: settings.storePhone,
            tier_threshold_silver: settings.tierThresholdSilver,
            tier_threshold_gold: settings.tierThresholdGold,
          })
          .eq('id', settings.id);
          
        if (error) {
          toast.error("Failed to save settings");
          console.error("Error updating settings:", error);
          return;
        }
        
        toast.success("Settings saved");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Unexpected error saving settings:", error);
    }
  };

  const updateSettings = async (newSettings: Partial<POSSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    // Save the updated settings to localStorage for immediate theme changes
    localStorage.setItem("posSettings", JSON.stringify({
      ...settings,
      ...newSettings
    }));
    
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
