
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";

interface StaffHeaderProps {
  onAddStaff: () => void;
  onSyncWithGoHighLevel: () => void;
  goHighLevelApiKey?: string;
  syncing: boolean;
}

const StaffHeader: React.FC<StaffHeaderProps> = ({
  onAddStaff,
  onSyncWithGoHighLevel,
  goHighLevelApiKey,
  syncing
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Staff Management</CardTitle>
        <CardDescription>
          Add and manage staff members with access to the POS system
        </CardDescription>
      </div>
      <div className="flex gap-2">
        {goHighLevelApiKey && (
          <Button 
            variant="outline" 
            onClick={onSyncWithGoHighLevel}
            disabled={syncing}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {syncing ? "Syncing..." : "Sync with GoHighLevel"}
          </Button>
        )}
        <Button onClick={onAddStaff}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>
    </CardHeader>
  );
};

export default StaffHeader;
