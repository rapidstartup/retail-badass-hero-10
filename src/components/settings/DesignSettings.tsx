
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/contexts/SettingsContext";
import ThemeModeToggle from "./design/ThemeModeToggle";
import ThemeColorScheme from "./design/ThemeColorScheme";
import ThemeUsageInfo from "./design/ThemeUsageInfo";

interface DesignSettingsProps {
  theme: "light" | "dark";
  setTheme: (value: "light" | "dark") => void;
  lightBackground: string;
  setLightBackground: (value: string) => void;
  lightSidebar: string;
  setLightSidebar: (value: string) => void;
  lightAccent: string;
  setLightAccent: (value: string) => void;
  darkBackground: string;
  setDarkBackground: (value: string) => void;
  darkSidebar: string;
  setDarkSidebar: (value: string) => void;
  darkAccent: string;
  setDarkAccent: (value: string) => void;
  lightContainer: string;
  setLightContainer: (value: string) => void;
  darkContainer: string;
  setDarkContainer: (value: string) => void;
  lightSection: string;
  setLightSection: (value: string) => void;
  darkSection: string;
  setDarkSection: (value: string) => void;
  lightSectionSelected: string;
  setLightSectionSelected: (value: string) => void;
  darkSectionSelected: string;
  setDarkSectionSelected: (value: string) => void;
}

const DesignSettings = ({
  theme,
  setTheme,
  lightBackground,
  setLightBackground,
  lightSidebar,
  setLightSidebar,
  lightAccent,
  setLightAccent,
  darkBackground,
  setDarkBackground,
  darkSidebar,
  setDarkSidebar,
  darkAccent,
  setDarkAccent,
  lightContainer,
  setLightContainer,
  darkContainer,
  setDarkContainer,
  lightSection,
  setLightSection,
  darkSection,
  setDarkSection,
  lightSectionSelected,
  setLightSectionSelected,
  darkSectionSelected,
  setDarkSectionSelected,
}: DesignSettingsProps) => {
  // Get current settings context
  const { settings } = useSettings();

  // Auto-calculate a slightly darker shade for the selected section
  const calculateDarkerShade = (color: string, amount: number = 0.15): string => {
    // Parse the hex color to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Darken each component
    const darkerR = Math.max(0, Math.floor(r * (1 - amount)));
    const darkerG = Math.max(0, Math.floor(g * (1 - amount)));
    const darkerB = Math.max(0, Math.floor(b * (1 - amount)));
    
    // Convert back to hex
    return `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
  };

  // Handler for light section color changes with auto-calculation of selected shade
  const handleLightSectionChange = (color: string) => {
    setLightSection(color);
    setLightSectionSelected(calculateDarkerShade(color));
  };

  // Handler for dark section color changes with auto-calculation of selected shade
  const handleDarkSectionChange = (color: string) => {
    setDarkSection(color);
    setDarkSectionSelected(calculateDarkerShade(color));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
        <CardDescription>
          Customize the appearance of your POS system.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ThemeModeToggle theme={theme} setTheme={setTheme} />
        
        <Separator className="my-4" />
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Light Mode Colors */}
          <ThemeColorScheme 
            mode="light"
            background={lightBackground}
            setBackground={setLightBackground}
            sidebar={lightSidebar}
            setSidebar={setLightSidebar}
            accent={lightAccent}
            setAccent={setLightAccent}
            container={lightContainer}
            setContainer={setLightContainer}
            section={lightSection}
            setSection={setLightSection}
            sectionSelected={lightSectionSelected}
            setSectionSelected={setLightSectionSelected}
            handleSectionChange={handleLightSectionChange}
          />
          
          {/* Dark Mode Colors */}
          <ThemeColorScheme 
            mode="dark"
            background={darkBackground}
            setBackground={setDarkBackground}
            sidebar={darkSidebar}
            setSidebar={setDarkSidebar}
            accent={darkAccent}
            setAccent={setDarkAccent}
            container={darkContainer}
            setContainer={setDarkContainer}
            section={darkSection}
            setSection={setDarkSection}
            sectionSelected={darkSectionSelected}
            setSectionSelected={setDarkSectionSelected}
            handleSectionChange={handleDarkSectionChange}
          />
        </div>
        
        <ThemeUsageInfo />
      </CardContent>
    </Card>
  );
};

export default DesignSettings;
