
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

interface ThemeModeToggleProps {
  theme: "light" | "dark";
  setTheme: (value: "light" | "dark") => void;
}

const ThemeModeToggle = ({ theme, setTheme }: ThemeModeToggleProps) => {
  return (
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
  );
};

export default ThemeModeToggle;
