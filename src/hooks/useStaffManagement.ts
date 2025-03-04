
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { StaffMember, StaffFormState } from "@/types/staff";
import { 
  fetchStaffMembers as apiFetchStaffMembers,
  addStaffMember as apiAddStaffMember,
  updateStaffMember as apiUpdateStaffMember,
  deleteStaffMember as apiDeleteStaffMember,
  syncStaffWithGoHighLevel as apiSyncStaffWithGoHighLevel
} from "@/api/staffApi";

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
      const data = await apiFetchStaffMembers();
      setStaffMembers(data);
    } catch (error: any) {
      toast.error(`Error fetching staff: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await apiAddStaffMember(email, password, firstName, lastName, role);
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
      await apiUpdateStaffMember(isEditing, email, firstName, lastName, role);
      toast.success("Staff member updated successfully");
      resetForm();
      fetchStaffMembers();
    } catch (error: any) {
      toast.error(`Error updating staff: ${error.message}`);
    }
  };

  const handleDeleteStaff = async (id: string, authId: string | null) => {
    try {
      await apiDeleteStaffMember(id, authId);
      toast.success("Staff member deleted successfully");
      fetchStaffMembers();
    } catch (error: any) {
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
      await apiSyncStaffWithGoHighLevel(goHighLevelApiKey);
      toast.success("Staff synchronized with GoHighLevel successfully");
      fetchStaffMembers(); // Refresh the staff list after sync
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
