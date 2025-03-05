
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
import { supabase } from "@/integrations/supabase/client";

const StaffSettings = () => {
  const { settings } = useSettings();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  
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

  // Debug: Log staff members whenever they change
  useEffect(() => {
    console.log("StaffSettings component - Current staff members:", staffMembers);
  }, [staffMembers]);

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
    console.log("Manually refreshing staff list...");
    toast.info("Refreshing staff list...");
    // Force refetch data
    refetch();
    // Update last refresh timestamp to trigger any effects that depend on it
    setLastRefresh(Date.now());
  };

  // Debug check to directly query Supabase on component mount
  useEffect(() => {
    const checkDatabaseDirectly = async () => {
      try {
        console.log("Directly querying staff table from component...");
        const { data, error, count } = await supabase.from('staff').select('*');
        
        if (error) {
          console.error("Direct query error:", error);
        } else {
          console.log("Direct query results:", {
            received: !!data,
            count: count || (data?.length || 0),
            data
          });
        }
      } catch (err) {
        console.error("Exception during direct query:", err);
      }
    };
    
    checkDatabaseDirectly();
  }, [lastRefresh]);

  return (
    <Card>
      <StaffHeader 
        onAddStaff={handleAddStaffClick}
        onSyncWithGoHighLevel={handleSyncWithGoHighLevel}
        goHighLevelApiKey={goHighLevelApiKey}
        syncing={syncing}
      />
      <CardContent>
        <div className="mb-4 flex justify-between">
          <div>
            <div className="text-muted-foreground text-sm">
              Found {Array.isArray(staffMembers) ? staffMembers.length : 0} staff members
            </div>
          </div>
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
        
        <StaffList
          staffMembers={Array.isArray(staffMembers) ? staffMembers : []}
          loading={loading}
          startEdit={handleStartEdit}
          handleDeleteStaff={handleDeleteStaff}
        />
      </CardContent>
    </Card>
  );
};

export default StaffSettings;
