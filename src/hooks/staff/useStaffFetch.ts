
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
        throw error;
      }
      
      console.log("Staff data fetched successfully:", data);
      setStaffMembers(data || []);
    } catch (error: any) {
      console.error("Error fetching staff:", error);
      toast.error(`Error fetching staff: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchStaffMembers();
  }, []);

  return {
    staffMembers,
    setStaffMembers,
    loading,
    refetch: fetchStaffMembers // Rename to refetch for consistency
  };
}
