
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/contexts/SettingsContext";

interface StoreSettings {
  store_name: string;
  store_address: string;
  store_phone: string;
  logo_url?: string;
}

const DEFAULT_STORE = {
  store_name: "NextPOS",
  store_address: "123 Commerce St, City, State 12345",
  store_phone: "(555) 123-4567"
};

export const useStore = () => {
  const { data: store, isLoading } = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("store_name, store_address, store_phone, logo_url")
          .single();

        if (error) {
          console.error("Error fetching store settings:", error);
          return DEFAULT_STORE;
        }
        
        // Merge fetched data with defaults for any missing fields
        return {
          store_name: data?.store_name || DEFAULT_STORE.store_name,
          store_address: data?.store_address || DEFAULT_STORE.store_address,
          store_phone: data?.store_phone || DEFAULT_STORE.store_phone,
          logo_url: data?.logo_url || undefined
        } as StoreSettings;
      } catch (error) {
        console.error("Unexpected error fetching store settings:", error);
        return DEFAULT_STORE;
      }
    },
    placeholderData: DEFAULT_STORE
  });

  return { store: store || DEFAULT_STORE, isLoading };
};
