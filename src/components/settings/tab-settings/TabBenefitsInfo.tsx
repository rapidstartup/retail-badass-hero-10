
import React from "react";

const TabBenefitsInfo: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tab System Benefits</h3>
      <p className="text-sm text-muted-foreground">
        The tab system allows customers to:
      </p>
      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
        <li>Order multiple items over time</li>
        <li>Settle their bill at the end of their visit</li>
        <li>Have multiple people contribute to a single tab</li>
        <li>Receive detailed receipts of all purchases</li>
      </ul>
    </div>
  );
};

export default TabBenefitsInfo;
