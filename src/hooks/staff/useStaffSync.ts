
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useStaffSync(refetch: () => void) {
  const [syncing, setSyncing] = useState(false);

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
          apiKey: goHighLevelApiKey,
          action: 'sync-gohighlevel'
        }
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Staff synchronized with GoHighLevel successfully:", data);
      toast.success("Staff synchronized with GoHighLevel successfully");
      refetch();
    } catch (error: any) {
      console.error("Error syncing with GoHighLevel:", error);
      toast.error(`Error syncing with GoHighLevel: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return {
    syncing,
    syncWithGoHighLevel
  };
}
