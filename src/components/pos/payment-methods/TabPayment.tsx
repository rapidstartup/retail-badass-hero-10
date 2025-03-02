
import React from "react";

interface TabPaymentProps {
  customer: any;
}

export function TabPayment({ customer }: TabPaymentProps) {
  if (!customer) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <p className="text-center text-sm text-muted-foreground">
          Please select a customer to use the tab feature.
        </p>
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
