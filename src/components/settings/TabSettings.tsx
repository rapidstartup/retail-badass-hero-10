
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import the refactored components
import TabEnableToggle from "./tab-settings/TabEnableToggle";
import TabThresholdInput from "./tab-settings/TabThresholdInput";
import TabDurationSettings from "./tab-settings/TabDurationSettings";
import TabEligibilitySettings from "./tab-settings/TabEligibilitySettings";
import TabBenefitsInfo from "./tab-settings/TabBenefitsInfo";

interface TabSettingsProps {
  tabEnabled: boolean;
  setTabEnabled: (enabled: boolean) => void;
  tabThreshold: number;
  setTabThreshold: (threshold: number) => void;
  tabMaxDays: number;
  setTabMaxDays: (days: number) => void;
  tabAutoClosePolicy: "manual" | "daily" | "weekly" | "threshold";
  setTabAutoClosePolicy: (policy: "manual" | "daily" | "weekly" | "threshold") => void;
  tabCustomerEligibility: "all" | "registered" | "approved";
  setTabCustomerEligibility: (eligibility: "all" | "registered" | "approved") => void;
  tabNotifications: boolean;
  setTabNotifications: (enabled: boolean) => void;
}

const TabSettings: React.FC<TabSettingsProps> = ({
  tabEnabled,
  setTabEnabled,
  tabThreshold,
  setTabThreshold,
  tabMaxDays,
  setTabMaxDays,
  tabAutoClosePolicy,
  setTabAutoClosePolicy,
  tabCustomerEligibility,
  setTabCustomerEligibility,
  tabNotifications,
  setTabNotifications
}) => {
  const [inputMode, setInputMode] = useState<"standard" | "numpad">("standard");
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tab System Settings</CardTitle>
        <CardDescription>
          Configure how customer tabs work in your POS system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <TabEnableToggle 
          tabEnabled={tabEnabled} 
          setTabEnabled={setTabEnabled} 
        />
        
        {tabEnabled && (
          <>
            <Tabs 
              defaultValue={inputMode} 
              onValueChange={(value) => setInputMode(value as "standard" | "numpad")}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="standard">Standard Input</TabsTrigger>
                <TabsTrigger value="numpad">Numpad Input</TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard">
                <div className="space-y-4">
                  <TabThresholdInput
                    tabThreshold={tabThreshold}
                    setTabThreshold={setTabThreshold}
                    inputMode="standard"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="numpad">
                <div className="space-y-4">
                  <TabThresholdInput
                    tabThreshold={tabThreshold}
                    setTabThreshold={setTabThreshold}
                    inputMode="numpad"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-4 pt-2 border-t">
              <h3 className="text-lg font-medium">Additional Tab Settings</h3>
              
              <TabDurationSettings
                tabMaxDays={tabMaxDays}
                setTabMaxDays={setTabMaxDays}
                tabAutoClosePolicy={tabAutoClosePolicy}
                setTabAutoClosePolicy={setTabAutoClosePolicy}
              />
              
              <TabEligibilitySettings
                tabCustomerEligibility={tabCustomerEligibility}
                setTabCustomerEligibility={setTabCustomerEligibility}
                tabNotifications={tabNotifications}
                setTabNotifications={setTabNotifications}
              />
            </div>
          </>
        )}
        
        <TabBenefitsInfo />
      </CardContent>
    </Card>
  );
};

export default TabSettings;
