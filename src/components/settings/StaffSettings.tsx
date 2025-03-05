
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSettings } from "@/contexts/SettingsContext";
import StaffList from "./staff/StaffList";
import StaffHeader from "./staff/StaffHeader";
import StaffFormDialog from "./staff/StaffFormDialog";
import { useStaffManagement } from "@/hooks/staff";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/types/staff";

const StaffSettings = () => {
  const { settings } = useSettings();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [directStaffData, setDirectStaffData] = useState<StaffMember[]>([]);
  const [isDirectFetching, setIsDirectFetching] = useState(false);
  
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
    refetch();
    // Clear any direct data we might have
    setDirectStaffData([]);
  };

  const fetchStaffDirectly = async () => {
    setIsDirectFetching(true);
    try {
      console.log("Directly querying staff through edge function...");
      toast.info("Querying staff data via edge function...");
      
      // Use the edge function instead of direct query
      const { data, error } = await supabase.functions.invoke('staff', {
        body: { action: 'list-staff' }
      });
      
      console.log("Edge function direct query response:", { data, error });
      
      if (error) {
        toast.error(`Edge function error: ${error.message}`);
        return;
      }
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        toast.info("No staff records found via edge function");
        setDirectStaffData([]);
        return;
      }
      
      setDirectStaffData(data);
      toast.success(`Found ${data.length} staff members via edge function`);
    } catch (err: any) {
      console.error("Exception during edge function query:", err);
      toast.error(`Exception during edge function query: ${err.message}`);
    } finally {
      setIsDirectFetching(false);
    }
  };

  // Determine which staff data to display (direct fetch takes precedence if available)
  const displayStaffMembers = directStaffData.length > 0 
    ? directStaffData 
    : Array.isArray(staffMembers) ? staffMembers : [];

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
              Found {displayStaffMembers.length} staff members
              {directStaffData.length > 0 && " (via edge function)"}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchStaffDirectly}
              disabled={isDirectFetching}
            >
              <Database className={`mr-2 h-4 w-4 ${isDirectFetching ? 'animate-spin' : ''}`} />
              {isDirectFetching ? "Querying..." : "Edge Function Query"}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
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
          staffMembers={displayStaffMembers}
          loading={loading || isDirectFetching}
          startEdit={handleStartEdit}
          handleDeleteStaff={handleDeleteStaff}
        />
      </CardContent>
    </Card>
  );
};

export default StaffSettings;
