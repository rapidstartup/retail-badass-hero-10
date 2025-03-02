
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface POSSettings {
  taxRate: number;
  tabEnabled: boolean;
  tabThreshold: number;
  // Store Information
  storeName?: string;
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
  };
  darkModeColors: {
    background: string;
    sidebar: string;
    accent: string;
    text: string;
    accentHover: string;
    sidebarHover: string;
  };
}

interface SettingsContextType {
  settings: POSSettings;
  updateSettings: (newSettings: Partial<POSSettings>) => void;
}

const defaultSettings: POSSettings = {
  taxRate: 8.0,
  tabEnabled: true,
  tabThreshold: 100,
  storeName: "NextPOS",
  stripeMode: "test",
  theme: "light",
  lightModeColors: {
    background: "#ffffff",
    sidebar: "#f8f9fa",
    accent: "#0ea5e9", // Default blue accent
    text: "#1e293b",
    accentHover: "#0284c7",
    sidebarHover: "#f1f5f9",
  },
  darkModeColors: {
    background: "#1e293b",
    sidebar: "#0f172a",
    accent: "#38bdf8", // Slightly lighter blue for dark mode
    text: "#f8fafc",
    accentHover: "#0ea5e9",
    sidebarHover: "#1e293b",
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<POSSettings>(() => {
    // Try to load settings from localStorage on initial render
    const savedSettings = localStorage.getItem("posSettings");
    return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
  });

  // Effect to apply theme when settings change
  useEffect(() => {
    // Save settings to localStorage whenever they change
    localStorage.setItem("posSettings", JSON.stringify(settings));
    
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
    } else {
      // Dark mode colors
      root.style.setProperty("--theme-background-color", settings.darkModeColors.background);
      root.style.setProperty("--theme-sidebar-color", settings.darkModeColors.sidebar);
      root.style.setProperty("--theme-accent-color", settings.darkModeColors.accent);
      root.style.setProperty("--theme-text-color", settings.darkModeColors.text);
      root.style.setProperty("--theme-accent-hover-color", settings.darkModeColors.accentHover);
      root.style.setProperty("--theme-sidebar-hover-color", settings.darkModeColors.sidebarHover);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<POSSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
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
