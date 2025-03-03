
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  total_spend: number | null;
  loyalty_points: number | null;
  tier: string | null;
  notes: string | null;
  photo_url: string | null;
  stripe_customer_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("last_name", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    toast.error("Failed to fetch customers");
    return [];
  }
};

export const fetchCustomerById = async (id: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error(`Error fetching customer with id ${id}:`, error);
    toast.error("Failed to fetch customer details");
    return null;
  }
};

export const createCustomer = async (customerData: Omit<Customer, "id" | "created_at" | "updated_at" | "total_spend" | "loyalty_points" | "tier">): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from("customers")
      .insert([{
        ...customerData,
        total_spend: 0,
        loyalty_points: 0,
        tier: "Bronze"
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error("Error creating customer:", error);
    toast.error("Failed to create customer");
    return null;
  }
};

export const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from("customers")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error(`Error updating customer with id ${id}:`, error);
    toast.error("Failed to update customer");
    return null;
  }
};

export const deleteCustomer = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Error deleting customer with id ${id}:`, error);
    toast.error("Failed to delete customer");
    return false;
  }
};

export const searchCustomers = async (query: string): Promise<Customer[]> => {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order("last_name", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error searching customers:", error);
    toast.error("Failed to search customers");
    return [];
  }
};
