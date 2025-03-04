
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TabDurationSettingsProps {
  tabMaxDays: number;
  setTabMaxDays: (days: number) => void;
  tabAutoClosePolicy: "manual" | "daily" | "weekly" | "threshold";
  setTabAutoClosePolicy: (policy: "manual" | "daily" | "weekly" | "threshold") => void;
}

const TabDurationSettings: React.FC<TabDurationSettingsProps> = ({
  tabMaxDays,
  setTabMaxDays,
  tabAutoClosePolicy,
  setTabAutoClosePolicy
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="maxTabDays">Maximum Tab Duration (Days)</Label>
        <Input
          id="maxTabDays"
          type="number"
          value={tabMaxDays}
          onChange={(e) => setTabMaxDays(parseInt(e.target.value) || 7)}
          min="1"
          max="30"
        />
        <p className="text-sm text-muted-foreground">
          Maximum number of days a tab can remain open
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="autoClosePolicy">Auto-Close Policy</Label>
        <Select 
          value={tabAutoClosePolicy} 
          onValueChange={(value) => setTabAutoClosePolicy(value as "manual" | "daily" | "weekly" | "threshold")}
        >
          <SelectTrigger id="autoClosePolicy">
            <SelectValue placeholder="Select policy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Manual Close Only</SelectItem>
            <SelectItem value="daily">Close at End of Day</SelectItem>
            <SelectItem value="weekly">Close at End of Week</SelectItem>
            <SelectItem value="threshold">Close When Exceeding Threshold</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          When tabs should be automatically closed
        </p>
      </div>
    </div>
  );
};

export default TabDurationSettings;
