
import React from "react";
import { ColorPicker } from "@/components/ui/color-picker";
import { Label } from "@/components/ui/label";
import ThemePreview from "./ThemePreview";

interface ThemeColorSchemeProps {
  mode: "light" | "dark";
  background: string;
  setBackground: (value: string) => void;
  sidebar: string;
  setSidebar: (value: string) => void;
  accent: string;
  setAccent: (value: string) => void;
  container: string;
  setContainer: (value: string) => void;
  section: string;
  setSection: (value: string) => void;
  sectionSelected: string;
  setSectionSelected: (value: string) => void;
  handleSectionChange: (color: string) => void;
}

const ThemeColorScheme = ({
  mode,
  background,
  setBackground,
  sidebar,
  setSidebar,
  accent,
  setAccent,
  container,
  setContainer,
  section,
  setSection,
  sectionSelected,
  setSectionSelected,
  handleSectionChange
}: ThemeColorSchemeProps) => {
  // Default text and hover colors based on the mode
  const text = mode === "light" ? "#1e293b" : "#f8fafc";
  const accentHover = mode === "light" ? "#0284c7" : "#0ea5e9";
  const sidebarHover = mode === "light" ? "#f1f5f9" : "#1e293b";

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">{mode === "light" ? "Light" : "Dark"} Mode Colors</h3>
      <ColorPicker 
        label="Main Background Color" 
        value={background}
        onChange={setBackground}
      />
      <ColorPicker 
        label="Sidebar Background" 
        value={sidebar}
        onChange={setSidebar}
      />
      <ColorPicker 
        label="Accent Color" 
        value={accent}
        onChange={setAccent}
      />
      <ColorPicker 
        label="Container Color" 
        value={container}
        onChange={setContainer}
      />
      
      {/* Section Background Color Picker */}
      <ColorPicker 
        label="Section Background" 
        value={section}
        onChange={handleSectionChange}
      />
      
      {/* Section Selected Color (read-only) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Selected Section Color</Label>
          <div className="text-sm text-muted-foreground">{sectionSelected}</div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-10 w-10 rounded border"
            style={{ backgroundColor: sectionSelected }}
          ></div>
          <div className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
            Auto-calculated from section color
          </div>
        </div>
      </div>
      
      {/* Preview */}
      <ThemePreview 
        background={background}
        sidebar={sidebar}
        accent={accent}
        text={text}
        sidebarHover={sidebarHover}
        container={container}
        section={section}
        sectionSelected={sectionSelected}
        mode={mode}
      />
    </div>
  );
};

export default ThemeColorScheme;
