
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StoreSettings {
  store_name: string;
  store_address: string;
  store_phone: string;
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
      const { data, error } = await supabase
        .from("settings")
        .select("store_name, store_address, store_phone")
        .single();

      if (error) throw error;
      
      // Merge fetched data with defaults for any missing fields
      return {
        store_name: data.store_name || DEFAULT_STORE.store_name,
        store_address: data.store_address || DEFAULT_STORE.store_address,
        store_phone: data.store_phone || DEFAULT_STORE.store_phone
      } as StoreSettings;
    },
    placeholderData: DEFAULT_STORE
  });

  return { store: store || DEFAULT_STORE, isLoading };
};
