
import React from "react";
import { Alert, AlertCircle } from "@/components/ui/alert";
import { useSettings } from "@/contexts/SettingsContext";

interface TabPaymentProps {
  customer: any;
}

export function TabPayment({ customer }: TabPaymentProps) {
  const { settings } = useSettings();

  if (!customer) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <p className="text-center text-sm text-muted-foreground">
          Please select a customer to use the tab feature.
        </p>
      </div>
    );
  }

  // Check customer eligibility based on settings
  let isEligible = true;
  let ineligibilityReason = "";

  if (settings.tabCustomerEligibility === "registered" && !customer.id) {
    isEligible = false;
    ineligibilityReason = "Only registered customers can use tabs.";
  } else if (settings.tabCustomerEligibility === "approved") {
    if (!customer.id) {
      isEligible = false;
      ineligibilityReason = "Only pre-approved customers can use tabs.";
    } else if (customer.tier !== "Silver" && customer.tier !== "Gold") {
      isEligible = false;
      ineligibilityReason = "Only Silver and Gold tier customers can use tabs.";
    }
  }

  if (!isEligible) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm ml-2">{ineligibilityReason}</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
      <p className="font-semibold mb-2">
        Add to tab for: {customer.first_name} {customer.last_name}
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        This will add the current transaction to the customer's tab for future payment.
      </p>
      <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded border border-amber-200 dark:border-amber-800">
        <p className="text-sm">
          The customer will need to settle their tab in the future.
        </p>
      </div>
    </div>
  );
}
