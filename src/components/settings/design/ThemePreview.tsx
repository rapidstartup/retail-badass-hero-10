
import React from "react";
import { Button } from "@/components/ui/button";

interface ThemePreviewProps {
  background: string;
  sidebar: string;
  accent: string;
  text: string;
  sidebarHover: string;
  container: string;
  section: string;
  sectionSelected: string;
  mode: "light" | "dark";
}

const ThemePreview = ({
  background,
  sidebar,
  accent,
  text,
  sidebarHover,
  container,
  section,
  sectionSelected,
  mode
}: ThemePreviewProps) => {
  return (
    <div className="mt-4 border rounded-md overflow-hidden">
      <div className="text-sm font-medium p-2 bg-muted">{mode === "light" ? "Light" : "Dark"} Mode Preview</div>
      <div className="flex overflow-hidden rounded-md border">
        {/* Sidebar */}
        <div
          className="w-1/4 p-2"
          style={{ backgroundColor: sidebar, color: text }}
        >
          <div className="w-full py-2 px-3 mb-1 rounded text-sm" 
            style={{ backgroundColor: sidebarHover }}>
            Dashboard
          </div>
          <div className="w-full py-2 px-3 mb-1 rounded text-sm" 
            style={{ backgroundColor: accent, color: "white" }}>
            Settings
          </div>
        </div>
        
        {/* Main content */}
        <div 
          className="w-3/4 p-4 flex flex-col gap-2"
          style={{ backgroundColor: background, color: text }}
        >
          <span className="text-sm">Main Content Area</span>
          <Button
            size="sm"
            style={{ backgroundColor: accent }}
          >
            Action Button
          </Button>
          {/* Container Preview */}
          <div 
            className="p-3 rounded border mt-2"
            style={{ backgroundColor: container }}
          >
            <span className="text-xs">Container Element</span>
          </div>
          {/* Section Preview */}
          <div 
            className="p-3 rounded border mt-2 flex gap-2"
            style={{ backgroundColor: section }}
          >
            <span className="text-xs">Section Background</span>
            <div
              className="px-2 py-1 rounded text-xs"
              style={{ backgroundColor: sectionSelected }}
            >
              Selected Item
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
