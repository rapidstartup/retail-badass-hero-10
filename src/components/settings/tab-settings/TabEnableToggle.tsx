
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TabEnableToggleProps {
  tabEnabled: boolean;
  setTabEnabled: (enabled: boolean) => void;
}

const TabEnableToggle: React.FC<TabEnableToggleProps> = ({
  tabEnabled,
  setTabEnabled
}) => {
  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor="tabEnabled" className="flex flex-col space-y-1">
        <span>Enable Tab System</span>
        <span className="font-normal text-sm text-muted-foreground">
          Allow customers to run a tab for later payment
        </span>
      </Label>
      <Switch
        id="tabEnabled"
        checked={tabEnabled}
        onCheckedChange={setTabEnabled}
      />
    </div>
  );
};

export default TabEnableToggle;
