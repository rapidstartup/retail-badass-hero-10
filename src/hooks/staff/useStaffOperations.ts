
import { toast } from "sonner";
import { StaffMember } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";

export function useStaffOperations(refetch: () => void) {
  const handleAddStaff = async (
    e: React.FormEvent, 
    email: string, 
    firstName: string, 
    lastName: string, 
    role: string, 
    password: string, 
    resetForm: () => void
  ) => {
    e.preventDefault();
    
    try {
      console.log("Adding new staff member:", { email, firstName, lastName, role });
      
      // Use the edge function to create staff member, which has admin privileges
      // and can bypass RLS policies
      const { data, error } = await supabase.functions.invoke('staff', {
        body: { 
          email,
          firstName,
          lastName,
          role,
          password,
          action: 'create-staff'
        }
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Staff member created:", data);
      toast.success("Staff member added successfully");
      resetForm();
      refetch();
    } catch (error: any) {
      console.error("Error adding staff:", error);
      toast.error(`Error adding staff: ${error.message}`);
    }
  };

  const handleEditStaff = async (
    e: React.FormEvent, 
    isEditing: string | null,
    email: string, 
    firstName: string, 
    lastName: string, 
    role: string,
    resetForm: () => void
  ) => {
    e.preventDefault();
    if (!isEditing) return;
    
    try {
      console.log("Updating staff member ID:", isEditing);
      
      // Use the edge function to update staff member, which has admin privileges
      const { data, error } = await supabase.functions.invoke('staff', {
        body: { 
          id: isEditing,
          email,
          firstName,
          lastName,
          role,
          action: 'update-staff'
        }
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Staff member updated:", data);
      toast.success("Staff member updated successfully");
      resetForm();
      refetch();
    } catch (error: any) {
      console.error("Error updating staff:", error);
      toast.error(`Error updating staff: ${error.message}`);
    }
  };

  const handleDeleteStaff = async (id: string, authId: string | null) => {
    try {
      console.log("Deleting staff member ID:", id, "Auth ID:", authId);
      
      // Use the edge function to delete staff, which has admin privileges
      const { data, error } = await supabase.functions.invoke('staff', {
        body: { 
          staffId: id,
          userId: authId,
          action: 'delete-staff'
        }
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Staff deleted successfully:", data);
      toast.success("Staff member deleted successfully");
      refetch();
    } catch (error: any) {
      console.error("Error deleting staff:", error);
      toast.error(`Error deleting staff: ${error.message}`);
    }
  };

  return {
    handleAddStaff,
    handleEditStaff,
    handleDeleteStaff
  };
}
