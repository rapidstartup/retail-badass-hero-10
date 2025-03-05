
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { StaffMember } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";

export function useStaffFetch() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchAttempts = useRef(0);
  const isMounted = useRef(true);

  const fetchStaffMembers = useCallback(async () => {
    // Prevent excessive fetching
    if (fetchAttempts.current > 5) {
      console.warn("Too many fetch attempts, stopping to prevent infinite loop");
      setLoading(false);
      return;
    }
    
    fetchAttempts.current += 1;
    setLoading(true);
    
    try {
      console.log(`Fetching staff members (attempt ${fetchAttempts.current})...`);
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      console.log(`Staff fetch successful. Found ${data?.length || 0} staff members:`, data);
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setStaffMembers(data || []);
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error fetching staff:", error);
      
      if (isMounted.current) {
        toast.error(`Error fetching staff: ${error.message}`);
        setLoading(false);
      }
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchStaffMembers();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchStaffMembers]);

  // Reset fetch attempts when successfully loaded
  useEffect(() => {
    if (staffMembers.length > 0) {
      fetchAttempts.current = 0;
    }
  }, [staffMembers]);

  return {
    staffMembers,
    setStaffMembers,
    loading,
    fetchStaffMembers,
    refetch: () => {
      fetchAttempts.current = 0; // Reset attempts counter on manual refresh
      fetchStaffMembers();
    }
  };
}
