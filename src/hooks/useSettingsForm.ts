
import { useState, useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { defaultLightColors, defaultDarkColors } from "@/types/settings";

export const useSettingsForm = () => {
  const { settings } = useSettings();
  
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
  // Container color states
  const [lightContainer, setLightContainer] = useState<string>(settings.lightModeColors.container);
  const [darkContainer, setDarkContainer] = useState<string>(settings.darkModeColors.container);
  // Section color states
  const [lightSection, setLightSection] = useState<string>(settings.lightModeColors.section);
  const [darkSection, setDarkSection] = useState<string>(settings.darkModeColors.section);
  const [lightSectionSelected, setLightSectionSelected] = useState<string>(settings.lightModeColors.sectionSelected);
  const [darkSectionSelected, setDarkSectionSelected] = useState<string>(settings.darkModeColors.sectionSelected);
  
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
    
    // Light Mode Colors
    const lightColors = settings.lightModeColors || defaultLightColors;
    setLightBackground(lightColors.background);
    setLightSidebar(lightColors.sidebar);
    setLightAccent(lightColors.accent);
    setLightContainer(lightColors.container);
    setLightSection(lightColors.section);
    setLightSectionSelected(lightColors.sectionSelected);
    
    // Dark Mode Colors
    const darkColors = settings.darkModeColors || defaultDarkColors;
    setDarkBackground(darkColors.background);
    setDarkSidebar(darkColors.sidebar);
    setDarkAccent(darkColors.accent);
    setDarkContainer(darkColors.container);
    setDarkSection(darkColors.section);
    setDarkSectionSelected(darkColors.sectionSelected);
  }, [settings]);

  return {
    // General settings state and setters
    taxRate, setTaxRate,
    tabEnabled, setTabEnabled,
    tabThreshold, setTabThreshold,
    
    // Stripe integration state and setters
    stripeLiveSecretKey, setStripeLiveSecretKey,
    stripeLivePublicKey, setStripeLivePublicKey,
    stripeTestSecretKey, setStripeTestSecretKey,
    stripeTestPublicKey, setStripeTestPublicKey,
    stripeMode, setStripeMode,
    
    // GoHighLevel integration state and setters
    goHighLevelApiKey, setGoHighLevelApiKey,
    
    // Theme settings state and setters
    theme, setTheme,
    
    // Light mode colors state and setters
    lightBackground, setLightBackground,
    lightSidebar, setLightSidebar,
    lightAccent, setLightAccent,
    lightContainer, setLightContainer,
    lightSection, setLightSection,
    lightSectionSelected, setLightSectionSelected,
    
    // Dark mode colors state and setters
    darkBackground, setDarkBackground,
    darkSidebar, setDarkSidebar,
    darkAccent, setDarkAccent,
    darkContainer, setDarkContainer,
    darkSection, setDarkSection,
    darkSectionSelected, setDarkSectionSelected,
  };
};
