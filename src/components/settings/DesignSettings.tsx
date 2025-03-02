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
}: DesignSettingsProps) => {
  // Default text colors based on the background
  const lightText = "#1e293b";
  const lightAccentHover = "#0284c7";
  const lightSidebarHover = "#f1f5f9";
  
  const darkText = "#f8fafc";
  const darkAccentHover = "#0ea5e9";
  const darkSidebarHover = "#1e293b";

  // Get current settings context to update container colors
  const { settings } = useSettings();

  // Handlers for container color changes
  const handleLightContainerChange = (color: string) => {
    setLightContainer(color);
  };

  const handleDarkContainerChange = (color: string) => {
    setDarkContainer(color);
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
            {/* Container Color Picker */}
            <ColorPicker 
              label="Container Color" 
              value={lightContainer}
              onChange={handleLightContainerChange}
            />
            
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
            {/* Container Color Picker */}
            <ColorPicker 
              label="Container Color" 
              value={darkContainer}
              onChange={handleDarkContainerChange}
            />
            
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
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-md mt-6">
          <h3 className="font-medium mb-2">Theme Usage</h3>
          <p className="text-sm text-muted-foreground">
            Your theme consists of four main color areas:
          </p>
          <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2 space-y-1">
            <li><strong>Main Background:</strong> The primary color for content areas</li>
            <li><strong>Sidebar Background:</strong> Color for the navigation sidebar</li>
            <li><strong>Accent Color:</strong> Used for buttons, active items, and interactive elements</li>
            <li><strong>Container Color:</strong> Used for cards, panels, and other container elements</li>
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
