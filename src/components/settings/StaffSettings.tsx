
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSettings } from "@/contexts/SettingsContext";
import StaffForm from "./staff/StaffForm";
import StaffList from "./staff/StaffList";
import StaffHeader from "./staff/StaffHeader";
import { useStaffManagement } from "@/hooks/useStaffManagement";

const StaffSettings = () => {
  const { settings } = useSettings();
  const {
    staffMembers,
    loading,
    syncing,
    isAdding,
    isEditing,
    email,
    firstName,
    lastName,
    role,
    password,
    setIsAdding,
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
    syncWithGoHighLevel
  } = useStaffManagement();

  const goHighLevelApiKey = settings.goHighLevelApiKey;
  
  const handleAddStaffClick = () => {
    resetForm();
    setIsAdding(true);
  };
  
  const handleSyncWithGoHighLevel = () => {
    syncWithGoHighLevel(goHighLevelApiKey);
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
        {/* Add/Edit Form */}
        {(isAdding || isEditing) && (
          <StaffForm
            isAdding={isAdding}
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
            resetForm={resetForm}
            handleAddStaff={handleAddStaff}
            handleEditStaff={handleEditStaff}
          />
        )}
        
        {/* Staff List */}
        <StaffList
          staffMembers={staffMembers}
          loading={loading}
          startEdit={startEdit}
          handleDeleteStaff={handleDeleteStaff}
        />
      </CardContent>
    </Card>
  );
};

export default StaffSettings;
