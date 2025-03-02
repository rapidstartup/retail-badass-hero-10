
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";

interface DesignSettingsProps {
  theme: "light" | "dark";
  setTheme: (value: "light" | "dark") => void;
  lightBackground: string;
  setLightBackground: (value: string) => void;
  lightAccent: string;
  setLightAccent: (value: string) => void;
  darkBackground: string;
  setDarkBackground: (value: string) => void;
  darkAccent: string;
  setDarkAccent: (value: string) => void;
}

const DesignSettings = ({
  theme,
  setTheme,
  lightBackground,
  setLightBackground,
  lightAccent,
  setLightAccent,
  darkBackground,
  setDarkBackground,
  darkAccent,
  setDarkAccent,
}: DesignSettingsProps) => {
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
              label="Background Color" 
              value={lightBackground}
              onChange={setLightBackground}
            />
            <ColorPicker 
              label="Accent Color" 
              value={lightAccent}
              onChange={setLightAccent}
            />
            
            {/* Preview */}
            <div className="mt-4 border rounded-md overflow-hidden">
              <div className="text-sm font-medium p-2 bg-muted">Light Mode Preview</div>
              <div 
                className="p-4 flex flex-col items-center gap-2"
                style={{ backgroundColor: lightBackground }}
              >
                <span className="text-sm">Sample Text</span>
                <Button
                  size="sm"
                  style={{ backgroundColor: lightAccent }}
                >
                  Sample Button
                </Button>
              </div>
            </div>
          </div>
          
          {/* Dark Mode Colors */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Dark Mode Colors</h3>
            <ColorPicker 
              label="Background Color" 
              value={darkBackground}
              onChange={setDarkBackground}
            />
            <ColorPicker 
              label="Accent Color" 
              value={darkAccent}
              onChange={setDarkAccent}
            />
            
            {/* Preview */}
            <div className="mt-4 border rounded-md overflow-hidden">
              <div className="text-sm font-medium p-2 bg-muted">Dark Mode Preview</div>
              <div 
                className="p-4 flex flex-col items-center gap-2"
                style={{ backgroundColor: darkBackground, color: "#ffffff" }}
              >
                <span className="text-sm">Sample Text</span>
                <Button
                  size="sm"
                  style={{ backgroundColor: darkAccent }}
                >
                  Sample Button
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-md mt-6">
          <h3 className="font-medium mb-2">Theme Usage</h3>
          <p className="text-sm text-muted-foreground">
            These color settings will be applied throughout the POS system. 
            Click "Save All Settings" to apply your changes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignSettings;
