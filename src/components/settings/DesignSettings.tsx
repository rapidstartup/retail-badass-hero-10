
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";
import { useSettings } from "@/contexts/SettingsContext";

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
  // Default text colors based on the background
  const lightText = "#1e293b";
  const lightAccentHover = "#0284c7";
  const lightSidebarHover = "#f1f5f9";
  
  const darkText = "#f8fafc";
  const darkAccentHover = "#0ea5e9";
  const darkSidebarHover = "#1e293b";

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
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="theme-mode">Theme Mode</Label>
            <p className="text-sm text-muted-foreground">
              Select light or dark mode for your POS interface.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sun size={20} className={theme === "light" ? "text-orange-400" : "text-muted-foreground"} />
            <Switch
              id="theme-mode"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
            <Moon size={20} className={theme === "dark" ? "text-blue-400" : "text-muted-foreground"} />
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Light Mode Colors */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Light Mode Colors</h3>
            <ColorPicker 
              label="Main Background Color" 
              value={lightBackground}
              onChange={setLightBackground}
            />
            <ColorPicker 
              label="Sidebar Background" 
              value={lightSidebar}
              onChange={setLightSidebar}
            />
            <ColorPicker 
              label="Accent Color" 
              value={lightAccent}
              onChange={setLightAccent}
            />
            <ColorPicker 
              label="Container Color" 
              value={lightContainer}
              onChange={setLightContainer}
            />
            
            {/* New Section Background Color Picker */}
            <ColorPicker 
              label="Section Background" 
              value={lightSection}
              onChange={handleLightSectionChange}
            />
            
            {/* Section Selected Color (read-only) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Selected Section Color</Label>
                <div className="text-sm text-muted-foreground">{lightSectionSelected}</div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-10 w-10 rounded border"
                  style={{ backgroundColor: lightSectionSelected }}
                ></div>
                <div className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                  Auto-calculated from section color
                </div>
              </div>
            </div>
            
            {/* Preview */}
            <div className="mt-4 border rounded-md overflow-hidden">
              <div className="text-sm font-medium p-2 bg-muted">Light Mode Preview</div>
              <div className="flex overflow-hidden rounded-md border">
                {/* Sidebar */}
                <div
                  className="w-1/4 p-2"
                  style={{ backgroundColor: lightSidebar }}
                >
                  <div className="w-full py-2 px-3 mb-1 rounded text-sm" 
                    style={{ backgroundColor: lightSidebarHover }}>
                    Dashboard
                  </div>
                  <div className="w-full py-2 px-3 mb-1 rounded text-sm" 
                    style={{ backgroundColor: lightAccent, color: "white" }}>
                    Settings
                  </div>
                </div>
                
                {/* Main content */}
                <div 
                  className="w-3/4 p-4 flex flex-col gap-2"
                  style={{ backgroundColor: lightBackground, color: lightText }}
                >
                  <span className="text-sm">Main Content Area</span>
                  <Button
                    size="sm"
                    style={{ backgroundColor: lightAccent }}
                  >
                    Action Button
                  </Button>
                  {/* Container Preview */}
                  <div 
                    className="p-3 rounded border mt-2"
                    style={{ backgroundColor: lightContainer }}
                  >
                    <span className="text-xs">Container Element</span>
                  </div>
                  {/* Section Preview */}
                  <div 
                    className="p-3 rounded border mt-2 flex gap-2"
                    style={{ backgroundColor: lightSection }}
                  >
                    <span className="text-xs">Section Background</span>
                    <div
                      className="px-2 py-1 rounded text-xs"
                      style={{ backgroundColor: lightSectionSelected }}
                    >
                      Selected Item
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dark Mode Colors */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Dark Mode Colors</h3>
            <ColorPicker 
              label="Main Background Color" 
              value={darkBackground}
              onChange={setDarkBackground}
            />
            <ColorPicker 
              label="Sidebar Background" 
              value={darkSidebar}
              onChange={setDarkSidebar}
            />
            <ColorPicker 
              label="Accent Color" 
              value={darkAccent}
              onChange={setDarkAccent}
            />
            <ColorPicker 
              label="Container Color" 
              value={darkContainer}
              onChange={setDarkContainer}
            />
            
            {/* New Section Background Color Picker */}
            <ColorPicker 
              label="Section Background" 
              value={darkSection}
              onChange={handleDarkSectionChange}
            />
            
            {/* Section Selected Color (read-only) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Selected Section Color</Label>
                <div className="text-sm text-muted-foreground">{darkSectionSelected}</div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-10 w-10 rounded border"
                  style={{ backgroundColor: darkSectionSelected }}
                ></div>
                <div className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                  Auto-calculated from section color
                </div>
              </div>
            </div>
            
            {/* Preview */}
            <div className="mt-4 border rounded-md overflow-hidden">
              <div className="text-sm font-medium p-2 bg-muted">Dark Mode Preview</div>
              <div className="flex overflow-hidden rounded-md border">
                {/* Sidebar */}
                <div
                  className="w-1/4 p-2"
                  style={{ backgroundColor: darkSidebar, color: darkText }}
                >
                  <div className="w-full py-2 px-3 mb-1 rounded text-sm" 
                    style={{ backgroundColor: darkSidebarHover }}>
                    Dashboard
                  </div>
                  <div className="w-full py-2 px-3 mb-1 rounded text-sm" 
                    style={{ backgroundColor: darkAccent, color: "white" }}>
                    Settings
                  </div>
                </div>
                
                {/* Main content */}
                <div 
                  className="w-3/4 p-4 flex flex-col gap-2"
                  style={{ backgroundColor: darkBackground, color: darkText }}
                >
                  <span className="text-sm">Main Content Area</span>
                  <Button
                    size="sm"
                    style={{ backgroundColor: darkAccent }}
                  >
                    Action Button
                  </Button>
                  {/* Container Preview */}
                  <div 
                    className="p-3 rounded border mt-2"
                    style={{ backgroundColor: darkContainer }}
                  >
                    <span className="text-xs">Container Element</span>
                  </div>
                  {/* Section Preview */}
                  <div 
                    className="p-3 rounded border mt-2 flex gap-2"
                    style={{ backgroundColor: darkSection }}
                  >
                    <span className="text-xs">Section Background</span>
                    <div
                      className="px-2 py-1 rounded text-xs"
                      style={{ backgroundColor: darkSectionSelected }}
                    >
                      Selected Item
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-md mt-6">
          <h3 className="font-medium mb-2">Theme Usage</h3>
          <p className="text-sm text-muted-foreground">
            Your theme consists of six main color areas:
          </p>
          <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2 space-y-1">
            <li><strong>Main Background:</strong> The primary color for content areas</li>
            <li><strong>Sidebar Background:</strong> Color for the navigation sidebar</li>
            <li><strong>Accent Color:</strong> Used for buttons, active items, and interactive elements</li>
            <li><strong>Container Color:</strong> Used for cards, panels, and other container elements</li>
            <li><strong>Section Background:</strong> Used for section backgrounds like tab lists</li>
            <li><strong>Selected Section:</strong> Automatically calculated darker shade for selected items</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            Click "Save All Settings" to apply your changes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignSettings;
