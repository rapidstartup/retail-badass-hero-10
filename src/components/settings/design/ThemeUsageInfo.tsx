
import React from "react";

const ThemeUsageInfo = () => {
  return (
    <div className="bg-muted p-4 rounded-md mt-6">
      <h3 className="font-medium mb-2">Theme Usage</h3>
      <p className="text-sm text-muted-foreground">
        Your theme consists of six main color areas:
      </p>
      <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2 space-y-1">
        <li><strong>Main Background:</strong> The primary color for content areas</li>
        <li><strong>Sidebar Background:</strong> Color for the navigation sidebar</li>
        <li><strong>Accent Color:</strong> Used for buttons, active items, and interactive elements</li>
        <li><strong>Container Color:</strong> Used for cards, panels, and other container elements</li>
        <li><strong>Section Background:</strong> Used for section backgrounds like tab lists</li>
        <li><strong>Selected Section:</strong> Automatically calculated darker shade for selected items</li>
      </ul>
      <p className="text-sm text-muted-foreground mt-2">
        Click "Save All Settings" to apply your changes.
      </p>
    </div>
  );
};

export default ThemeUsageInfo;
