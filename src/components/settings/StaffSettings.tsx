
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSettings } from "@/contexts/SettingsContext";
import StaffList from "./staff/StaffList";
import StaffHeader from "./staff/StaffHeader";
import StaffFormDialog from "./staff/StaffFormDialog";
import { useStaffManagement } from "@/hooks/staff";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const StaffSettings = () => {
  const { settings } = useSettings();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
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
    fetchStaffMembers
  } = useStaffManagement();

  // Add an effect to periodically check for staff members during initial load
  useEffect(() => {
    // Debug log to track component renders and staff data
    console.log("StaffSettings render with staffMembers:", staffMembers);
    
    // If no staff members are loaded yet, fetch them
    if (!loading && staffMembers.length === 0) {
      console.log("No staff members loaded, trying to fetch again...");
      fetchStaffMembers();
    }
  }, [staffMembers, loading, fetchStaffMembers]);

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
    fetchStaffMembers();
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
        
        {/* Staff List with Debug Info */}
        {staffMembers.length === 0 && !loading && (
          <div className="mb-2 p-2 bg-amber-50 text-amber-700 rounded text-sm">
            Debug: No staff members in state. Try refreshing the list.
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
