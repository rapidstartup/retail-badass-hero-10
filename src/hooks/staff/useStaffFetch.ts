
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
      console.log("Fetching staff members using edge function...");
      
      // Use the edge function instead of direct query to bypass RLS
      const { data, error } = await supabase.functions.invoke('staff', {
        body: { 
          action: 'list-staff'
        }
      });
      
      if (error) {
        console.error("Error fetching staff members:", error);
        toast.error(`Failed to load staff: ${error.message}`);
        setStaffMembers([]);
        return;
      }
      
      console.log("Staff data received from edge function:", data);
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log("No staff members found or invalid response format");
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
