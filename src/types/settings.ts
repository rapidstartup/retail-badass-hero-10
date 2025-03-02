
export interface ThemeColors {
  background: string;
  sidebar: string;
  accent: string;
  text: string;
  accentHover: string;
  sidebarHover: string;
  container: string;
  section: string;
  sectionSelected: string;
}

export interface POSSettings {
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
  lightModeColors: ThemeColors;
  darkModeColors: ThemeColors;
}

export interface SettingsContextType {
  settings: POSSettings;
  updateSettings: (newSettings: Partial<POSSettings>) => Promise<void>;
  isLoading: boolean;
  saveSettings: () => Promise<void>;
}

// Default theme settings
export const defaultLightColors: ThemeColors = {
  background: "#ffffff",
  sidebar: "#f0f4f8",
  accent: "#3b82f6",
  text: "#1e293b",
  accentHover: "#2563eb",
  sidebarHover: "#e0e7ff",
  container: "#f9fafb",
  section: "#f1f5f9",
  sectionSelected: "#e2e8f0",
};

export const defaultDarkColors: ThemeColors = {
  background: "#0f172a",
  sidebar: "#1e293b",
  accent: "#60a5fa",
  text: "#f8fafc",
  accentHover: "#3b82f6",
  sidebarHover: "#334155",
  container: "#1e293b",
  section: "#1e293b",
  sectionSelected: "#0f172a",
};

export const defaultSettings: POSSettings = {
  taxRate: 8.0,
  tabEnabled: true,
  tabThreshold: 100,
  tabMaxDays: 7,
  storeName: "NextPOS",
  stripeMode: "test",
  theme: "dark",
  lightModeColors: defaultLightColors,
  darkModeColors: defaultDarkColors,
};
