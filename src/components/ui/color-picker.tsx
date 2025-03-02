
import * as React from "react";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ColorPicker = ({ label, value, onChange, className }: ColorPickerProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")}>{label}</Label>
        <div className="text-sm text-muted-foreground">{value}</div>
      </div>
      <div className="flex items-center gap-2">
        <input
          id={label.toLowerCase().replace(/\s+/g, "-")}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 rounded cursor-pointer border"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

export { ColorPicker };
