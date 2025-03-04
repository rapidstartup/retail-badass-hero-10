
import { toast } from "sonner";
import { StaffMember } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";

export function useStaffOperations(fetchStaffMembers: () => Promise<void>) {
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
      
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (authError) {
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error("User creation failed - no user returned");
      }
      
      console.log("Auth user created:", authData.user);
      
      // 2. Add staff record
      const { data, error } = await supabase
        .from('staff')
        .insert([
          {
            auth_id: authData.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            role
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error("Error adding staff record:", error);
        throw error;
      }
      
      console.log("Staff record created:", data);
      toast.success("Staff member added successfully");
      resetForm();
      fetchStaffMembers();
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
      
      const { data, error } = await supabase
        .from('staff')
        .update({
          email,
          first_name: firstName,
          last_name: lastName,
          role
        })
        .eq('id', isEditing)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      console.log("Staff member updated:", data);
      toast.success("Staff member updated successfully");
      resetForm();
      fetchStaffMembers();
    } catch (error: any) {
      console.error("Error updating staff:", error);
      toast.error(`Error updating staff: ${error.message}`);
    }
  };

  const handleDeleteStaff = async (id: string, authId: string | null) => {
    try {
      console.log("Deleting staff member ID:", id, "Auth ID:", authId);
      
      // Delete staff record first
      const { error: staffError } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);
      
      if (staffError) {
        throw staffError;
      }
      
      console.log("Staff record deleted successfully");
      
      // If auth_id exists, attempt to delete the auth user (might require admin privileges)
      if (authId) {
        console.log("Attempting to delete auth user with ID:", authId);
        
        // Note: deleting auth users requires admin privileges
        // A more complete solution would use a Supabase Edge Function with admin rights
        
        // This is just for completeness but will likely fail without admin privileges
        try {
          const { error: authError } = await supabase.rpc('delete_user', { user_id: authId });
          if (authError) {
            console.warn("Could not delete auth user (requires admin rights):", authError);
          }
        } catch (authDeleteError) {
          console.warn("Auth user deletion attempt failed (expected if not admin):", authDeleteError);
        }
      }
      
      toast.success("Staff member deleted successfully");
      fetchStaffMembers();
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
