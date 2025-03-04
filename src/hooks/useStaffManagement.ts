
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { StaffMember, StaffFormState } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";

export function useStaffManagement() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  
  // Form state
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("staff");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    setLoading(true);
    try {
      console.log("Fetching staff members from Supabase...");
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      console.log("Staff members fetched:", data);
      setStaffMembers(data || []);
    } catch (error: any) {
      console.error("Error fetching staff:", error);
      toast.error(`Error fetching staff: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
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

  const handleEditStaff = async (e: React.FormEvent) => {
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

  const startEdit = (staff: StaffMember) => {
    setIsEditing(staff.id);
    setEmail(staff.email);
    setFirstName(staff.first_name);
    setLastName(staff.last_name);
    setRole(staff.role);
    setPassword(""); // Don't set password when editing
  };

  const resetForm = () => {
    setIsEditing(null);
    setEmail("");
    setFirstName("");
    setLastName("");
    setRole("staff");
    setPassword("");
  };

  const syncWithGoHighLevel = async (goHighLevelApiKey: string | undefined) => {
    setSyncing(true);
    try {
      console.log("Syncing with GoHighLevel...");
      
      if (!goHighLevelApiKey) {
        throw new Error("GoHighLevel API key is not configured");
      }
      
      // Call Supabase Edge Function to handle GoHighLevel sync
      const { data, error } = await supabase.functions.invoke('staff', {
        body: { 
          apiKey: goHighLevelApiKey 
        },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Fix: Pass string literals directly in the headers object
          // instead of trying to use the action property which is causing the type error
        }
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Staff synchronized with GoHighLevel successfully:", data);
      toast.success("Staff synchronized with GoHighLevel successfully");
      fetchStaffMembers();
    } catch (error: any) {
      console.error("Error syncing with GoHighLevel:", error);
      toast.error(`Error syncing with GoHighLevel: ${error.message}`);
    } finally {
      setSyncing(false);
    }
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
    syncWithGoHighLevel
  };
}
