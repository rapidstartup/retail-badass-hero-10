
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StoreSettings {
  store_name: string;
  store_address: string;
  store_phone: string;
}

export const useStore = () => {
  const { data: store, isLoading } = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("store_name, store_address, store_phone")
        .single();

      if (error) throw error;
      return data as StoreSettings;
    },
  });

  return { store, isLoading };
};
