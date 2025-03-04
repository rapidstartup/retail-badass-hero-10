
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TabEligibilitySettingsProps {
  tabCustomerEligibility: "all" | "registered" | "approved";
  setTabCustomerEligibility: (eligibility: "all" | "registered" | "approved") => void;
  tabNotifications: boolean;
  setTabNotifications: (enabled: boolean) => void;
}

const TabEligibilitySettings: React.FC<TabEligibilitySettingsProps> = ({
  tabCustomerEligibility,
  setTabCustomerEligibility,
  tabNotifications,
  setTabNotifications
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="customerRestriction">Customer Eligibility</Label>
        <Select 
          value={tabCustomerEligibility} 
          onValueChange={(value) => setTabCustomerEligibility(value as "all" | "registered" | "approved")}
        >
          <SelectTrigger id="customerRestriction">
            <SelectValue placeholder="Select eligibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            <SelectItem value="registered">Registered Customers Only</SelectItem>
            <SelectItem value="approved">Pre-Approved Customers Only</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Which customers are eligible to use the tab system
        </p>
      </div>
      
      <div className="flex items-center justify-between space-x-2 pt-2">
        <Label htmlFor="tabNotifications" className="flex flex-col space-y-1">
          <span>Tab Notifications</span>
          <span className="font-normal text-sm text-muted-foreground">
            Send notifications for tabs approaching threshold
          </span>
        </Label>
        <Switch
          id="tabNotifications"
          checked={tabNotifications}
          onCheckedChange={setTabNotifications}
        />
      </div>
    </div>
  );
};

export default TabEligibilitySettings;
