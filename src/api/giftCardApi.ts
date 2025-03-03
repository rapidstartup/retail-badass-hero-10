
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GiftCard, CreateGiftCardParams, RedeemGiftCardParams } from "@/types/giftCard";

// Generate a random gift card code (16 characters)
const generateGiftCardCode = (): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking characters
  let result = '';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) {
      result += '-';
    }
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Helper function to handle type conversions
const giftCardConverter = (data: any): GiftCard => {
  return {
    id: data.id,
    code: data.code,
    initial_value: data.initial_value,
    current_value: data.current_value,
    is_active: data.is_active,
    expires_at: data.expires_at,
    customer_id: data.customer_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    redeemed_at: data.redeemed_at,
    created_by_staff_id: data.created_by_staff_id
  };
};

// We'll need to create a gift_cards table first through SQL migration
// For now, we'll simulate the API calls and handle them properly once the table exists
export const createGiftCard = async (params: CreateGiftCardParams): Promise<GiftCard | null> => {
  try {
    // Since the gift_cards table doesn't exist yet in the Supabase schema,
    // we'll create a mock response for now
    const code = generateGiftCardCode();
    
    const mockGiftCard: GiftCard = {
      id: crypto.randomUUID(),
      code: code,
      initial_value: params.initial_value,
      current_value: params.initial_value,
      is_active: true,
      expires_at: params.expires_at || null,
      customer_id: params.customer_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      redeemed_at: null,
      created_by_staff_id: null
    };
    
    // Once the gift_cards table is created, uncomment this code:
    /*
    const { data, error } = await supabase
      .from("gift_cards")
      .insert([{
        code: code,
        initial_value: params.initial_value,
        current_value: params.initial_value,
        is_active: true,
        expires_at: params.expires_at || null,
        customer_id: params.customer_id || null
      }])
      .select();

    if (error) {
      throw error;
    }

    return data && data[0] ? giftCardConverter(data[0]) : null;
    */
    
    return mockGiftCard;
  } catch (error) {
    console.error("Error creating gift card:", error);
    toast.error("Failed to create gift card");
    return null;
  }
};

export const fetchGiftCards = async (): Promise<GiftCard[]> => {
  try {
    // Mock response until gift_cards table exists
    return [];
    
    /*
    const { data, error } = await supabase
      .from("gift_cards")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data ? data.map(card => giftCardConverter(card)) : [];
    */
  } catch (error) {
    console.error("Error fetching gift cards:", error);
    toast.error("Failed to fetch gift cards");
    return [];
  }
};

export const fetchGiftCardsByCustomer = async (customerId: string): Promise<GiftCard[]> => {
  try {
    // Mock response until gift_cards table exists
    return [];
    
    /*
    const { data, error } = await supabase
      .from("gift_cards")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data ? data.map(card => giftCardConverter(card)) : [];
    */
  } catch (error) {
    console.error(`Error fetching gift cards for customer ${customerId}:`, error);
    toast.error("Failed to fetch gift cards");
    return [];
  }
};

export const fetchGiftCardByCode = async (code: string): Promise<GiftCard | null> => {
  try {
    // Mock response until gift_cards table exists
    return null;
    
    /*
    const { data, error } = await supabase
      .from("gift_cards")
      .select("*")
      .eq("code", code)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found
        toast.error("Gift card not found");
        return null;
      }
      throw error;
    }

    return data ? giftCardConverter(data) : null;
    */
  } catch (error) {
    console.error(`Error fetching gift card with code ${code}:`, error);
    toast.error("Failed to fetch gift card");
    return null;
  }
};

export const redeemGiftCard = async ({ code, amount }: RedeemGiftCardParams): Promise<GiftCard | null> => {
  try {
    // Mock response until gift_cards table exists
    return null;
    
    /*
    // First, get the current gift card
    const giftCard = await fetchGiftCardByCode(code);
    
    if (!giftCard) {
      toast.error("Gift card not found");
      return null;
    }
    
    if (!giftCard.is_active) {
      toast.error("This gift card is no longer active");
      return null;
    }
    
    if (giftCard.current_value < amount) {
      toast.error("Insufficient balance on gift card");
      return null;
    }
    
    // Calculate new balance
    const newBalance = giftCard.current_value - amount;
    const isNowEmpty = newBalance === 0;
    
    // Update the gift card
    const { data, error } = await supabase
      .from("gift_cards")
      .update({
        current_value: newBalance,
        is_active: !isNowEmpty,
        redeemed_at: isNowEmpty ? new Date().toISOString() : giftCard.redeemed_at,
        updated_at: new Date().toISOString()
      })
      .eq("id", giftCard.id)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return data ? giftCardConverter(data) : null;
    */
  } catch (error) {
    console.error("Error redeeming gift card:", error);
    toast.error("Failed to redeem gift card");
    return null;
  }
};

export const deactivateGiftCard = async (id: string): Promise<boolean> => {
  try {
    // Mock response until gift_cards table exists
    return true;
    
    /*
    const { error } = await supabase
      .from("gift_cards")
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      throw error;
    }
    */
    
    return true;
  } catch (error) {
    console.error(`Error deactivating gift card ${id}:`, error);
    toast.error("Failed to deactivate gift card");
    return false;
  }
};

export { type GiftCard };
