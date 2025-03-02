
import { useEffect } from "react";
import { POSSettings } from "@/types/settings";

export function useThemeManager(settings: POSSettings) {
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
}
