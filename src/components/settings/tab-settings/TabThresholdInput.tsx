
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import POSNumpad from "@/components/pos/POSNumpad";

interface TabThresholdInputProps {
  tabThreshold: number;
  setTabThreshold: (threshold: number) => void;
  inputMode: "standard" | "numpad";
}

const TabThresholdInput: React.FC<TabThresholdInputProps> = ({
  tabThreshold,
  setTabThreshold,
  inputMode
}) => {
  const handleThresholdChange = (value: string) => {
    if (value === "") {
      setTabThreshold(0);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setTabThreshold(numValue);
      }
    }
  };

  if (inputMode === "numpad") {
    return (
      <div className="space-y-2">
        <Label htmlFor="tabThresholdNumpad">Tab Threshold ($)</Label>
        <div className="flex items-center">
          <div className="text-2xl font-medium p-2 bg-muted/30 rounded-md w-full text-right">
            ${tabThreshold.toFixed(2)}
          </div>
        </div>
        <POSNumpad 
          initialValue={tabThreshold.toString()}
          onValueChange={handleThresholdChange}
          hideItemName={true}
        />
        <p className="text-sm text-muted-foreground">
          Alert staff when a tab exceeds this amount
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="tabThreshold">Tab Threshold ($)</Label>
      <Input
        id="tabThreshold"
        type="number"
        value={tabThreshold}
        onChange={(e) => setTabThreshold(parseFloat(e.target.value) || 0)}
        min="0"
        step="5"
      />
      <p className="text-sm text-muted-foreground">
        Alert staff when a tab exceeds this amount
      </p>
    </div>
  );
};

export default TabThresholdInput;
