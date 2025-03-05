
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { StaffMember } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";

export function useStaffFetch() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaffMembers = async () => {
    setLoading(true);
    
    try {
      console.log("Fetching staff members from Supabase...");
      
      const { data, error } = await supabase
        .from('staff')
        .select('*');
      
      if (error) {
        console.error("Error fetching staff members:", error);
        toast.error(`Failed to load staff: ${error.message}`);
        setStaffMembers([]);
        return;
      }
      
      console.log("Staff data received:", data);
      
      if (!data || data.length === 0) {
        console.log("No staff members found in the database");
        setStaffMembers([]);
        return;
      }
      
      // Map the data to ensure the correct shape
      const formattedStaff = data.map(staff => ({
        id: staff.id,
        email: staff.email,
        first_name: staff.first_name,
        last_name: staff.last_name,
        role: staff.role,
        auth_id: staff.auth_id,
        gohighlevel_id: staff.gohighlevel_id
      }));
      
      console.log("Formatted staff data:", formattedStaff);
      setStaffMembers(formattedStaff);
      
    } catch (error: any) {
      console.error("Exception during staff fetch:", error);
      toast.error(`Failed to load staff: ${error.message}`);
      setStaffMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    console.log("useStaffFetch hook mounted - fetching initial data");
    fetchStaffMembers();
  }, []);

  return {
    staffMembers,
    setStaffMembers,
    loading,
    refetch: fetchStaffMembers
  };
}
