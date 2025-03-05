
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSettings } from "@/contexts/SettingsContext";
import StaffList from "./staff/StaffList";
import StaffHeader from "./staff/StaffHeader";
import StaffFormDialog from "./staff/StaffFormDialog";
import { useStaffManagement } from "@/hooks/staff";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

const StaffSettings = () => {
  const { settings } = useSettings();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [manualRefreshCount, setManualRefreshCount] = useState(0);
  
  const {
    staffMembers,
    loading,
    syncing,
    isEditing,
    email,
    firstName,
    lastName,
    role,
    password,
    setEmail,
    setFirstName,
    setLastName,
    setRole,
    setPassword,
    handleAddStaff,
    handleEditStaff,
    handleDeleteStaff,
    startEdit,
    resetForm,
    syncWithGoHighLevel,
    refetch
  } = useStaffManagement();

  // Log staff data when it changes for debugging
  useEffect(() => {
    console.log("Staff members in StaffSettings:", staffMembers);
  }, [staffMembers]);

  // Auto-refresh if no staff members are loaded
  useEffect(() => {
    if (!loading && staffMembers.length === 0 && manualRefreshCount < 3) {
      // Try a few automatic refreshes on initial load
      const timer = setTimeout(() => {
        console.log("Auto-refreshing staff list...");
        refetch();
        setManualRefreshCount(prev => prev + 1);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [loading, staffMembers, refetch, manualRefreshCount]);

  const goHighLevelApiKey = settings.goHighLevelApiKey;
  
  const handleAddStaffClick = () => {
    resetForm();
    setIsFormOpen(true);
  };
  
  const handleSyncWithGoHighLevel = () => {
    syncWithGoHighLevel(goHighLevelApiKey);
  };

  const handleStartEdit = (staff: any) => {
    startEdit(staff);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    resetForm();
    setIsFormOpen(false);
  };

  const handleRefresh = () => {
    console.log("Manual refresh requested");
    toast.info("Refreshing staff list...");
    setManualRefreshCount(prev => prev + 1);
    refetch();
  };

  return (
    <Card>
      <StaffHeader 
        onAddStaff={handleAddStaffClick}
        onSyncWithGoHighLevel={handleSyncWithGoHighLevel}
        goHighLevelApiKey={goHighLevelApiKey}
        syncing={syncing}
      />
      <CardContent>
        <div className="mb-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Refreshing..." : "Refresh Staff List"}
          </Button>
        </div>
        
        {/* Staff Form Dialog */}
        <StaffFormDialog
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          isEditing={isEditing}
          email={email}
          setEmail={setEmail}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          role={role}
          setRole={setRole}
          password={password}
          setPassword={setPassword}
          resetForm={handleCloseForm}
          handleAddStaff={handleAddStaff}
          handleEditStaff={handleEditStaff}
        />
        
        {staffMembers.length === 0 && !loading && (
          <div className="mb-4 p-3 bg-amber-50 text-amber-700 rounded border border-amber-200">
            <p className="font-medium">Debug info: No staff members loaded.</p>
            <p className="text-sm mt-1">Database may be empty or there might be a connection issue. Try adding your first staff member or check your database configuration.</p>
          </div>
        )}
        
        <StaffList
          staffMembers={staffMembers}
          loading={loading}
          startEdit={handleStartEdit}
          handleDeleteStaff={handleDeleteStaff}
        />
      </CardContent>
    </Card>
  );
};

export default StaffSettings;
