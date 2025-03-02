
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface StaffMember {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  auth_id?: string;
  gohighlevel_id?: string;
}

export function useStaffManagement() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
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
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setStaffMembers(data || []);
    } catch (error: any) {
      toast.error(`Error fetching staff: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");
      
      // 2. Add staff record
      const { error: staffError } = await supabase
        .from('staff')
        .insert([
          {
            auth_id: authData.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            role
          }
        ]);
      
      if (staffError) throw staffError;
      
      toast.success("Staff member added successfully");
      resetForm();
      fetchStaffMembers();
    } catch (error: any) {
      toast.error(`Error adding staff: ${error.message}`);
    }
  };

  const handleEditStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    
    try {
      const { error } = await supabase
        .from('staff')
        .update({
          email,
          first_name: firstName,
          last_name: lastName,
          role
        })
        .eq('id', isEditing);
      
      if (error) throw error;
      
      toast.success("Staff member updated successfully");
      resetForm();
      fetchStaffMembers();
    } catch (error: any) {
      toast.error(`Error updating staff: ${error.message}`);
    }
  };

  const handleDeleteStaff = async (id: string, authId: string | null) => {
    try {
      // Delete staff record first
      const { error: staffError } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);
      
      if (staffError) throw staffError;
      
      // If we have an auth_id, delete the auth user too
      if (authId) {
        // This would require admin privileges and should be handled through an Edge Function
        console.log("Would delete auth user with ID:", authId);
        toast.info("Auth user deletion requires admin privileges. Contact your administrator.");
      }
      
      toast.success("Staff member deleted successfully");
      fetchStaffMembers();
    } catch (error: any) {
      toast.error(`Error deleting staff: ${error.message}`);
    }
  };

  const startEdit = (staff: StaffMember) => {
    setIsAdding(false);
    setIsEditing(staff.id);
    setEmail(staff.email);
    setFirstName(staff.first_name);
    setLastName(staff.last_name);
    setRole(staff.role);
    setPassword(""); // Don't set password when editing
  };

  const resetForm = () => {
    setIsAdding(false);
    setIsEditing(null);
    setEmail("");
    setFirstName("");
    setLastName("");
    setRole("staff");
    setPassword("");
  };

  const syncWithGoHighLevel = async (goHighLevelApiKey: string | undefined) => {
    if (!goHighLevelApiKey) {
      toast.error("GoHighLevel API key is not configured");
      return;
    }
    
    setSyncing(true);
    try {
      // This would be implemented in a Supabase Edge Function
      toast.info("GoHighLevel sync functionality will be implemented via Edge Function");
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error: any) {
      toast.error(`Error syncing with GoHighLevel: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return {
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
  };
}
