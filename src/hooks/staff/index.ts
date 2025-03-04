
import { useStaffFetch } from "./useStaffFetch";
import { useStaffForm } from "./useStaffForm";
import { useStaffOperations } from "./useStaffOperations";
import { useStaffSync } from "./useStaffSync";

export function useStaffManagement() {
  const { staffMembers, loading, fetchStaffMembers } = useStaffFetch();
  
  const {
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
    startEdit,
    resetForm
  } = useStaffForm();
  
  const { syncing, syncWithGoHighLevel } = useStaffSync(fetchStaffMembers);
  
  const {
    handleAddStaff: baseHandleAddStaff,
    handleEditStaff: baseHandleEditStaff,
    handleDeleteStaff
  } = useStaffOperations(fetchStaffMembers);

  // Create wrapper functions with simpler signatures for component use
  const handleAddStaff = async (e: React.FormEvent) => {
    return baseHandleAddStaff(e, email, firstName, lastName, role, password, resetForm);
  };

  const handleEditStaff = async (e: React.FormEvent) => {
    return baseHandleEditStaff(e, isEditing, email, firstName, lastName, role, resetForm);
  };

  return {
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
  };
}

export * from "./useStaffFetch";
export * from "./useStaffForm";
export * from "./useStaffOperations";
export * from "./useStaffSync";
